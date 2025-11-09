"use client"

import { useState, useEffect } from "react"

interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: "active" | "inactive" | "prospect"
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedClients = localStorage.getItem("clients")
    if (savedClients) {
      setClients(JSON.parse(savedClients))
    }
    setIsLoading(false)
  }, [])

  const addClient = (clientData: Omit<Client, "id">) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
    }
    const updatedClients = [...clients, newClient]
    setClients(updatedClients)
    localStorage.setItem("clients", JSON.stringify(updatedClients))
  }

  const updateClient = (id: string, clientData: Partial<Client>) => {
    const updatedClients = clients.map((client) => (client.id === id ? { ...client, ...clientData } : client))
    setClients(updatedClients)
    localStorage.setItem("clients", JSON.stringify(updatedClients))
  }

  const deleteClient = (id: string) => {
    const updatedClients = clients.filter((client) => client.id !== id)
    setClients(updatedClients)
    localStorage.setItem("clients", JSON.stringify(updatedClients))
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

  return {
    clients,
    isLoading,
    addClient,
    updateClient,
    deleteClient,
    getClient,
    searchClients,
  }
}
