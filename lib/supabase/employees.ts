Kopieren Sie diesen Code in die neue Datei:

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

export async function addEmployee(employeeData: {
  personnelNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  department: string
}) {
  const supabase = createClientComponentClient<Database>()
  
  const { data, error } = await supabase
    .from('employees')
    .insert([employeeData])
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return data
}