"use client"

import React from "react"
import { X, AlertTriangle } from "lucide-react"
import { useTheme } from "next-themes"

interface ModalExcluirProps {
  isOpen: boolean
  onClose: () => void
  pets: Array<{ id: string; nome: string; donoId: string }>
  donos: Array<{ id: string; nome: string }>
  mode?: "pets" | "donos" | "both"
  onConfirm: (selectedIds: { petIds: string[]; donoIds: string[] }) => void
}

export function ModalExcluir({ isOpen, onClose, pets, donos, onConfirm }: ModalExcluirProps) {
  // default to both if not provided
  const mode = (arguments[0] as any)?.mode ?? "both"
  const { theme } = useTheme()
  const [selectedPets, setSelectedPets] = React.useState<Set<string>>(new Set())
  const [selectedDonos, setSelectedDonos] = React.useState<Set<string>>(new Set())

  const handleSelectPet = (petId: string) => {
    const newSelected = new Set(selectedPets)
    if (newSelected.has(petId)) {
      newSelected.delete(petId)
    } else {
      newSelected.add(petId)
    }
    setSelectedPets(newSelected)
  }

  const handleSelectDono = (donoId: string) => {
    const newSelected = new Set(selectedDonos)
    if (newSelected.has(donoId)) {
      newSelected.delete(donoId)
    } else {
      newSelected.add(donoId)
      // In 'both' mode we auto-select linked pets for convenience. In 'donos' mode we DO NOT auto-select pets.
      if (mode === "both") {
        const linkedPets = pets.filter((p) => p.donoId === donoId).map((p) => p.id)
        const updatedPets = new Set(selectedPets)
        linkedPets.forEach((petId) => updatedPets.add(petId))
        setSelectedPets(updatedPets)
      }
    }
    // ensure set state
    setSelectedDonos(newSelected)
  }

  const handleConfirm = () => {
    onConfirm({
      petIds: Array.from(selectedPets),
      donoIds: Array.from(selectedDonos),
    })
    setSelectedPets(new Set())
    setSelectedDonos(new Set())
    onClose()
  }

  const handleCancel = () => {
    setSelectedPets(new Set())
    setSelectedDonos(new Set())
    onClose()
  }

  if (!isOpen) return null

  const hasSelection = selectedPets.size > 0 || selectedDonos.size > 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
        style={{ borderLeft: "4px solid #dc2626" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600 sticky top-0 bg-white dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} style={{ color: "#dc2626" }} />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Excluir</h2>
          </div>
          <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {mode === "pets" && "Selecione os pets que deseja excluir."}
            {mode === "donos" && "Selecione os donos que deseja excluir. Se excluir um dono, todos os pets vinculados serão excluídos também."}
            {mode === "both" && "Selecione os itens que deseja excluir. Se excluir um dono, todos os pets vinculados serão excluídos também."}
          </p>

          {/* Pets Section */}
          {(mode === "pets" || mode === "both") && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Pets</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {pets.length > 0 ? (
                  pets.map((pet) => (
                    <label
                      key={pet.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPets.has(pet.id)}
                        onChange={() => handleSelectPet(pet.id)}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: "#8AC57B" }}
                      />
                      <span className="text-sm text-gray-800 dark:text-gray-100">{pet.nome}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Nenhum pet disponível</p>
                )}
              </div>
            </div>
          )}

          {/* Donos Section */}
          {(mode === "donos" || mode === "both") && (
            <div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Donos</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {donos.length > 0 ? (
                  donos.map((dono) => {
                    const linkedPetsCount = pets.filter((p) => p.donoId === dono.id).length
                    return (
                      <label
                        key={dono.id}
                        className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDonos.has(dono.id)}
                          onChange={() => handleSelectDono(dono.id)}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: "#8AC57B" }}
                        />
                        <div className="flex-1">
                          <span className="text-sm text-gray-800 dark:text-gray-100">{dono.nome}</span>
                          {linkedPetsCount > 0 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              ({linkedPetsCount} pet{linkedPetsCount > 1 ? "s" : ""})
                            </span>
                          )}
                        </div>
                      </label>
                    )
                  })
                ) : (
                  <p className="text-sm text-gray-500">Nenhum dono disponível</p>
                )}
              </div>
            </div>
          )}

          {/* Summary */}
          {hasSelection && (
            <div
              className="p-3 rounded text-sm"
              style={{
                backgroundColor: theme === "dark" ? "#7f1d1d" : "#fee2e2",
                color: theme === "dark" ? "#fca5a5" : "#dc2626",
              }}
            >
              Serão excluídos: {selectedPets.size} pet{selectedPets.size !== 1 ? "s" : ""} e{" "}
              {selectedDonos.size} dono{selectedDonos.size !== 1 ? "s" : ""}
              {selectedDonos.size > 0 && " (+ pets vinculados)"}
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleConfirm}
              disabled={!hasSelection}
              className="w-full py-2 text-white font-bold rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: hasSelection ? "#dc2626" : "#999" }}
            >
              Confirmar Exclusão
            </button>

            <button
              onClick={handleCancel}
              className="w-full py-2 text-gray-800 dark:text-gray-100 font-bold rounded border-2"
              style={{ borderColor: "#8AC57B", backgroundColor: "transparent" }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
