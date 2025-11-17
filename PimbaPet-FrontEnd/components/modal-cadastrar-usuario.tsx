"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { register, login } from "@/lib/api"

interface ModalCadastrarUsuarioProps {
  isOpen: boolean
  onClose: () => void
}

export function ModalCadastrarUsuario({ isOpen, onClose }: ModalCadastrarUsuarioProps) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!formData.nome || !formData.email || !formData.senha) {
      setError("Preencha todos os campos")
      return
    }

    setLoading(true)
    try {
      const resp = await register({ nome: formData.nome, email: formData.email, senha: formData.senha })
      if (resp && resp.error) {
        setError(typeof resp.error === "string" ? resp.error : JSON.stringify(resp.error))
        return
      }

      if (resp) {
        // register returned created user object; now log in to get token
        const loginResp = await login({ email: formData.email, senha: formData.senha })
        if (loginResp?.token) {
          localStorage.setItem("token", loginResp.token)
          localStorage.setItem("user", JSON.stringify({ nome: formData.nome, email: formData.email }))
          setFormData({ nome: "", email: "", senha: "" })
          onClose()
        } else if (loginResp && (loginResp as any).error) {
          setError((loginResp as any).error.toString())
        } else {
          setError("Usuário cadastrado, mas falha no login automático")
        }
      } else {
        setError("Erro ao cadastrar usuário")
      }
    } catch (err) {
      console.error("Register error:", err)
      setError("Erro ao conectar com o servidor")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md border-l-4"
        style={{ borderLeftColor: "#8AC57B" }}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">Cadastrar Usuário</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-2 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Nome</label>
            <Input
              type="text"
              placeholder="Digite o nome completo"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full h-10 border rounded px-3 placeholder-gray-400 focus:outline-none"
              style={{ borderColor: "#8AC57B" }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">E-mail</label>
            <Input
              type="email"
              placeholder="Digite o e-mail do usuário"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-10 border rounded px-3 placeholder-gray-400 focus:outline-none"
              style={{ borderColor: "#8AC57B" }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Senha</label>
            <Input
              type="password"
              placeholder="Digite uma senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className="w-full h-10 border rounded px-3 placeholder-gray-400 focus:outline-none"
              style={{ borderColor: "#8AC57B" }}
            />
          </div>

          <Button
            type="submit"
            className="w-full text-white font-semibold py-2 rounded h-10 mt-6"
            style={{ backgroundColor: "#8AC57B" }}
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>

        <button onClick={onClose} className="w-full text-gray-600 text-sm mt-4 hover:text-gray-800">
          Cancelar
        </button>
      </div>
    </div>
  )
}
