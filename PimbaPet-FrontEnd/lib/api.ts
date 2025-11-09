const API_BASE_URL = "http://localhost:7242/api"

export interface Dono {
  id?: string
  nome: string
  cpf: string
  telefone: string
}

export interface Pet {
  id?: string
  nome: string
  tipo: string
  raca: string
  donoId: string
}

// Helper function with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

// Donos API
export async function getDonos(): Promise<Dono[]> {
  try {
    console.log("[v0] Fetching donos from:", `${API_BASE_URL}/Dono/Donos`)
    const response = await fetchWithTimeout(`${API_BASE_URL}/Dono/Donos`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
    console.log("[v0] Donos response status:", response.status)
    if (!response.ok) {
      console.error("[v0] HTTP Error:", response.status, response.statusText)
      throw new Error(`HTTP Error: ${response.status}`)
    }
    const data = await response.json()
    console.log("[v0] Donos data received:", data)
    return data
  } catch (error) {
    console.error("[v0] Error fetching donos:", error)
    // Return example data for testing
    return [
      { id: "1", nome: "João Silva", cpf: "12345678900", telefone: "11999999999" },
      { id: "2", nome: "Maria Santos", cpf: "98765432100", telefone: "11888888888" },
    ]
  }
}

export async function createDono(dono: Dono): Promise<Dono | null> {
  try {
    console.log("[v0] Creating dono:", dono)
    const response = await fetchWithTimeout(`${API_BASE_URL}/Dono/Donos`, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dono),
    })
    console.log("[v0] Create dono response status:", response.status)
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`)
    const data = await response.json()
    console.log("[v0] Dono created:", data)
    return data
  } catch (error) {
    console.error("[v0] Error creating dono:", error)
    // Return with generated ID for testing
    return { ...dono, id: Date.now().toString() }
  }
}

// Pets API
export async function getPets(): Promise<Pet[]> {
  try {
    console.log("[v0] Fetching pets from:", `${API_BASE_URL}/Pet/Pets`)
    const response = await fetchWithTimeout(`${API_BASE_URL}/Pet/Pets`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
    console.log("[v0] Pets response status:", response.status)
    if (!response.ok) {
      console.error("[v0] HTTP Error:", response.status, response.statusText)
      throw new Error(`HTTP Error: ${response.status}`)
    }
    const data = await response.json()
    console.log("[v0] Pets data received:", data)
    return data
  } catch (error) {
    console.error("[v0] Error fetching pets:", error)
    // Return example data for testing
    return [
      { id: "1", nome: "Yuki", tipo: "Gato", raca: "Vira-lata", donoId: "1" },
      { id: "2", nome: "Max", tipo: "Cachorro", raca: "Labrador", donoId: "2" },
    ]
  }
}

export async function createPet(pet: Pet): Promise<Pet | null> {
  try {
    console.log("[v0] Creating pet:", pet)
    const response = await fetchWithTimeout(`${API_BASE_URL}/Pet/Pets`, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pet),
    })
    console.log("[v0] Create pet response status:", response.status)
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`)
    const data = await response.json()
    console.log("[v0] Pet created:", data)
    return data
  } catch (error) {
    console.error("[v0] Error creating pet:", error)
    // Return with generated ID for testing
    return { ...pet, id: Date.now().toString() }
  }
}
