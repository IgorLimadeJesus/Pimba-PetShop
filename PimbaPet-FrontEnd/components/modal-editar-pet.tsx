"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, ChevronDown } from "lucide-react"

interface ModalEditarPetProps {
  isOpen: boolean
  onClose: () => void
  pet: { id: string; nome: string; tipo: string; raca: string; dono: string } | null
  donos: Array<{ id: string; nome: string }>
  onSubmit: (id: string, data: { nome: string; tipo: string; raca: string; dono: string }) => void
}

export function ModalEditarPet({ isOpen, onClose, pet, donos, onSubmit }: ModalEditarPetProps) {
  const [formData, setFormData] = useState({ nome: "", tipo: "", raca: "", dono: "" })
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    if (pet) {
      const donoId = donos.find((d) => d.nome === pet.dono)?.id || ""
      setFormData({ nome: pet.nome, tipo: pet.tipo, raca: pet.raca, dono: donoId })
    }
  }, [pet, isOpen, donos])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pet) {
      onSubmit(pet.id, formData)
      onClose()
    }
  }

  if (!isOpen || !pet) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4" style={{ borderLeft: "4px solid #8AC57B" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Editar Pet</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Nome</label>
            <input
              type="text"
              placeholder="Digite o nome do pet"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 border-2 rounded focus:outline-none focus:ring-0"
              style={{ borderColor: "#8AC57B", backgroundColor: "#f9faf8" }}
              required
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Tipo</label>
            <input
              type="text"
              placeholder="Digite o tipo do pet"
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              className="w-full px-3 py-2 border-2 rounded focus:outline-none focus:ring-0"
              style={{ borderColor: "#8AC57B", backgroundColor: "#f9faf8" }}
              required
            />
          </div>

          {/* Raça */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Raça</label>
            <input
              type="text"
              placeholder="Digite a raça do pet"
              value={formData.raca}
              onChange={(e) => setFormData({ ...formData, raca: e.target.value })}
              className="w-full px-3 py-2 border-2 rounded focus:outline-none focus:ring-0"
              style={{ borderColor: "#8AC57B", backgroundColor: "#f9faf8" }}
              required
            />
          </div>

          {/* Dono Dropdown */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Dono</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-3 py-2 border-2 rounded flex items-center justify-between text-left focus:outline-none"
                style={{ borderColor: "#8AC57B", backgroundColor: "#f9faf8" }}
              >
                <span className="text-gray-600">
                  {formData.dono ? donos.find((d) => d.id === formData.dono)?.nome : "Selecione o dono do pet"}
                </span>
                <ChevronDown size={18} style={{ color: "#8AC57B" }} />
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute top-full left-0 right-0 mt-1 bg-white border-2 rounded z-10"
                  style={{ borderColor: "#8AC57B" }}
                >
                  {donos.map((dono) => (
                    <button
                      key={dono.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, dono: dono.id })
                        setIsDropdownOpen(false)
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 text-gray-800 text-sm"
                    >
                      {dono.nome}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 text-white font-bold rounded hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#8AC57B" }}
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  )
}
