const BASE = "/api/admin";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data as T;
}

export function checkAdmin() {
  return request<{ isAdmin: boolean }>("/check");
}

export function getStats() {
  return request<AdminStats>("/stats");
}

export function getAnnunci(params: { page?: number; q?: string; categoria?: string }) {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.q) qs.set("q", params.q);
  if (params.categoria) qs.set("categoria", params.categoria);
  return request<AnnunciPageResult>(`/annunci?${qs}`);
}

export function deleteAllAnnunci() {
  return request<{ ok: boolean; message: string }>("/annunci-all", { method: "DELETE" });
}

export function deleteAnnuncio(id: number) {
  return request<void>(`/annunci/${id}`, { method: "DELETE" });
}

export function toggleInEvidenza(id: number, inEvidenza: boolean) {
  return request<Annuncio>(`/annunci/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ inEvidenza }),
  });
}

export function getUtenti(params: { page?: number; q?: string }) {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.q) qs.set("q", params.q);
  return request<UtentiPageResult>(`/utenti?${qs}`);
}

export function deleteUtente(clerkId: string) {
  return request<void>(`/utenti/${clerkId}`, { method: "DELETE" });
}

export function getForumThreads(params: { page?: number; q?: string }) {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.q) qs.set("q", params.q);
  return request<ThreadsPageResult>(`/forum/threads?${qs}`);
}

export function deleteThread(id: number) {
  return request<void>(`/forum/threads/${id}`, { method: "DELETE" });
}

export function deleteReply(id: number) {
  return request<void>(`/forum/replies/${id}`, { method: "DELETE" });
}

export interface AdminStats {
  totaleAnnunci: number;
  annunciOggi: number;
  totaleUtenti: number;
  utentiOggi: number;
  totaleThread: number;
  totaleRisposte: number;
  annunciPerCategoria: { categoria: string; count: number }[];
  annunciRecenti: Annuncio[];
}

export interface Annuncio {
  id: number;
  titolo: string;
  descrizione: string;
  prezzo: number | null;
  categoria: string;
  citta: string;
  contatto: string;
  immagineUrl: string | null;
  inEvidenza: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  clerkId: string;
  username: string;
  nome: string;
  cognome: string;
  email: string;
  universita: string;
  annoCorso: string;
  corsoDiLaurea: string;
  telefono: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ForumThread {
  id: number;
  titolo: string;
  corpo: string;
  categoria: string;
  autore: string;
  autoreClerkId: string | null;
  risposteCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AnnunciPageResult {
  annunci: Annuncio[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UtentiPageResult {
  utenti: UserProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ThreadsPageResult {
  threads: ForumThread[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
