"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Check } from "lucide-react"

interface ClientFormProps {
  client?: any
  onSubmit: (client: any) => void
  onCancel: () => void
}

export default function ClientForm({ client, onSubmit, onCancel }: ClientFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "active",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (client) {
      setFormData(client)
    }
  }, [client])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({
      ...formData,
      id: client?.id,
    })
  }

  return (
    <Card className="shadow-sm sticky top-24">
      <CardHeader className="border-b bg-card/50">
        <CardTitle>{client ? "Edit Client" : "Add New Client"}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`transition-colors ${errors.name && touched.name ? "border-red-500 focus:ring-red-500" : ""}`}
            />
            {errors.name && touched.name && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="client@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`transition-colors ${errors.email && touched.email ? "border-red-500 focus:ring-red-500" : ""}`}
            />
            {errors.email && touched.email && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              placeholder="(123) 456-7890"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium">
              Company
            </label>
            <Input
              id="company"
              name="company"
              placeholder="Company name"
              value={formData.company}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="prospect">Prospect</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {client ? "Update" : "Add"} Client
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
