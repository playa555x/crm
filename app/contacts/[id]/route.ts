import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Hilfs-Funktion zur Konvertierung von snake_case zu camelCase
const snakeToCamelCase = (data: any) => {
  if (Array.isArray(data)) {
    return data.map(item => snakeToCamelCase(item))
  }
  
  if (typeof data === 'object' && data !== null) {
    const newData: any = {}
    Object.keys(data).forEach(key => {
      const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase())
      newData[camelKey] = snakeToCamelCase(data[key])
    })
    return newData
  }
  
  return data
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: contact, error } = await supabase
      .from("contacts")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: "Kontakt konnte nicht gefunden werden" },
        { status: 404 }
      )
    }

    // Konvertiere die Daten zu camelCase
    const convertedContact = snakeToCamelCase(contact)

    return NextResponse.json(convertedContact)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()

    const { data: contact, error } = await supabase
      .from("contacts")
      .update(body)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: "Kontakt konnte nicht aktualisiert werden" },
        { status: 400 }
      )
    }

    // Konvertiere die Daten zu camelCase
    const convertedContact = snakeToCamelCase(contact)

    return NextResponse.json(convertedContact)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq("id", params.id)

    if (error) {
      return NextResponse.json(
        { error: "Kontakt konnte nicht gelöscht werden" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}