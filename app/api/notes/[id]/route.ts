import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: note, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: "Notiz konnte nicht gefunden werden" },
        { status: 404 }
      )
    }

    return NextResponse.json(note)
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
    const json = await request.json()

    const { data: note, error } = await supabase
      .from("notes")
      .update({
        title: json.title,
        content: json.content,
        contact_id: json.contactId,
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: "Notiz konnte nicht aktualisiert werden" },
        { status: 400 }
      )
    }

    return NextResponse.json(note)
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
      .from("notes")
      .delete()
      .eq("id", params.id)

    if (error) {
      return NextResponse.json(
        { error: "Notiz konnte nicht gelöscht werden" },
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