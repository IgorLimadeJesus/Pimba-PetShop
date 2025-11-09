"use client"

import { createContext, useContext, type ReactNode, useState, useEffect } from "react"

interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: "active" | "inactive" | "prospect"
}

interface ClientContextType {
  clients: Client[]
  addClient: (client: Omit<Client, "id">) => void
  updateClient: (id: string, client: Partial<Client>) => void
  deleteClient: (id: string) => void
  getClient: (id: string) => Client | undefined
  searchClients: (term: string) => Client[]
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    // Load clients from localStorage
    const savedClients = localStorage.getItem("clients")
    if (savedClients) {
      setClients(JSON.parse(savedClients))
    }
  }, [])

  const saveToLocalStorage = (updatedClients: Client[]) => {
    localStorage.setItem("clients", JSON.stringify(updatedClients))
  }

  const addClient = (clientData: Omit<Client, "id">) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
    }
    const updatedClients = [...clients, newClient]
    setClients(updatedClients)
    saveToLocalStorage(updatedClients)
  }

  const updateClient = (id: string, clientData: Partial<Client>) => {
    const updatedClients = clients.map((client) => (client.id === id ? { ...client, ...clientData } : client))
    setClients(updatedClients)
    saveToLocalStorage(updatedClients)
  }

  const deleteClient = (id: string) => {
    const updatedClients = clients.filter((client) => client.id !== id)
    setClients(updatedClients)
    saveToLocalStorage(updatedClients)
  }

  const getClient = (id: string) => {
    return clients.find((client) => client.id === id)
  }

  const searchClients = (term: string) => {
    const lowerTerm = term.toLowerCase()
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(lowerTerm) ||
        client.email.toLowerCase().includes(lowerTerm) ||
        client.company?.toLowerCase().includes(lowerTerm),
    )
  }

  return (
    <ClientContext.Provider value={{ clients, addClient, updateClient, deleteClient, getClient, searchClients }}>
      {children}
    </ClientContext.Provider>
  )
}

export function useClient() {
  const context = useContext(ClientContext)
  if (context === undefined) {
    throw new Error("useClient must be used within a ClientProvider")
  }
  return context
}
