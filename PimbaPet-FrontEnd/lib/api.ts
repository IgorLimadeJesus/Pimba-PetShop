// Allow overriding the backend host via env var (e.g. NEXT_PUBLIC_API_BASE_URL=http://localhost:5202)
const API_HOST = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5202').replace(/\/$/, '')
const API_BASE_URL = `${API_HOST}/api`

export interface Dono {
  id: string
  nome: string
  cpf: string
  telefone: string
}

export interface Pet {
  id: string
  nome: string
  tipo: string
  raca: string
  donoId: string
}

export interface AuthResponse {
  token: string
}

export interface User {
  nome: string
  email: string
  senha: string
}

export interface LoginRequest {
  email: string
  senha: string
}

// Helper function with timeout and better error handling
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    console.log("[API] Fetching:", url)
    const response = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    console.error("[API] Fetch error:", error)
    throw error
  }
}

// Auth API
export async function register(user: User): Promise<any | null> {
  try {
    console.log("[API] Registering user:", user.email)
    const response = await fetchWithTimeout(`${API_HOST}/register`, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
    console.log("[API] Register response status:", response.status)
    const text = await response.text()
    let data: any = null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      data = text
    }

    if (!response.ok) {
      console.error("[API] Register error response:", data || text)
      // return the error text for frontend display
      return { error: data || text }
    }

    console.log("[API] User registered:", data)
    return data
  } catch (error) {
    console.error("[API] Error registering user:", error)
    return { error: (error as Error).message }
  }
}

export async function login(credentials: LoginRequest): Promise<any | null> {
  try {
    console.log("[API] Logging in user:", credentials.email)
    const response = await fetchWithTimeout(`${API_HOST}/login`, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
    console.log("[API] Login response status:", response.status)
    const text = await response.text()
    let data: any = null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      data = text
    }

    if (!response.ok) {
      console.error('[API] Login error response:', data || text)
      return { error: data || text }
    }

    console.log("[API] User logged in:", data)
    return data
  } catch (error) {
    console.error("[API] Error logging in:", error)
    return { error: (error as Error).message }
  }
}

// Donos API
export async function getDonos(): Promise<Dono[]> {
  try {
    console.log("[API] Fetching donos from:", `${API_BASE_URL}/Dono/Donos`)
    const token = localStorage.getItem("token")
    const response = await fetchWithTimeout(`${API_BASE_URL}/Dono/Donos`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    console.log("[API] Donos response status:", response.status)
    if (!response.ok) {
      console.error("[API] HTTP Error:", response.status, response.statusText)
      throw new Error(`HTTP Error: ${response.status}`)
    }
    const data = await response.json()
    console.log("[API] Donos data received:", data)

    // Map response data to match interface
    const donos = data.map((item: any) => {
      const rawId = item.id ?? item.Id ?? ""
      return {
        id: rawId.toString(),
        nome: item.nome || item.Nome || "",
        cpf: item.cpf || item.CPF || "",
        telefone: item.telefone || item.Telefone || "",
      }
    })

    return donos || []
  } catch (error) {
    console.error("[API] Error fetching donos:", error)
    return []
  }
}

export async function createDono(dono: Omit<Dono, 'id'>): Promise<Dono | null> {
  try {
    console.log("[API] Creating dono:", dono)
    const token = localStorage.getItem("token")

    // Convert property names to match backend expectations
    const donoPayload = {
      Nome: dono.nome,
      CPF: dono.cpf,
      Telefone: dono.telefone,
    }

    console.log("[API] Sending dono payload:", donoPayload)

    const response = await fetchWithTimeout(`${API_BASE_URL}/Dono/Donos`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(donoPayload),
    })
    console.log("[API] Create dono response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[API] Error response:", errorText)
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("[API] Dono created:", data)
    return { ...dono, id: Date.now().toString() }
  } catch (error) {
    console.error("[API] Error creating dono:", error)
    return null
  }
}

// Pets API
export async function getPets(): Promise<Pet[]> {
  try {
    console.log("[API] Fetching pets from:", `${API_BASE_URL}/Pet/Pets`)
    const token = localStorage.getItem("token")
    const response = await fetchWithTimeout(`${API_BASE_URL}/Pet/Pets`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    console.log("[API] Pets response status:", response.status)
    if (!response.ok) {
      console.error("[API] HTTP Error:", response.status, response.statusText)
      throw new Error(`HTTP Error: ${response.status}`)
    }
    const data = await response.json()
    console.log("[API] Pets data received:", data)

    // Map response data to match interface
    const pets = data.map((item: any) => {
      const rawId = item.id ?? item.Id ?? ""
      const rawDono = item.dono_id ?? item.Dono_id ?? item.donoId ?? item.DonoId ?? ""
      return {
        id: rawId.toString(),
        nome: item.nome || item.Nome || "",
        tipo: item.tipo || item.Tipo || "",
        raca: item.raca || item.Raca || "",
        donoId: rawDono.toString(),
      }
    })

    return pets || []
  } catch (error) {
    console.error("[API] Error fetching pets:", error)
    return []
  }
}

export async function createPet(pet: Omit<Pet, 'id'>): Promise<Pet | null> {
  try {
    console.log("[API] Creating pet:", pet)
    const token = localStorage.getItem("token")

    // Convert donoId to Dono_id as expected by backend
    const petPayload = {
      nome: pet.nome,
      tipo: pet.tipo,
      raca: pet.raca,
      Dono_id: parseInt(pet.donoId as string),
    }

    console.log("[API] Sending pet payload:", petPayload)

    const response = await fetchWithTimeout(`${API_BASE_URL}/Pet/Pets`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(petPayload),
    })
    console.log("[API] Create pet response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[API] Error response:", errorText)
      throw new Error(`HTTP Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("[API] Pet created:", data)
    return { ...pet, id: Date.now().toString() }
  } catch (error) {
    console.error("[API] Error creating pet:", error)
    return null
  }
}

// Delete APIs
export async function deleteDono(id: string): Promise<boolean> {
  try {
    const token = localStorage.getItem("token")
    const response = await fetchWithTimeout(`${API_BASE_URL}/Dono/Donos/${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    if (!response.ok) {
      const text = await response.text()
      console.error("[API] deleteDono error:", response.status, text)
      return false
    }
    return true
  } catch (error) {
    console.error("[API] Error deleting dono:", error)
    return false
  }
}

export async function deletePet(id: string): Promise<boolean> {
  try {
    const token = localStorage.getItem("token")
    const response = await fetchWithTimeout(`${API_BASE_URL}/Pet/Pets/${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    if (!response.ok) {
      const text = await response.text()
      console.error("[API] deletePet error:", response.status, text)
      return false
    }
    return true
  } catch (error) {
    console.error("[API] Error deleting pet:", error)
    return false
  }
}
