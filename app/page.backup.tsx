'use client'

import { useState } from 'react'
import { Layout } from '@/components/layout'
import { Dashboard } from '@/components/dashboard'
import { Deals } from '@/components/deals'
import { Contacts } from '@/components/contacts'
import { CalendarView } from '@/components/calendar'
import { Email } from '@/components/email'
import { Employees } from '@/components/employees'
import { Apps } from '@/components/apps'
import { More } from '@/components/more'

export default function Home() {
  const [activeView, setActiveView] = useState('dashboard')

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />
      case 'deals':
        return <Deals />
      case 'contacts':
        return <Contacts />
      case 'calendar':
        return <CalendarView />
      case 'email':
        return <Email />
      case 'employees':
        return <Employees />
      case 'apps':
        return <Apps />
      case 'more':
        return <More />
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout setActiveView={setActiveView}>
      {renderView()}
    </Layout>
  )
}

