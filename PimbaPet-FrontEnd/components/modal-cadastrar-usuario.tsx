"use client"

import type React from "react"

import { useState } from "react"
import { useUsers } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ModalCadastrarUsuarioProps {
  isOpen: boolean
  onClose: () => void
}

export function ModalCadastrarUsuario({ isOpen, onClose }: ModalCadastrarUsuarioProps) {
  const { addUser } = useUsers()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.username && formData.email) {
      addUser({
        username: formData.username,
        email: formData.email,
      })
      setFormData({ username: "", email: "" })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md border-l-4"
        style={{ borderLeftColor: "#8AC57B" }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">Cadastrar Usuário</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Usuário</label>
            <Input
              type="text"
              placeholder="Digite o nome do usuário"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full h-10 border rounded px-3 placeholder-gray-400 focus:outline-none"
              style={{ borderColor: "#8AC57B" }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">E-mail</label>
            <Input
              type="email"
              placeholder="Digite o e-mail do usuário"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-10 border rounded px-3 placeholder-gray-400 focus:outline-none"
              style={{ borderColor: "#8AC57B" }}
            />
          </div>

          <Button
            type="submit"
            className="w-full text-white font-semibold py-2 rounded h-10 mt-6"
            style={{ backgroundColor: "#8AC57B" }}
          >
            Cadastrar
          </Button>
        </form>

        <button onClick={onClose} className="w-full text-gray-600 text-sm mt-4 hover:text-gray-800">
          Cancelar
        </button>
      </div>
    </div>
  )
}
