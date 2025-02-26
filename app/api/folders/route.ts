import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import type { CreateFolderDTO } from "@/types/media"

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get('contactId')

    if (!contactId) {
      return NextResponse.json(
        { error: "Contact ID is required" },
        { status: 400 }
      )
    }

    const { data: folders, error } = await supabase
      .from("folders")
      .select("*")
      .eq("contact_id", contactId)
      .order("created_at", { ascending: true })

    if (error) throw error

    return NextResponse.json(folders)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const json: CreateFolderDTO = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { data: folder, error } = await supabase
      .from("folders")
      .insert({
        name: json.name,
        contact_id: json.contact_id,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(folder)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}