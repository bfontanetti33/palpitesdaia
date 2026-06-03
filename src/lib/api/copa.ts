import { apiUrl, authHeaders } from "@/config/api";
import type { Match, MarketPick, Confidence } from "@/lib/mock-data";

// ============ Tipos da API ============
export interface ApiJogo {
  id: number;
  slug: string;
  rodada: string;
  horario: string; // ISO
  status: string;
  estadio: string;
  cidade: string;
  time_casa_nome: string;
  time_casa_logo: string;
  time_fora_nome: string;
  time_fora_logo: string;
  gols_casa: number | null;
  gols_fora: number | null;
}

interface ApiJogosResponse {
  total: number;
  temporada: number;
  partidas: ApiJogo[];
}

interface ApiStatsTime {
  jogos?: number;
  vitorias?: number;
  empates?: number;
  derrotas?: number;
  gols_marcados?: number;
  gols_sofridos?: number;
  media_gols_marcados?: number;
  media_gols_sofridos?: number;
  media_amarelos?: number;
  btts_pct?: number;
  over25_pct?: number;
  clean_sheets?: number;
}

interface ApiFormaJogo {
  data: string;
  adversario: string;
  placar_proprio: number;
  placar_adversario: number;
  resultado: "W" | "D" | "L";
  competicao: string;
}

export interface ApiJogoDetalhe extends ApiJogo {
  time_casa_id?: number;
  time_fora_id?: number;
  stats_casa?: ApiStatsTime;
  stats_fora?: ApiStatsTime;
  forma_casa?: ApiFormaJogo[];
  forma_fora?: ApiFormaJogo[];
}

// A API de recomendação pode ainda estar instável (retornou 500 nos testes).
// Aceitamos uma estrutura flexível.
export interface ApiRecomendacaoMercado {
  mercado?: string;
  market?: string;
  selecao?: string;
  pick?: string;
  confianca?: string;
  confidence?: string;
  probabilidade?: number;
  chance?: number;
  odd?: number;
  justificativa?: string;
  reason?: string;
}

export interface ApiRecomendacao {
  resumo?: string;
  summary?: string;
  mercados?: ApiRecomendacaoMercado[];
  markets?: ApiRecomendacaoMercado[];
}

// ============ Fetchers ============
async function getJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), init);
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText} (${path})`);
  }
  return (await res.json()) as T;
}

export async function fetchJogos(): Promise<ApiJogo[]> {
  const data = await getJson<ApiJogosResponse>("/api/v1/copa/jogos");
  return data.partidas ?? [];
}

export async function fetchJogo(slug: string): Promise<ApiJogoDetalhe> {
  return getJson<ApiJogoDetalhe>(`/api/v1/copa/jogos/${encodeURIComponent(slug)}`);
}

export async function fetchRecomendacao(slug: string): Promise<ApiRecomendacao> {
  return getJson<ApiRecomendacao>(
    `/api/v1/copa/jogos/${encodeURIComponent(slug)}/recomendacao`,
    { headers: authHeaders() },
  );
}

// ============ Adapters: API -> tipo Match (mantém layout) ============
function formaToDots(forma?: ApiFormaJogo[]): ("V" | "E" | "D")[] {
  const last5 = (forma ?? []).slice(-5);
  return last5.map((f) =>
    f.resultado === "W" ? "V" : f.resultado === "D" ? "E" : "D",
  );
}

function shortName(name: string) {
  const parts = name.split(/\s+/);
  if (parts.length === 1) return name.slice(0, 3).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function rodadaToLeagueShort(rodada: string) {
  // "Rodada 1 — Grupo A" -> "Grupo A"
  const m = rodada.match(/Grupo\s+\w+/i);
  if (m) return m[0];
  return rodada;
}

export function apiJogoToMatch(j: ApiJogo): Match {
  return {
    id: j.slug,
    league: "Copa do Mundo 2026",
    leagueShort: rodadaToLeagueShort(j.rodada),
    leagueEmoji: "🏆",
    date: j.horario,
    status:
      j.status === "FT" ? "finished" : j.status === "NS" ? "scheduled" : "live",
    home: {
      name: j.time_casa_nome,
      short: shortName(j.time_casa_nome),
      logo: j.time_casa_logo,
    },
    away: {
      name: j.time_fora_nome,
      short: shortName(j.time_fora_nome),
      logo: j.time_fora_logo,
    },
    venue: [j.estadio, j.cidade].filter(Boolean).join(" — ") || "A definir",
    referee: "Árbitro a confirmar",
    topMarkets: [],
    allMarkets: [],
    stats: {
      homeForm: [],
      awayForm: [],
      avgGoals: 0,
      avgCorners: 0,
      avgCards: 0,
      h2h: "",
    },
    keyPlayers: { home: [], away: [] },
    refereeStats: { cardsPerGame: 0, pensPerGame: 0, tendency: "—" },
    summary: "",
  };
}

function normalizeConfidence(v?: string, chance?: number): Confidence {
  const u = (v ?? "").toUpperCase();
  if (u.startsWith("ALT") || u.startsWith("HIGH")) return "ALTA";
  if (u.startsWith("MED") || u.startsWith("MID")) return "MÉDIA";
  if (u.startsWith("BAI") || u.startsWith("LOW")) return "BAIXA";
  if (typeof chance === "number") {
    if (chance >= 70) return "ALTA";
    if (chance >= 50) return "MÉDIA";
    return "BAIXA";
  }
  return "MÉDIA";
}

function mercadoToMarketPick(m: ApiRecomendacaoMercado): MarketPick {
  const chanceRaw = m.probabilidade ?? m.chance;
  const chance =
    typeof chanceRaw === "number"
      ? chanceRaw <= 1
        ? Math.round(chanceRaw * 100)
        : Math.round(chanceRaw)
      : undefined;
  return {
    market: m.mercado ?? m.market ?? "Mercado",
    pick: m.selecao ?? m.pick ?? "—",
    confidence: normalizeConfidence(m.confianca ?? m.confidence, chance),
    chance,
    reason: m.justificativa ?? m.reason ?? "",
    odd: m.odd,
  };
}

export function apiDetalheToMatch(
  d: ApiJogoDetalhe,
  rec?: ApiRecomendacao,
): Match {
  const base = apiJogoToMatch(d);

  const homeForm = formaToDots(d.forma_casa);
  const awayForm = formaToDots(d.forma_fora);

  const sc = d.stats_casa ?? {};
  const sf = d.stats_fora ?? {};
  const avgGoals =
    ((sc.media_gols_marcados ?? 0) +
      (sf.media_gols_marcados ?? 0) +
      (sc.media_gols_sofridos ?? 0) +
      (sf.media_gols_sofridos ?? 0)) /
      2 || 0;
  const avgCards =
    ((sc.media_amarelos ?? 0) + (sf.media_amarelos ?? 0)) || 0;

  const mercados = rec?.mercados ?? rec?.markets ?? [];
  const allMarkets = mercados.map(mercadoToMarketPick);
  const topMarkets = allMarkets.slice(0, 3);

  return {
    ...base,
    stats: {
      homeForm,
      awayForm,
      avgGoals: +avgGoals.toFixed(2),
      avgCorners: 0,
      avgCards: +avgCards.toFixed(2),
      h2h: "",
    },
    topMarkets,
    allMarkets,
    summary:
      rec?.resumo ??
      rec?.summary ??
      `${d.time_casa_nome} x ${d.time_fora_nome} — ${d.rodada}.`,
  };
}
