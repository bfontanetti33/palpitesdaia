export type Confidence = "ALTA" | "MÉDIA" | "BAIXA";

export interface MarketPick {
  market: string;
  pick: string;
  confidence: Confidence;
  reason: string;
  odd?: number;
  chance?: number;
}

export interface Match {
  id: string;
  league: string;
  leagueShort: string;
  leagueEmoji: string;
  date: string; // ISO
  status: "scheduled" | "live" | "finished";
  home: { name: string; short: string; logo: string };
  away: { name: string; short: string; logo: string };
  venue: string;
  referee: string;
  topMarkets: MarketPick[];
  allMarkets: MarketPick[];
  isUnderdogPick?: boolean;
  underdogNote?: string;
  stats: {
    homeForm: ("V" | "E" | "D")[];
    awayForm: ("V" | "E" | "D")[];
    avgGoals: number;
    avgCorners: number;
    avgCards: number;
    h2h: string;
  };
  keyPlayers: {
    home: { name: string; role: string }[];
    away: { name: string; role: string }[];
  };
  refereeStats: { cardsPerGame: number; pensPerGame: number; tendency: string };
  summary: string;
}

const shield = (apiSportsId: number) =>
  `https://media.api-sports.io/football/teams/${apiSportsId}.png`;

const today = new Date();
const at = (h: number, m = 0, offsetDays = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

const baseMarkets = (homeFav: boolean): MarketPick[] => [
  {
    market: "Resultado (1X2)",
    pick: homeFav ? "Vitória do mandante" : "Dupla chance visitante (X2)",
    confidence: "ALTA",
    reason: "Mandante venceu 4 dos últimos 5 em casa. Visitante perdeu 3 fora seguidos.",
    odd: homeFav ? 1.75 : 1.55,
  },
  {
    market: "Ambas marcam",
    pick: "Sim",
    confidence: "ALTA",
    reason: "Os dois times marcaram em 7 dos últimos 8 confrontos.",
    odd: 1.65,
  },
  {
    market: "Total de gols",
    pick: "Mais de 2.5",
    confidence: "MÉDIA",
    reason: "Média combinada de 3.1 gols/jogo nas últimas 6 partidas.",
    odd: 1.85,
  },
  {
    market: "Placar exato",
    pick: homeFav ? "2x1 mandante" : "1x1",
    confidence: "BAIXA",
    reason: "Placar mais provável segundo o modelo de Poisson aplicado.",
    odd: 7.5,
  },
  {
    market: "Resultado 1º tempo",
    pick: "Empate",
    confidence: "MÉDIA",
    reason: "65% dos jogos do mandante terminaram empatados no 1º tempo.",
    odd: 2.1,
  },
  {
    market: "Chance dupla",
    pick: homeFav ? "1X" : "X2",
    confidence: "ALTA",
    reason: "Margem de segurança para o time melhor posicionado.",
    odd: 1.3,
  },
  {
    market: "Escanteios — Total",
    pick: "Mais de 9.5",
    confidence: "ALTA",
    reason: "Média de 11.2 escanteios nos jogos do mandante em casa.",
    odd: 1.7,
  },
  {
    market: "Cartões — Total",
    pick: "Mais de 4.5",
    confidence: "MÉDIA",
    reason: "Árbitro escalado dá média de 5.2 cartões por jogo.",
    odd: 1.9,
  },
  {
    market: "Handicap asiático",
    pick: homeFav ? "Mandante -1" : "Visitante +1",
    confidence: "MÉDIA",
    reason: "Diferença média de gols entre os times nas últimas 10 partidas.",
    odd: 2.0,
  },
  {
    market: "Cartão vermelho",
    pick: "Não",
    confidence: "ALTA",
    reason: "Apenas 1 vermelho nos últimos 12 jogos entre essas equipes.",
    odd: 1.25,
  },
  {
    market: "Jogador a marcar (qualquer momento)",
    pick: "Vinícius Jr. (mandante)",
    confidence: "ALTA",
    reason: "Marcou em 6 dos últimos 7 jogos como titular.",
    odd: 1.95,
  },
  {
    market: "Jogador a tomar cartão",
    pick: "Casemiro (visitante)",
    confidence: "MÉDIA",
    reason: "Tomou cartão em 4 dos últimos 6 jogos contra equipes brasileiras.",
    odd: 2.4,
  },
];

export const matches: Match[] = [
  {
    id: "flamengo-palmeiras",
    league: "Brasileirão Série A",
    leagueShort: "Brasileirão",
    leagueEmoji: "🇧🇷",
    date: at(21, 30),
    status: "scheduled",
    home: { name: "Flamengo", short: "FLA", logo: shield(127) },
    away: { name: "Palmeiras", short: "PAL", logo: shield(121) },
    venue: "Maracanã, Rio de Janeiro",
    referee: "Wilton Pereira Sampaio",
    summary:
      "Clássico de alta intensidade. O Flamengo joga em casa com força máxima, enquanto o Palmeiras vem em ótima fase fora. Esperamos um jogo equilibrado, com gols dos dois lados e muitas faltas.",
    topMarkets: baseMarkets(true).slice(0, 3),
    allMarkets: baseMarkets(true),
    stats: {
      homeForm: ["V", "V", "E", "V", "D"],
      awayForm: ["V", "V", "V", "E", "V"],
      avgGoals: 2.8,
      avgCorners: 10.4,
      avgCards: 5.1,
      h2h: "Últimos 5: 2V Flamengo, 2E, 1V Palmeiras",
    },
    keyPlayers: {
      home: [
        { name: "Arrascaeta", role: "Meia criativo" },
        { name: "Pedro", role: "Centroavante" },
      ],
      away: [
        { name: "Endrick", role: "Atacante" },
        { name: "Weverton", role: "Goleiro" },
      ],
    },
    refereeStats: { cardsPerGame: 5.2, pensPerGame: 0.3, tendency: "Rigoroso em faltas táticas" },
  },
  {
    id: "real-barcelona",
    league: "La Liga",
    leagueShort: "La Liga",
    leagueEmoji: "🇪🇸",
    date: at(17, 0),
    status: "scheduled",
    home: { name: "Real Madrid", short: "RMA", logo: shield(541) },
    away: { name: "Barcelona", short: "BAR", logo: shield(529) },
    venue: "Santiago Bernabéu, Madrid",
    referee: "Mateu Lahoz",
    summary:
      "El Clásico promete espetáculo. Real Madrid em casa é favorito, mas o Barcelona vem com Yamal em grande momento. Jogo aberto com gols dos dois lados.",
    topMarkets: baseMarkets(true).slice(0, 3),
    allMarkets: baseMarkets(true),
    stats: {
      homeForm: ["V", "V", "V", "V", "E"],
      awayForm: ["V", "D", "V", "V", "V"],
      avgGoals: 3.4,
      avgCorners: 11.8,
      avgCards: 4.6,
      h2h: "Últimos 5: 2V Real, 1E, 2V Barça",
    },
    keyPlayers: {
      home: [
        { name: "Vinícius Jr.", role: "Atacante" },
        { name: "Bellingham", role: "Meia" },
      ],
      away: [
        { name: "Lamine Yamal", role: "Atacante" },
        { name: "Pedri", role: "Meia" },
      ],
    },
    refereeStats: { cardsPerGame: 4.8, pensPerGame: 0.4, tendency: "Apita muito, controla com diálogo" },
  },
  {
    id: "city-arsenal",
    league: "Premier League",
    leagueShort: "Premier",
    leagueEmoji: "🏴",
    date: at(13, 30),
    status: "scheduled",
    home: { name: "Manchester City", short: "MCI", logo: shield(50) },
    away: { name: "Arsenal", short: "ARS", logo: shield(42) },
    venue: "Etihad Stadium, Manchester",
    referee: "Anthony Taylor",
    summary: "Duelo decisivo pelo topo da tabela. City favorito em casa, mas Arsenal vem invicto há 8 jogos.",
    topMarkets: baseMarkets(true).slice(0, 3),
    allMarkets: baseMarkets(true),
    stats: {
      homeForm: ["V", "V", "E", "V", "V"],
      awayForm: ["V", "V", "V", "E", "V"],
      avgGoals: 2.6,
      avgCorners: 9.8,
      avgCards: 3.9,
      h2h: "Últimos 5: 3V City, 1E, 1V Arsenal",
    },
    keyPlayers: {
      home: [
        { name: "Haaland", role: "Centroavante" },
        { name: "De Bruyne", role: "Meia" },
      ],
      away: [
        { name: "Saka", role: "Atacante" },
        { name: "Ødegaard", role: "Meia" },
      ],
    },
    refereeStats: { cardsPerGame: 4.1, pensPerGame: 0.2, tendency: "Permite jogo físico" },
  },
  {
    id: "bahia-fortaleza",
    league: "Brasileirão Série A",
    leagueShort: "Brasileirão",
    leagueEmoji: "🇧🇷",
    date: at(19, 0),
    status: "scheduled",
    home: { name: "Bahia", short: "BAH", logo: shield(118) },
    away: { name: "Fortaleza", short: "FOR", logo: shield(154) },
    venue: "Arena Fonte Nova, Salvador",
    referee: "Raphael Claus",
    summary: "Clássico nordestino com duas equipes brigando por vaga na Libertadores.",
    topMarkets: baseMarkets(false).slice(0, 3),
    allMarkets: baseMarkets(false),
    isUnderdogPick: true,
    underdogNote:
      "Fortaleza fora de casa tem desempenho 38% acima da média da liga. Bahia perdeu 3 dos últimos 4 em casa.",
    stats: {
      homeForm: ["D", "E", "V", "D", "D"],
      awayForm: ["V", "V", "E", "V", "V"],
      avgGoals: 2.2,
      avgCorners: 8.6,
      avgCards: 5.4,
      h2h: "Últimos 5: 1V Bahia, 2E, 2V Fortaleza",
    },
    keyPlayers: {
      home: [{ name: "Everaldo", role: "Atacante" }, { name: "Cauly", role: "Meia" }],
      away: [{ name: "Lucero", role: "Centroavante" }, { name: "Pikachu", role: "Lateral" }],
    },
    refereeStats: { cardsPerGame: 5.6, pensPerGame: 0.5, tendency: "Apita pênaltis com frequência" },
  },
  {
    id: "psg-marseille",
    league: "Ligue 1",
    leagueShort: "Ligue 1",
    leagueEmoji: "🇫🇷",
    date: at(16, 0, 1),
    status: "scheduled",
    home: { name: "PSG", short: "PSG", logo: shield(85) },
    away: { name: "Marseille", short: "OM", logo: shield(81) },
    venue: "Parc des Princes, Paris",
    referee: "Clément Turpin",
    summary: "Le Classique. PSG amplamente favorito em casa.",
    topMarkets: baseMarkets(true).slice(0, 3),
    allMarkets: baseMarkets(true),
    stats: {
      homeForm: ["V", "V", "V", "V", "V"],
      awayForm: ["E", "V", "D", "V", "E"],
      avgGoals: 3.1,
      avgCorners: 10.2,
      avgCards: 4.4,
      h2h: "Últimos 5: 4V PSG, 1E",
    },
    keyPlayers: {
      home: [{ name: "Dembélé", role: "Atacante" }, { name: "Vitinha", role: "Meia" }],
      away: [{ name: "Aubameyang", role: "Atacante" }, { name: "Rongier", role: "Volante" }],
    },
    refereeStats: { cardsPerGame: 4.3, pensPerGame: 0.3, tendency: "Diálogo com capitães" },
  },
  {
    id: "boca-river",
    league: "Liga Argentina",
    leagueShort: "Argentina",
    leagueEmoji: "🇦🇷",
    date: at(22, 0, 1),
    status: "scheduled",
    home: { name: "Boca Juniors", short: "BOC", logo: shield(451) },
    away: { name: "River Plate", short: "RIV", logo: shield(435) },
    venue: "La Bombonera, Buenos Aires",
    referee: "Darío Herrera",
    summary: "Superclásico. Atmosfera única e jogo travado historicamente.",
    topMarkets: baseMarkets(false).slice(0, 3),
    allMarkets: baseMarkets(false),
    isUnderdogPick: true,
    underdogNote: "Boca em casa tem aproveitamento ofensivo 22% maior contra rivais diretos.",
    stats: {
      homeForm: ["V", "E", "V", "V", "E"],
      awayForm: ["V", "V", "V", "E", "D"],
      avgGoals: 2.0,
      avgCorners: 8.9,
      avgCards: 6.2,
      h2h: "Últimos 5: 2V Boca, 2E, 1V River",
    },
    keyPlayers: {
      home: [{ name: "Cavani", role: "Centroavante" }, { name: "Medina", role: "Meia" }],
      away: [{ name: "Borja", role: "Atacante" }, { name: "Enzo Pérez", role: "Volante" }],
    },
    refereeStats: { cardsPerGame: 6.5, pensPerGame: 0.6, tendency: "Rigoroso em clássicos" },
  },
];

export const leagues = [
  { id: "all", name: "Todas", emoji: "🌎" },
  { id: "Brasileirão Série A", name: "Brasileirão", emoji: "🇧🇷" },
  { id: "La Liga", name: "La Liga", emoji: "🇪🇸" },
  { id: "Premier League", name: "Premier", emoji: "🏴" },
  { id: "Ligue 1", name: "Ligue 1", emoji: "🇫🇷" },
  { id: "Liga Argentina", name: "Argentina", emoji: "🇦🇷" },
  { id: "Champions League", name: "Champions", emoji: "🏆" },
  { id: "Serie A", name: "Itália", emoji: "🇮🇹" },
  { id: "Bundesliga", name: "Bundesliga", emoji: "🇩🇪" },
];

export const bingoOfTheDay = {
  totalOdd: 12.85,
  confidence: 62,
  selections: [
    { matchId: "flamengo-palmeiras", label: "Flamengo x Palmeiras", market: "Ambas marcam: Sim", odd: 1.65 },
    { matchId: "real-barcelona", label: "Real x Barça", market: "Mais de 2.5 gols", odd: 1.55 },
    { matchId: "city-arsenal", label: "City x Arsenal", market: "Mais de 8.5 escanteios", odd: 1.7 },
    { matchId: "psg-marseille", label: "PSG x Marseille", market: "Vitória PSG", odd: 1.45 },
    { matchId: "bahia-fortaleza", label: "Bahia x Fortaleza", market: "Mais de 4.5 cartões", odd: 1.9 },
  ],
};

export const lowOddsPicks = [
  { matchId: "psg-marseille", label: "PSG x Marseille", market: "PSG não perde", odd: 1.12, confidence: "ALTA" as Confidence },
  { matchId: "city-arsenal", label: "City x Arsenal", market: "Mais de 0.5 gol", odd: 1.08, confidence: "ALTA" as Confidence },
  { matchId: "real-barcelona", label: "Real x Barça", market: "Mais de 1.5 gol", odd: 1.22, confidence: "ALTA" as Confidence },
  { matchId: "flamengo-palmeiras", label: "Flamengo x Palmeiras", market: "Mais de 7.5 escanteios", odd: 1.35, confidence: "ALTA" as Confidence },
  { matchId: "bahia-fortaleza", label: "Bahia x Fortaleza", market: "Mais de 2.5 cartões", odd: 1.18, confidence: "ALTA" as Confidence },
  { matchId: "boca-river", label: "Boca x River", market: "Menos de 3.5 gols", odd: 1.4, confidence: "MÉDIA" as Confidence },
];
