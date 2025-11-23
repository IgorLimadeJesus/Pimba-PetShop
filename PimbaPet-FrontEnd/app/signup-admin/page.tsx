"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AdminSignupForm from "@/components/admin-signup-form"

export default function SignupAdminPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const saved = localStorage.getItem("user")
        if (!saved) {
            router.push("/login")
            return
        }
        try {
            const parsed = JSON.parse(saved)
            setUser(parsed)
            if (parsed?.role !== "admin") {
                router.push("/dashboard")
                return
            }
            setLoading(false)
        } catch (e) {
            router.push("/login")
        }
    }, [router])

    if (loading) return <div className="min-h-screen flex items-center justify-center">Verificando permissões...</div>

    return (
        <div className="max-w-3xl mx-auto mt-12 bg-white p-6 rounded shadow">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Cadastrar novo usuário</h1>
                <Link href="/dashboard" className="text-sm text-gray-600">Voltar</Link>
            </div>

            <AdminSignupForm token={user?.token} />
        </div>
    )
}