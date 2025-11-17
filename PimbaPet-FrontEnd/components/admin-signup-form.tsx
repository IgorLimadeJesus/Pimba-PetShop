"use client"

import { useState } from "react"

type Props = {
    token?: string
}

export default function AdminSignupForm({ token }: Props) {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "worker" })
    const [msg, setMsg] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setMsg(null)
        setLoading(true)
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(form),
            })
            const body = await res.json()
            if (!res.ok) {
                setMsg(body?.message || "Erro ao criar usuário")
                setLoading(false)
                return
            }
            setMsg("Usuário criado com sucesso")
            setForm({ name: "", email: "", password: "", role: "worker" })
        } catch (err) {
            setMsg("Erro de rede")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {msg && <div className="p-2 bg-gray-100 rounded">{msg}</div>}
            <div>
                <label className="block text-sm mb-1">Nome</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded" />
            </div>

            <div>
                <label className="block text-sm mb-1">Email</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-2 border rounded" />
            </div>

            <div>
                <label className="block text-sm mb-1">Senha</label>
                <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full p-2 border rounded" />
            </div>

            <div>
                <label className="block text-sm mb-1">Papel</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full p-2 border rounded">
                    <option value="worker">Worker</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <div className="flex gap-2">
                <button disabled={loading} type="submit" className="py-2 px-4 bg-green-500 text-white rounded">{loading ? "Criando..." : "Criar usuário"}</button>
                <button type="button" onClick={() => setForm({ name: "", email: "", password: "", role: "worker" })} className="py-2 px-4 border rounded">Limpar</button>
            </div>
        </form>
    )
}
