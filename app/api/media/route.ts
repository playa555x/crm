import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import type { CreateMediaDTO, Media } from "@/types/media"

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get('contactId')

    let query = supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false })

    if (contactId) {
      query = query.eq("contact_id", contactId)
    }

    const { data: media, error } = await query

    if (error) throw error

    return NextResponse.json(media)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const json: CreateMediaDTO = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { data: media, error } = await supabase
      .from("media")
      .insert({
        ...json,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(media)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}