import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import type { UpdateMediaDTO } from "@/types/media"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data: media, error } = await supabase
      .from("media")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error) throw error
    if (!media) {
      return NextResponse.json(
        { error: "Media not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(media)
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
    const json: UpdateMediaDTO = await request.json()

    const { data: media, error } = await supabase
      .from("media")
      .update(json)
      .eq("id", params.id)
      .select()
      .single()

    if (error) throw error
    if (!media) {
      return NextResponse.json(
        { error: "Media not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(media)
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
      .from("media")
      .delete()
      .eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}