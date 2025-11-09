"use client"

import type React from "react"

import { useState } from "react"
import "./AuthPages.css"

interface SignupPageProps {
  onSignup: () => void
  onNavigateToLogin: () => void
}

export default function SignupPage({ onSignup, onNavigateToLogin }: SignupPageProps) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username && email && password && password === confirmPassword) {
      onSignup()
    }
  }

  return (
    <div className="auth-container">
      <div className="logo-header">
        <span className="logo-large">🐾 PimbaPets</span>
      </div>
      <div className="auth-form-wrapper">
        <h2 className="auth-title">Criar conta</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Usuário
            </label>
            <input
              id="username"
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
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

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <button type="submit" className="form-button">
            Criar Conta
          </button>
        </form>

        <p className="auth-switch">
          Já tem conta?{" "}
          <button onClick={onNavigateToLogin} className="link-button">
            Faça login
          </button>
        </p>
      </div>
    </div>
  )
}
