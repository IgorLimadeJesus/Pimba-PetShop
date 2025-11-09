"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"

export interface User {
  id: string
  username: string
  email: string
  createdAt: string
}

interface UserContextType {
  users: User[]
  addUser: (user: Omit<User, "id" | "createdAt">) => void
  deleteUser: (id: string) => void
  editUser: (id: string, user: Omit<User, "id" | "createdAt">) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])

  // Load users from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem("pimbapets_users")
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    }
  }, [])

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pimbapets_users", JSON.stringify(users))
  }, [users])

  const addUser = (user: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setUsers([...users, newUser])
  }

  const deleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  const editUser = (id: string, user: Omit<User, "id" | "createdAt">) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, ...user } : u)))
  }

  return <UserContext.Provider value={{ users, addUser, deleteUser, editUser }}>{children}</UserContext.Provider>
}

export function useUsers() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUsers must be used within UserProvider")
  }
  return context
}
