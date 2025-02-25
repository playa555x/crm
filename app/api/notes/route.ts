import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import type { CreateNoteDTO, Note } from "@/types/note"

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get('contactId')

    let query = supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false })

    if (contactId) {
      query = query.eq("contact_id", contactId)
    }

    const { data: notes, error } = await query

    if (error) throw error

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const json: CreateNoteDTO = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { data: note, error } = await supabase
      .from("notes")
      .insert({
        ...json,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(note)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}