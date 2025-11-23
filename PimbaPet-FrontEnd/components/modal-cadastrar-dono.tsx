"use client"

import type React from "react"

import { useState } from "react"
import { useTheme } from "next-themes"
import { X } from "lucide-react"

interface ModalCadastrarDonoProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { nome: string; cpf: string; telefone: string }) => void
}

export function ModalCadastrarDono({ isOpen, onClose, onSubmit }: ModalCadastrarDonoProps) {
  const { theme } = useTheme()
  const [formData, setFormData] = useState({ nome: "", cpf: "", telefone: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ nome: "", cpf: "", telefone: "" })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full mx-4" style={{ borderLeft: "4px solid #8AC57B" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Cadastrar Dono</h2>
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

          {/* CPF */}
          <div>
            <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">CPF</label>
            <input
              type="text"
              placeholder="Digite a CPF"
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
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

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 text-white font-bold rounded hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#8AC57B" }}
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  )
}
