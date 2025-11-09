"use client"

import "./Table.css"

interface Pet {
  id: number
  name: string
  type: string
  breed: string
  owner: string
}

interface PetsTableProps {
  pets: Pet[]
  onDelete: (id: number) => void
}

export default function PetsTable({ pets, onDelete }: PetsTableProps) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo | Raça</th>
            <th>Dono</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet) => (
            <tr key={pet.id}>
              <td>{pet.name}</td>
              <td>
                {pet.type} | {pet.breed}
              </td>
              <td>{pet.owner}</td>
              <td>
                <button onClick={() => onDelete(pet.id)} className="delete-btn">
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
