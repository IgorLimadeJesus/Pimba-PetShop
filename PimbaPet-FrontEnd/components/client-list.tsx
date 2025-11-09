"use client"

import { Button } from "@/components/ui/button"
import { Trash2, Edit2, Mail, Phone } from "lucide-react"

interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: "active" | "inactive" | "prospect"
}

interface ClientListProps {
  clients: Client[]
  onEdit: (client: Client) => void
  onDelete: (id: string) => void
}

export default function ClientList({ clients, onEdit, onDelete }: ClientListProps) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No clients found. Add your first client to get started!</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "prospect":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-3">
      {clients.map((client) => (
        <div key={client.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg">{client.name}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${client.email}`} className="hover:text-primary">
                    {client.email}
                  </a>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{client.phone}</span>
                  </div>
                )}
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-4 ${getStatusColor(client.status)}`}
            >
              {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
            </span>
          </div>

          {client.company && (
            <div className="text-sm text-muted-foreground mb-3">
              <p>
                Company: <span className="text-foreground font-medium">{client.company}</span>
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t">
            <Button
              onClick={() => onEdit(client)}
              size="sm"
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </Button>
            <Button
              onClick={() => {
                if (confirm("Are you sure you want to delete this client?")) {
                  onDelete(client.id)
                }
              }}
              size="sm"
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
