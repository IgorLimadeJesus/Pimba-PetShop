"use client"

import "./Header.css"

interface HeaderProps {
  onLogout: () => void
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo">
            <span className="logo-text">🐾 PimbaPets</span>
          </div>
          <nav className="nav">
            <a href="#inicio" className="nav-link">
              Início
            </a>
            <a href="#clientes" className="nav-link active">
              Clientes
            </a>
          </nav>
        </div>
        <div className="header-right">
          <div className="search-box">
            <input type="text" placeholder="Pesquisar..." className="search-input" />
            <span className="search-icon">🔍</span>
          </div>
          <button onClick={onLogout} className="logout-btn">
            Entrar / Cadastrar
          </button>
        </div>
      </div>
    </header>
  )
}
