"use client"

import "./Table.css"

interface Donor {
  id: number | string
  name: string
  phone: string
}

interface DonorsTableProps {
  donors: Donor[]
  onDelete: (id: number | string) => void
}

export default function DonorsTable({ donors, onDelete }: DonorsTableProps) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {donors.map((donor) => (
            <tr key={donor.id}>
              <td>{donor.name}</td>
              <td>{donor.phone}</td>
              <td>
                <button onClick={() => onDelete(donor.id)} className="delete-btn">
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
