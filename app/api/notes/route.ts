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
    
    console.log("Received note data:", json)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Transform contactId to contact_id for database
    const { contactId, ...rest } = json
    const noteData = {
      ...rest,
      contact_id: contactId,
      created_by: user.id,
    }

    console.log("Creating note with data:", noteData)

    const { data: note, error } = await supabase
      .from("notes")
      .insert(noteData)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error("Error creating note:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}