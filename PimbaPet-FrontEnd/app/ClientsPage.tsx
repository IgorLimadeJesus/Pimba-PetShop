"use client"

import { useState, useEffect } from "react"
import PetsTable from "../src/components/PetsTable"
import DonorsTable from "../src/components/DonorsTable"
import { getDonos, getPets, createDono, createPet, type Dono, type Pet } from "../lib/api"
import "./ClientsPage.css"

interface ClientsPageProps {
  onLogout: () => void
}

interface DisplayPet {
  id: number | string
  name: string
  type: string
  breed: string
  owner: string
}

interface DisplayDonor {
  id: number | string
  name: string
  phone: string
}

export default function ClientsPage({ onLogout }: ClientsPageProps) {
  const [pets, setPets] = useState<DisplayPet[]>([])
  const [donors, setDonors] = useState<DisplayDonor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showAddPet, setShowAddPet] = useState(false)
  const [showAddDonor, setShowAddDonor] = useState(false)
  const [newPet, setNewPet] = useState({ name: "", type: "", breed: "", owner: "" })
  const [newDonor, setNewDonor] = useState({ name: "", phone: "" })

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch Donos
        const donosData = await getDonos()
        const donorsDisplay: DisplayDonor[] = donosData.map((dono, index) => ({
          id: dono.id || index,
          name: dono.nome,
          phone: dono.telefone,
        }))
        setDonors(donorsDisplay)

        // Fetch Pets
        const petsData = await getPets()
        const donoMap = new Map(donosData.map((d) => [d.id, d.nome]))

        const petsDisplay: DisplayPet[] = petsData.map((pet, index) => ({
          id: pet.id || index,
          name: pet.nome,
          type: pet.tipo,
          breed: pet.raca,
          owner: donoMap.get(pet.donoId) || "Desconhecido",
        }))
        setPets(petsDisplay)
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
        setError("Erro ao carregar dados da API")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddPet = async () => {
    if (newPet.name && newPet.type && newPet.breed && newPet.owner) {
      try {
        // Find the owner's ID
        const owner = donors.find((d) => d.name === newPet.owner)
        if (!owner) {
          alert("Dono não encontrado")
          return
        }

        const petData: Omit<Pet, 'id'> = {
          nome: newPet.name,
          tipo: newPet.type,
          raca: newPet.breed,
          donoId: owner.id as string,
        }

        const createdPet = await createPet(petData)
        if (createdPet) {
          setPets([
            ...pets,
            {
              id: createdPet.id || pets.length + 1,
              name: createdPet.nome,
              type: createdPet.tipo,
              breed: createdPet.raca,
              owner: newPet.owner,
            },
          ])
          setNewPet({ name: "", type: "", breed: "", owner: "" })
          setShowAddPet(false)
        }
      } catch (err) {
        console.error("Erro ao adicionar pet:", err)
        alert("Erro ao adicionar pet")
      }
    }
  }

  const handleAddDonor = async () => {
    if (newDonor.name && newDonor.phone) {
      try {
        const donoData: Omit<Dono, 'id'> = {
          nome: newDonor.name,
          cpf: "", // Can be empty or requested from user
          telefone: newDonor.phone,
        }

        const createdDono = await createDono(donoData)
        if (createdDono) {
          setDonors([
            ...donors,
            {
              id: createdDono.id || donors.length + 1,
              name: createdDono.nome,
              phone: createdDono.telefone,
            },
          ])
          setNewDonor({ name: "", phone: "" })
          setShowAddDonor(false)
        }
      } catch (err) {
        console.error("Erro ao adicionar dono:", err)
        alert("Erro ao adicionar dono")
      }
    }
  }

  const handleDeletePet = (id: number | string) => {
    setPets(pets.filter((pet) => pet.id !== id))
  }

  const handleDeleteDonor = (id: number | string) => {
    setDonors(donors.filter((donor) => donor.id !== id))
  }

  return (
    <div className="clients-page">
      <div className="page-container">
        <h1 className="page-title">CLIENTES</h1>

        {loading && <p className="loading">Carregando dados...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <div className="tables-grid">
            <div className="table-section">
              <div className="table-header">
                <h2 className="table-title">Pets</h2>
              </div>
              <PetsTable pets={pets} onDelete={handleDeletePet} />
              <button onClick={() => setShowAddPet(true)} className="table-button primary">
                Cadastrar
              </button>
              {showAddPet && (
                <div className="add-form">
                  <input
                    type="text"
                    placeholder="Nome"
                    value={newPet.name}
                    onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Tipo"
                    value={newPet.type}
                    onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Raça"
                    value={newPet.breed}
                    onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Dono"
                    value={newPet.owner}
                    onChange={(e) => setNewPet({ ...newPet, owner: e.target.value })}
                  />
                  <button onClick={handleAddPet} className="form-submit">
                    Adicionar
                  </button>
                </div>
              )}
            </div>

            <div className="table-section">
              <div className="table-header">
                <h2 className="table-title">Donos</h2>
              </div>
              <DonorsTable donors={donors} onDelete={handleDeleteDonor} />
              <button onClick={() => setShowAddDonor(true)} className="table-button primary">
                Cadastrar
              </button>
              {showAddDonor && (
                <div className="add-form">
                  <input
                    type="text"
                    placeholder="Nome"
                    value={newDonor.name}
                    onChange={(e) => setNewDonor({ ...newDonor, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Telefone"
                    value={newDonor.phone}
                    onChange={(e) => setNewDonor({ ...newDonor, phone: e.target.value })}
                  />
                  <button onClick={handleAddDonor} className="form-submit">
                    Adicionar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
