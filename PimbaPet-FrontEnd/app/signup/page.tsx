"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false)
      return
    }

    setTimeout(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: formData.username,
          email: formData.email,
        }),
      )
      router.push("/dashboard")
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: "#f5f5f5" }}>
      {/* Logo */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold" style={{ color: "#8AC57B" }}>
          ♣ PimbaPets
        </h1>
      </div>

      {/* Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm border border-gray-300">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Criar conta</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Usuário */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Usuário</label>
            <Input
              type="text"
              placeholder="Digite seu usuário"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full h-10 border rounded px-3 placeholder-gray-400 focus:outline-none"
              style={{ borderColor: "#8AC57B" }}
            />
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">E-mail</label>
            <Input
              type="email"
              placeholder="Digite seu e-mail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-10 border rounded px-3 placeholder-gray-400 focus:outline-none"
              style={{ borderColor: "#8AC57B" }}
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Senha</label>
            <Input
              type="password"
              placeholder="Digite sua senha"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-10 border rounded px-3 placeholder-gray-400 focus:outline-none"
              style={{ borderColor: "#8AC57B" }}
            />
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Confirmar senha</label>
            <Input
              type="password"
              placeholder="Confirme sua senha"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full h-10 border rounded px-3 placeholder-gray-400 focus:outline-none"
              style={{ borderColor: "#8AC57B" }}
            />
          </div>

          {/* Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full text-white font-semibold py-2 rounded h-10 mt-6"
            style={{ backgroundColor: "#8AC57B" }}
          >
            {isLoading ? "Criando..." : "Criar Conta"}
          </Button>
        </form>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={() => router.push("/login")}
            className="flex-1 text-white font-semibold py-2 rounded h-10"
            style={{ backgroundColor: "#8AC57B" }}
          >
            Entrar
          </Button>
          <Button
            onClick={() => router.push("/signup")}
            className="flex-1 text-white font-semibold py-2 rounded h-10"
            style={{ backgroundColor: "#8AC57B" }}
          >
            Cadastrar
          </Button>
        </div>
      </div>
    </div>
  )
}
