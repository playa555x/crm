import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const formData = await request.formData()
  const file = formData.get("file") as File
  const contactId = params.id

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${uuidv4()}.${fileExt}`

  const { data, error } = await supabase.storage.from("avatars").upload(fileName, file)

  if (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }

  const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(fileName)

  const imageUrl = publicUrlData.publicUrl

  // Update the contact's avatar URL in the database
  const { error: updateError } = await supabase.from("contacts").update({ avatar_url: imageUrl }).eq("id", contactId)

  if (updateError) {
    console.error("Error updating contact:", updateError)
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 })
  }

  return NextResponse.json({ imageUrl })
}

