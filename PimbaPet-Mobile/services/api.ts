import { Platform } from 'react-native';

const DEFAULT_HOST = Platform.select({
  android: 'http://192.168.1.229:5202',
  ios: 'http://localhost:5202',
  default: 'http://localhost:5202',
});

const API_HOST = (process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_HOST).replace(/\/$/, '');
console.log('[API] Base URL:', API_HOST);
const API_BASE_URL = `${API_HOST}/api`;

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

type FetchOptions = RequestInit & { parseJson?: boolean };

async function request(path: string, options: FetchOptions = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });
  const bodyText = await response.text();
  const data = bodyText ? safeJSON(bodyText) : null;

  if (!response.ok) {
    const message = typeof data === 'string' ? data : data?.message || bodyText || 'Erro desconhecido';
    throw new Error(message);
  }

  return data;
}

function safeJSON(payload: string) {
  try {
    return JSON.parse(payload);
  } catch {
    return payload;
  }
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
}

export interface Dono {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
}

export interface Pet {
  id: string;
  nome: string;
  tipo: string;
  raca: string;
  donoId: string;
}

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const data = await request(`${API_HOST}/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  if (!data?.token) {
    throw new Error('Credenciais inválidas');
  }
  return data;
}

export async function getDonos(): Promise<Dono[]> {
  const data = await request('/Dono/Donos', { method: 'GET' });
  return (Array.isArray(data) ? data : []).map((item: any) => ({
    id: (item.id ?? item.Id ?? '').toString(),
    nome: item.nome || item.Nome || '',
    cpf: item.cpf || item.CPF || '',
    telefone: item.telefone || item.Telefone || '',
  }));
}

export async function createDono(dono: Omit<Dono, 'id'>): Promise<Dono> {
  await request('/Dono/Donos', {
    method: 'POST',
    body: JSON.stringify({
      Nome: dono.nome,
      CPF: dono.cpf,
      Telefone: dono.telefone,
    }),
  });
  return { ...dono, id: Date.now().toString() };
}

export async function getPets(): Promise<Pet[]> {
  const data = await request('/Pet/Pets', { method: 'GET' });
  return (Array.isArray(data) ? data : []).map((item: any) => ({
    id: (item.id ?? item.Id ?? '').toString(),
    nome: item.nome || item.Nome || '',
    tipo: item.tipo || item.Tipo || '',
    raca: item.raca || item.Raca || '',
    donoId: (item.dono_id ?? item.Dono_id ?? item.donoId ?? item.DonoId ?? '').toString(),
  }));
}

export async function createPet(pet: { nome: string; tipo: string; raca: string; donoId: number }) {
  return request('/Pet/Pets', {
    method: 'POST',
    body: JSON.stringify({
      nome: pet.nome,
      tipo: pet.tipo,
      raca: pet.raca,
      dono_id: Number(pet.donoId),
    }),
  });
}

export async function deletePet(id: string) {
  await request(`/Pet/Pets/${id}`, { method: 'DELETE' });
}

export async function deleteDono(id: string) {
  await request(`/Dono/Donos/${id}`, { method: 'DELETE' });
}

