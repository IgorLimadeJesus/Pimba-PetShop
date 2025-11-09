"use client"

import { useState } from "react"
import Link from "next/link"
import { useUsers } from "@/lib/user-context"
import { ModalCadastrarUsuario } from "@/components/modal-cadastrar-usuario"
import { ModalEditarUsuario } from "@/components/modal-editar-usuario"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/user-context"

export default function UsuariosPage() {
  const { users, deleteUser } = useUsers()
  const [isOpenCadastrar, setIsOpenCadastrar] = useState(false)
  const [isOpenEditar, setIsOpenEditar] = useState(false)
  const [usuarioParaEditar, setUsuarioParaEditar] = useState<User | null>(null)

  const handleEditar = (usuario: User) => {
    setUsuarioParaEditar(usuario)
    setIsOpenEditar(true)
  }

  return (
    <div style={{ backgroundColor: "#f5f5f5" }} className="min-h-screen p-4">
      {/* Header */}
      <div className="bg-white shadow-md p-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold" style={{ color: "#8AC57B" }}>
            ♣ PimbaPets
          </Link>
          <nav className="flex gap-6 items-center">
            <Link href="/dashboard" className="font-semibold text-gray-700 hover:text-gray-900">
              Início
            </Link>
            <Link href="/dashboard" className="font-semibold text-gray-700 hover:text-gray-900">
              Clientes
            </Link>
            <Link href="/usuarios" className="font-semibold" style={{ color: "#8AC57B" }}>
              Usuários
            </Link>
          </nav>
          <div className="flex gap-4 items-center">
            <Button
              onClick={() => setIsOpenCadastrar(true)}
              className="text-white font-semibold px-4 py-2 rounded"
              style={{ backgroundColor: "#8AC57B" }}
            >
              Novo Usuário
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">USUÁRIOS</h1>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow-lg p-6" style={{ border: "2px solid #8AC57B" }}>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: "#8AC57B" }}>
                <th className="px-4 py-3 text-left text-white font-semibold border-b">Usuário</th>
                <th className="px-4 py-3 text-left text-white font-semibold border-b">E-mail</th>
                <th className="px-4 py-3 text-left text-white font-semibold border-b">Data de Criação</th>
                <th className="px-4 py-3 text-center text-white font-semibold border-b">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    Nenhum usuário cadastrado
                  </td>
                </tr>
              ) : (
                users.map((usuario) => (
                  <tr key={usuario.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{usuario.username}</td>
                    <td className="px-4 py-3 text-gray-800">{usuario.email}</td>
                    <td className="px-4 py-3 text-gray-800">
                      {new Date(usuario.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        onClick={() => handleEditar(usuario)}
                        className="text-white font-semibold px-3 py-1 rounded mr-2"
                        style={{ backgroundColor: "#8AC57B" }}
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => deleteUser(usuario.id)}
                        className="text-white font-semibold px-3 py-1 rounded"
                        style={{ backgroundColor: "#e74c3c" }}
                      >
                        Deletar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ModalCadastrarUsuario isOpen={isOpenCadastrar} onClose={() => setIsOpenCadastrar(false)} />
      <ModalEditarUsuario isOpen={isOpenEditar} usuario={usuarioParaEditar} onClose={() => setIsOpenEditar(false)} />
    </div>
  )
}
