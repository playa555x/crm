import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

interface InviteRequest {
  email: string
  role: string
  userData: {
    personnelNumber: string
    firstName: string
    lastName: string
    phone: string
    position: string
    department: string
  }
}

export async function POST(request: Request) {
  // Erstelle einen normalen Client für Autorisierungsprüfungen
  const supabase = createRouteHandlerClient({ cookies })
  
  // Erstelle einen Service Role Client für administrative Aktionen
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true
      }
    }
  )

  try {
    // Überprüfe, ob der anfragende Benutzer ein Admin ist
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      )
    }

    // Hole das Benutzerprofil des Admins
    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()

    if (adminProfile?.role !== "admin") {
      return NextResponse.json(
        { error: "Keine Administratorrechte" },
        { status: 403 }
      )
    }

    // Parse request body
    const { email, role, userData }: InviteRequest = await request.json()

    // Überprüfe, ob die E-Mail bereits existiert
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: "Diese E-Mail-Adresse wird bereits verwendet" },
        { status: 400 }
      )
    }

    // Sende die Einladung mit dem Service Role Client
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      email_confirm: true,
      user_metadata: {
        invited_by: session.user.id,
        role: role,
        firstName: userData.firstName,
        lastName: userData.lastName,
        personnelNumber: userData.personnelNumber,
      }
    })

    if (inviteError) {
      console.error('Einladungsfehler:', inviteError)
      return NextResponse.json(
        { error: "Fehler beim Senden der Einladung: " + inviteError.message },
        { status: 500 }
      )
    }

    // Erstelle den Mitarbeitereintrag mit dem Service Role Client
    const { error: employeeError } = await supabaseAdmin
      .from("employees")
      .insert([
        {
          ...userData,
          email: email,
          status: "pending",
          created_by: session.user.id,
          created_at: new Date().toISOString(),
        }
      ])

    if (employeeError) {
      // Wenn der Mitarbeitereintrag fehlschlägt, versuche die Einladung rückgängig zu machen
      await supabaseAdmin.auth.admin.deleteUser(inviteData.user.id)
      
      console.error('Mitarbeitereintragsfehler:', employeeError)
      return NextResponse.json(
        { error: "Fehler beim Erstellen des Mitarbeitereintrags: " + employeeError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: "Einladung erfolgreich versendet",
      data: {
        email,
        status: "pending"
      }
    })

  } catch (error) {
    console.error("Einladungsfehler:", error)
    return NextResponse.json(
      { error: "Ein unerwarteter Fehler ist aufgetreten" },
      { status: 500 }
    )
  }
}