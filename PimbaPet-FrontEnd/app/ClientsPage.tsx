"use client"

import { useState } from "react"
import PetsTable from "../components/PetsTable"
import DonorsTable from "../components/DonorsTable"
import "./ClientsPage.css"

interface ClientsPageProps {
  onLogout: () => void
}

export default function ClientsPage({ onLogout }: ClientsPageProps) {
  const [pets, setPets] = useState([{ id: 1, name: "Yuki", type: "Gato", breed: "Vira-lata", owner: "Carlão" }])

  const [donors, setDonors] = useState([{ id: 1, name: "Carlão", phone: "40028922" }])

  const [showAddPet, setShowAddPet] = useState(false)
  const [showAddDonor, setShowAddDonor] = useState(false)
  const [newPet, setNewPet] = useState({ name: "", type: "", breed: "", owner: "" })
  const [newDonor, setNewDonor] = useState({ name: "", phone: "" })

  const handleAddPet = () => {
    if (newPet.name && newPet.type && newPet.breed && newPet.owner) {
      setPets([...pets, { id: pets.length + 1, ...newPet }])
      setNewPet({ name: "", type: "", breed: "", owner: "" })
      setShowAddPet(false)
    }
  }

  const handleAddDonor = () => {
    if (newDonor.name && newDonor.phone) {
      setDonors([...donors, { id: donors.length + 1, ...newDonor }])
      setNewDonor({ name: "", phone: "" })
      setShowAddDonor(false)
    }
  }

  const handleDeletePet = (id: number) => {
    setPets(pets.filter((pet) => pet.id !== id))
  }

  const handleDeleteDonor = (id: number) => {
    setDonors(donors.filter((donor) => donor.id !== id))
  }

  return (
    <div className="clients-page">
      <div className="page-container">
        <h1 className="page-title">CLIENTES</h1>

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
      </div>
    </div>
  )
}
