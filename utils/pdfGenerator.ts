import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

export const generatePDF = (data: any) => {
  const doc = new jsPDF()

  // Add a title
  doc.setFontSize(18)
  doc.text('BESS Formular', 14, 22)

  // Add content
  doc.setFontSize(12)
  doc.text(`Datum: ${data.date}`, 14, 30)
  doc.text(`Kunde: ${data.customerName}`, 14, 38)

  // Add a table with the form data
  const tableData = Object.entries(data).map(([key, value]) => [key, value])
  
  doc.autoTable({
    startY: 45,
    head: [['Feld', 'Wert']],
    body: tableData,
  })

  // Save the PDF
  doc.save('BESS_Formular.pdf')
}

