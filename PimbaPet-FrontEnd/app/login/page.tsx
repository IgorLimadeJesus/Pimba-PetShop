"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!email || !password) {
      setIsLoading(false)
      return
    }

    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({ email }))
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
        <h2 className="text-xl font-bold text-gray-800 mb-6">Acessar conta</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email/Usuario */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Usuário ou E-mail</label>
            <Input
              type="text"
              placeholder="Digite seu usuário ou e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {isLoading ? "Entrando..." : "Acessar Conta"}
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
