import React from 'react'
import { Navbar } from './navbar'
import { Sidebar } from './sidebar'

export function Layout({ children, setActiveView }: { children: React.ReactNode, setActiveView: (view: string) => void }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar setActiveView={setActiveView} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

