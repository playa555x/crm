'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Role, Permission } from '@/types/employee'

interface AuthContextType {
  userRole: Role | null;
  setUserRole: (role: Role) => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<Role | null>(null)

  const hasPermission = (permission: string) => {
    if (!userRole) return false
    return userRole.permissions.includes(permission) || userRole.permissions.includes('all')
  }

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

