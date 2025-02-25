import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const json = await request.json()

    const { data: note, error } = await supabase
      .from("notes")
      .insert({
        title: json.title,
        content: json.content,
        contact_id: json.contactId,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(note)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: notes, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}