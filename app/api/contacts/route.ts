import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const contact = await request.json()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Nicht autorisiert" },
        { status: 401 }
      )
    }

    // Convert camelCase to snake_case for database
    const contactData = {
      first_name: contact.firstName,
      last_name: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      mobile: contact.mobile,
      company: contact.company,
      position: contact.position,
      street: contact.street,
      house_number: contact.houseNumber,
      postcode: contact.postcode,
      city: contact.city,
      website: contact.website,
      notes: contact.notes,
      responsible_employee: contact.responsibleEmployee,
      category: contact.category,
      company_contact_person: contact.companyContactPerson,
      preferred_contact_method: contact.preferredContactMethod,
      preferred_contact_person: contact.preferredContactPerson,
      customer_number: contact.customerNumber,
      project_description: contact.projectDescription,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select()
      .single()

    if (error) {
      console.error('Error creating contact:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: "Interner Server Fehler" },
      { status: 500 }
    )
  }
}