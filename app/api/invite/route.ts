import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { email } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

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

    // Hole das Benutzerprofil
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json(
        { error: "Keine Administratorrechte" },
        { status: 403 }
      )
    }

    // Sende die Einladung
    const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        invited_by: session.user.id,
      },
    })

    if (error) throw error

    return NextResponse.json({ message: "Einladung erfolgreich versendet" })
  } catch (error) {
    return NextResponse.json(
      { error: "Fehler beim Senden der Einladung" },
      { status: 500 }
    )
  }
}