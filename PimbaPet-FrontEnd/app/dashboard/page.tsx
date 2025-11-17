"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, Trash2, Edit2 } from "lucide-react"
import { useTheme } from "next-themes"
import { ModalCadastrarDono } from "@/components/modal-cadastrar-dono"
import { ModalCadastrarPet } from "@/components/modal-cadastrar-pet"
import { ModalEditarDono } from "@/components/modal-editar-dono"
import { ModalEditarPet } from "@/components/modal-editar-pet"
import { ModalCadastrarUsuario } from "@/components/modal-cadastrar-usuario"
import { ModalExcluir } from "@/components/modal-excluir"
import { getDonos, createDono, getPets, createPet, deleteDono, deletePet, type Dono, type Pet } from "@/lib/api"

export default function DashboardPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [pets, setPets] = useState<Pet[]>([])
  const [donos, setDonos] = useState<Dono[]>([])
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [isModalDonoOpen, setIsModalDonoOpen] = useState(false)
  const [isModalPetOpen, setIsModalPetOpen] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isEditModalDonoOpen, setIsEditModalDonoOpen] = useState(false)
  const [isEditModalPetOpen, setIsEditModalPetOpen] = useState(false)
  const [selectedDono, setSelectedDono] = useState<Dono | null>(null)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false)
  const [excluirMode, setExcluirMode] = useState<'pets' | 'donos' | 'both'>('both')
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (!savedUser) {
      router.push("/login")
    } else {
      setUser(JSON.parse(savedUser))
      loadData()
    }
  }, [router])

  useEffect(() => {
    // Prevent theme icon mismatch between server and client
    setMounted(true)
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const [donosData, petsData] = await Promise.all([getDonos(), getPets()])
    setDonos(donosData)
    setPets(petsData)
    setIsLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const handleAddDono = async (data: { nome: string; cpf: string; telefone: string }) => {
    const newDono = await createDono(data)
    if (newDono) {
      setDonos([...donos, newDono])
    }
  }

  const handleAddPet = async (data: { nome: string; tipo: string; raca: string; dono: string }) => {
    const newPet = await createPet({
      nome: data.nome,
      tipo: data.tipo,
      raca: data.raca,
      donoId: data.dono,
    })
    if (newPet) {
      setPets([...pets, newPet])
    }
  }

  const handleEditDono = (id: string, data: { nome: string; telefone: string }) => {
    setDonos(donos.map((dono) => (dono.id === id ? { ...dono, ...data } : dono)))
    setIsEditModalDonoOpen(false)
  }

  const handleEditPet = (id: string, data: { nome: string; tipo: string; raca: string; dono: string }) => {
    setPets(
      pets.map((pet) =>
        pet.id === id ? { ...pet, nome: data.nome, tipo: data.tipo, raca: data.raca, donoId: data.dono } : pet,
      ),
    )
    setIsEditModalPetOpen(false)
  }

  const handleDeleteDono = async (id: string) => {
    try {
      const ok = await deleteDono(id)
      if (ok) {
        setDonos((prev) => prev.filter((d) => d.id !== id))
      } else {
        alert("Falha ao excluir dono. Veja o console para mais detalhes.")
      }
    } catch (e) {
      console.error(e)
      alert("Erro ao excluir dono")
    }
  }

  const handleDeletePet = async (id: string) => {
    try {
      const ok = await deletePet(id)
      if (ok) {
        setPets((prev) => prev.filter((p) => p.id !== id))
      } else {
        alert("Falha ao excluir pet. Veja o console para mais detalhes.")
      }
    } catch (e) {
      console.error(e)
      alert("Erro ao excluir pet")
    }
  }

  const handleExcluir = async (selectedIds: { petIds: string[]; donoIds: string[] }) => {
    try {
      // Delete selected pets
      for (const petId of selectedIds.petIds) {
        await deletePet(petId)
      }

      // Delete selected donos and their linked pets
      for (const donoId of selectedIds.donoIds) {
        // Delete pets linked to this dono
        const linkedPets = pets.filter((p) => p.donoId === donoId)
        for (const pet of linkedPets) {
          await deletePet(pet.id)
        }
        // Delete the dono
        await deleteDono(donoId)
      }

      // Reload data
      await loadData()
      alert("Exclusão realizada com sucesso!")
    } catch (e) {
      console.error(e)
      alert("Erro ao excluir. Veja o console para mais detalhes.")
    }
  }

  const openEditDono = () => {
    if (donos.length > 0) {
      setSelectedDono(donos[0])
      setIsEditModalDonoOpen(true)
    }
  }

  const openEditPet = () => {
    if (pets.length > 0) {
      setSelectedPet(pets[0])
      setIsEditModalPetOpen(true)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Carregando dados...</p>
      </div>
    )
  }

  // derive filtered lists based on search term
  const normalizedTerm = searchTerm.trim().toLowerCase()
  const filteredPets = normalizedTerm
    ? pets.filter((pet) => {
      const donoName = donos.find((d) => d.id === pet.donoId)?.nome || ''
      return (
        pet.nome.toLowerCase().includes(normalizedTerm) ||
        pet.tipo.toLowerCase().includes(normalizedTerm) ||
        pet.raca.toLowerCase().includes(normalizedTerm) ||
        donoName.toLowerCase().includes(normalizedTerm)
      )
    })
    : pets

  const filteredDonos = normalizedTerm
    ? donos.filter((dono) =>
      [dono.nome, dono.cpf, dono.telefone].some((v) => v?.toLowerCase().includes(normalizedTerm)),
    )
    : donos

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold" style={{ color: "#8AC57B" }}>
              ♣ PimbaPets
            </div>
            <nav className="flex items-center gap-6">
              <a
                href="/dashboard"
                className="text-gray-700 dark:text-gray-200 font-medium"
                style={{ color: "#8AC57B", cursor: "pointer" }}
              >
                Início
              </a>
              <a
                href="/dashboard"
                className="text-gray-700 dark:text-gray-200 font-medium"
                style={{ color: "#8AC57B", cursor: "pointer" }}
              >
                Clientes
              </a>
            </nav>
          </div>

          {/* Search and User Actions */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder="Pesquisar..."
                className="w-48 h-9 border border-gray-300 dark:border-gray-600 rounded pl-3 pr-9 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100"
              />
              <Search className="w-4 h-4 text-gray-400 dark:text-gray-300 absolute right-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-sm">👤</span>
              <button
                onClick={() => router.push("/signup-admin")}
                className="text-gray-700 dark:text-gray-200 font-medium flex items-center"
                style={{ color: "#8AC57B", cursor: "pointer" }}
              >
                Cadastrar
              </button>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                title="Toggle dark / light"
                className="ml-2 p-1 rounded"
                style={{ color: "#8AC57B", cursor: "pointer", background: "transparent", border: "1px solid #8AC57B", padding: "4px" }}
              >
                {theme === "dark" ? "🌙" : "🌞"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">CLIENTES</h2>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pets Section */}
          <div
            style={{ border: "2px solid #8AC57B", borderRadius: "4px" }}
            className="bg-white dark:bg-slate-800 overflow-hidden flex flex-col h-full"
          >
            <div style={{ backgroundColor: "#8AC57B" }} className="text-white px-4 py-2 font-bold">
              Pets
            </div>
            <div className="overflow-x-auto flex-1 min-h-0">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid #8AC57B" }}>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Nome</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Tipo | Raça</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Dono</th>
                    <th className="px-4 py-3 text-right text-sm font-bold text-gray-800">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPets.length > 0 ? (
                    filteredPets.map((pet) => {
                      const donoName = donos.find((d) => d.id === pet.donoId)?.nome || "N/A"
                      return (
                        <tr key={pet.id} style={{ borderBottom: "1px solid #d0e8d8" }}>
                          <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{pet.nome}</td>
                          <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                            {pet.tipo} | {pet.raca}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{donoName}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              title="Excluir pet"
                              aria-label="Excluir pet"
                              onClick={() => {
                                if (confirm(`Tem certeza que deseja excluir o pet "${pet.nome}"?`)) {
                                  handleDeletePet(pet.id)
                                }
                              }}
                              className="inline-flex items-center justify-center p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                        Nenhum pet encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-[#8AC57B] px-4 py-3 bg-gray-50 dark:bg-slate-800 flex gap-2">
              <button
                onClick={() => setIsModalPetOpen(true)}
                className="w-full sm:flex-1 text-white font-semibold py-2 rounded h-9"
                style={{ backgroundColor: "#8AC57B", cursor: "pointer" }}
              >
                Cadastrar
              </button>
              <button
                onClick={openEditPet}
                className="w-full sm:flex-1 text-white font-semibold py-2 rounded h-9"
                style={{ backgroundColor: "#6fa85d", cursor: "pointer" }}
              >
                Editar
              </button>
              <button
                onClick={() => {
                  setExcluirMode('pets')
                  setIsExcluirModalOpen(true)
                }}
                className="w-full sm:flex-1 text-white font-semibold py-2 rounded h-9"
                style={{ backgroundColor: "#dc2626", cursor: "pointer" }}
              >
                Excluir
              </button>
            </div>
          </div>

          {/* Donos Section */}
          <div
            style={{ border: "2px solid #8AC57B", borderRadius: "4px" }}
            className="bg-white dark:bg-slate-800 overflow-hidden flex flex-col h-full"
          >
            <div style={{ backgroundColor: "#8AC57B" }} className="text-white px-4 py-2 font-bold">
              Donos
            </div>
            <div className="overflow-x-auto flex-1 min-h-0">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid #8AC57B" }}>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Nome</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Telefone</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">CPF</th>
                    <th className="px-4 py-3 text-right text-sm font-bold text-gray-800">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonos.length > 0 ? (
                    filteredDonos.map((dono) => (
                      <tr key={dono.id} style={{ borderBottom: "1px solid #d0e8d8" }}>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{dono.nome}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{dono.telefone}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{dono.cpf}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            title="Excluir dono"
                            aria-label="Excluir dono"
                            onClick={() => {
                              if (confirm(`Tem certeza que deseja excluir o dono "${dono.nome}"?`)) {
                                handleDeleteDono(dono.id)
                              }
                            }}
                            className="inline-flex items-center justify-center p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                        Nenhum dono encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-[#8AC57B] px-4 py-3 bg-gray-50 dark:bg-slate-800 flex gap-2">
              <button
                onClick={() => setIsModalDonoOpen(true)}
                className="w-full sm:flex-1 text-white font-semibold py-2 rounded h-9"
                style={{ backgroundColor: "#8AC57B", cursor: "pointer" }}
              >
                Cadastrar
              </button>
              <button
                onClick={openEditDono}
                className="w-full sm:flex-1 text-white font-semibold py-2 rounded h-9"
                style={{ backgroundColor: "#6fa85d", cursor: "pointer" }}
              >
                Editar
              </button>
              <button
                onClick={() => {
                  setExcluirMode('donos')
                  setIsExcluirModalOpen(true)
                }}
                className="w-full sm:flex-1 text-white font-semibold py-2 rounded h-9"
                style={{ backgroundColor: "#dc2626", cursor: "pointer" }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      </main>

      <ModalCadastrarDono isOpen={isModalDonoOpen} onClose={() => setIsModalDonoOpen(false)} onSubmit={handleAddDono} />
      <ModalCadastrarPet
        isOpen={isModalPetOpen}
        onClose={() => setIsModalPetOpen(false)}
        donos={donos}
        onSubmit={handleAddPet}
      />
      <ModalCadastrarUsuario isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} />
      <ModalEditarDono
        isOpen={isEditModalDonoOpen}
        onClose={() => setIsEditModalDonoOpen(false)}
        dono={selectedDono}
        onSubmit={handleEditDono}
      />
      <ModalEditarPet
        isOpen={isEditModalPetOpen}
        onClose={() => setIsEditModalPetOpen(false)}
        pet={selectedPet}
        donos={donos}
        onSubmit={handleEditPet}
      />
      <ModalExcluir
        isOpen={isExcluirModalOpen}
        onClose={() => setIsExcluirModalOpen(false)}
        pets={pets}
        donos={donos}
        mode={excluirMode}
        onConfirm={handleExcluir}
      />
    </div>
  )
}