"use client"

import type React from "react"

import { useState } from "react"
import "./AuthPages.css"

interface LoginPageProps {
  onLogin: () => void
  onNavigateToSignup: () => void
}

export default function LoginPage({ onLogin, onNavigateToSignup }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      onLogin()
    }
  }

  return (
    <div className="auth-container">
      <div className="logo-header">
        <span className="logo-large">🐾 PimbaPets</span>
      </div>
      <div className="auth-form-wrapper">
        <h2 className="auth-title">Acessar conta</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Usuário ou E-mail
            </label>
            <input
              id="email"
              type="text"
              placeholder="Digite seu usuário ou e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <button type="submit" className="form-button">
            Acessar Conta
          </button>
        </form>

        <p className="auth-switch">
          Não tem conta?{" "}
          <button onClick={onNavigateToSignup} className="link-button">
            Criar uma
          </button>
        </p>
      </div>
    </div>
  )
}
