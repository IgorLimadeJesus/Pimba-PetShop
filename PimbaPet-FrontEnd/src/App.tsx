"use client"

import { useState, type ReactNode } from "react"
import "./App.css"
import Header from "./components/Header"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import ClientsPage from "./pages/ClientsPage"

type PageType = "login" | "signup" | "clients"

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("login")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = () => {
    setIsAuthenticated(true)
    setCurrentPage("clients")
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentPage("login")
  }

  const renderPage = (): ReactNode => {
    if (!isAuthenticated) {
      if (currentPage === "login") {
        return <LoginPage onLogin={handleLogin} onNavigateToSignup={() => setCurrentPage("signup")} />
      }
      return <SignupPage onSignup={handleLogin} onNavigateToLogin={() => setCurrentPage("login")} />
    }

    return <ClientsPage onLogout={handleLogout} />
  }

  return (
    <div className="app">
      {isAuthenticated && <Header onLogout={handleLogout} />}
      <main>{renderPage()}</main>
    </div>
  )
}

export default App
