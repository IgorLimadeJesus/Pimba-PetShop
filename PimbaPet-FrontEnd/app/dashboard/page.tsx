"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ModalCadastrarDono } from "@/components/modal-cadastrar-dono"
import { ModalCadastrarPet } from "@/components/modal-cadastrar-pet"
import { ModalEditarDono } from "@/components/modal-editar-dono"
import { ModalEditarPet } from "@/components/modal-editar-pet"
import { getDonos, createDono, getPets, createPet, type Dono, type Pet } from "@/lib/api"

export default function DashboardPage() {
  const router = useRouter()
  const [pets, setPets] = useState<Pet[]>([])
  const [donos, setDonos] = useState<Dono[]>([])
  const [user, setUser] = useState<any>(null)
  const [isModalDonoOpen, setIsModalDonoOpen] = useState(false)
  const [isModalPetOpen, setIsModalPetOpen] = useState(false)
  const [isEditModalDonoOpen, setIsEditModalDonoOpen] = useState(false)
  const [isEditModalPetOpen, setIsEditModalPetOpen] = useState(false)
  const [selectedDono, setSelectedDono] = useState<Dono | null>(null)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (!savedUser) {
      router.push("/login")
    } else {
      setUser(JSON.parse(savedUser))
      loadData()
    }
  }, [router])

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            <div className="text-2xl font-bold" style={{ color: "#8AC57B" }}>
              ♣ PimbaPets
            </div>
            <nav className="flex items-center gap-6">
              <a
                href="/dashboard"
                className="text-gray-700 font-medium"
                style={{ color: "#8AC57B", cursor: "pointer" }}
              >
                Início
              </a>
              <a
                href="/dashboard"
                className="text-gray-700 font-medium"
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
                type="text"
                placeholder="Pesquisar..."
                className="w-48 h-9 border border-gray-300 rounded pl-3 pr-9 placeholder-gray-400 focus:outline-none"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-sm">👤</span>
              <button
                onClick={handleLogout}
                className="text-gray-700 font-medium"
                style={{ color: "#8AC57B", cursor: "pointer" }}
              >
                Entrar / Cadastrar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">CLIENTES</h2>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pets Section */}
          <div style={{ border: "2px solid #8AC57B", borderRadius: "4px" }} className="bg-white overflow-hidden">
            <div style={{ backgroundColor: "#8AC57B" }} className="text-white px-4 py-2 font-bold">
              Pets
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid #8AC57B" }}>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Nome</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Tipo | Raça</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Dono</th>
                  </tr>
                </thead>
                <tbody>
                  {pets.length > 0 ? (
                    pets.map((pet) => {
                      const donoName = donos.find((d) => d.id === pet.donoId)?.nome || "N/A"
                      return (
                        <tr key={pet.id} style={{ borderBottom: "1px solid #d0e8d8" }}>
                          <td className="px-4 py-3 text-sm text-gray-800">{pet.nome}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {pet.tipo} | {pet.raca}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">{donoName}</td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                        Nenhum pet cadastrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2 px-4 py-3 bg-gray-50" style={{ borderTop: "1px solid #8AC57B" }}>
              <button
                onClick={() => setIsModalPetOpen(true)}
                className="flex-1 text-white font-semibold py-2 rounded h-9"
                style={{ backgroundColor: "#8AC57B", cursor: "pointer" }}
              >
                Cadastrar
              </button>
              <button
                onClick={openEditPet}
                className="flex-1 text-white font-semibold py-2 rounded h-9"
                style={{ backgroundColor: "#6fa85d", cursor: "pointer" }}
              >
                Editar
              </button>
            </div>
          </div>

          {/* Donos Section */}
          <div style={{ border: "2px solid #8AC57B", borderRadius: "4px" }} className="bg-white overflow-hidden">
            <div style={{ backgroundColor: "#8AC57B" }} className="text-white px-4 py-2 font-bold">
              Donos
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid #8AC57B" }}>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Nome</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Telefone</th>
                  </tr>
                </thead>
                <tbody>
                  {donos.length > 0 ? (
                    donos.map((dono) => (
                      <tr key={dono.id} style={{ borderBottom: "1px solid #d0e8d8" }}>
                        <td className="px-4 py-3 text-sm text-gray-800">{dono.nome}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{dono.telefone}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-4 py-6 text-center text-gray-500">
                        Nenhum dono cadastrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex gap-2 px-4 py-3 bg-gray-50" style={{ borderTop: "1px solid #8AC57B" }}>
              <button
                onClick={() => setIsModalDonoOpen(true)}
                className="flex-1 text-white font-semibold py-2 rounded h-9"
                style={{ backgroundColor: "#8AC57B", cursor: "pointer" }}
              >
                Cadastrar
              </button>
              <button
                onClick={openEditDono}
                className="flex-1 text-white font-semibold py-2 rounded h-9"
                style={{ backgroundColor: "#6fa85d", cursor: "pointer" }}
              >
                Editar
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
    </div>
  )
}
