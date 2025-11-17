"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { X } from "lucide-react"

interface ModalEditarDonoProps {
  isOpen: boolean
  onClose: () => void
  dono: { id: string; nome: string; telefone: string } | null
  onSubmit: (id: string, data: { nome: string; telefone: string }) => void
}

export function ModalEditarDono(props: ModalEditarDonoProps) {
  const { isOpen, onClose, dono, onSubmit } = props
  const { theme } = useTheme()
  const [formData, setFormData] = useState({ nome: "", telefone: "" })

  useEffect(() => {
    if (dono) {
      setFormData({ nome: dono.nome, telefone: dono.telefone })
    }
  }, [dono, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (dono) {
      onSubmit(dono.id, formData)
      onClose()
    }
  }


  if (!isOpen || !dono) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full mx-4" style={{ borderLeft: "4px solid #8AC57B" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Editar Dono</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Nome</label>
            <input
              type="text"
              placeholder="Digite o Nome do Dono"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 border-2 rounded focus:outline-none focus:ring-0 dark:bg-slate-700 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
              style={{ borderColor: "#8AC57B", backgroundColor: theme === "dark" ? "#1e293b" : "#f9faf8" }}
              required
            />
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Telefone</label>
            <input
              type="text"
              placeholder="Digite o telefone"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              className="w-full px-3 py-2 border-2 rounded focus:outline-none focus:ring-0 dark:bg-slate-700 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
              style={{ borderColor: "#8AC57B", backgroundColor: theme === "dark" ? "#1e293b" : "#f9faf8" }}
              required
            />
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              className="w-full py-2 text-white font-bold rounded hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#8AC57B" }}
            >
              Salvar Alterações
            </button>

            {/* Delete handled inline in the table rows */}
          </div>
        </form>
      </div>
    </div>
  )
}
