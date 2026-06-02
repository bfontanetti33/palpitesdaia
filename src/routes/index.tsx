import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Brain,
  Sparkles,
  ShieldCheck,
  Database,
  TrendingUp,
  Trophy,
  Zap,
  ArrowRight,
  Target,
  CheckCircle2,
  BarChart3,
  Gavel,
  Users,
  Flame,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MatchCard } from "@/components/MatchCard";
import { matches, leagues } from "@/lib/mock-data";
import mascotImg from "@/assets/mascot-aguia.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Palpites da I.A — A AGU.IA que analisa cada jogo por você" },
      {
        name: "description",
        content:
          "A AGU.IA processa milhares de jogos, escalações, árbitros e estatísticas em segundos e entrega as apostas com maior probabilidade de bater. O fim do achismo começa aqui.",
      },
      { property: "og:title", content: "Palpites da I.A — A AGU.IA dos palpites" },
      {
        property: "og:description",
        content: "Previsões de futebol feitas por IA. Dados reais, zero achismo.",
      },
    ],
  }),
  component: Home,
});

const LEAGUE_LOGOS = [
  { id: 71, name: "Brasileirão" },
  { id: 39, name: "Premier League" },
  { id: 140, name: "La Liga" },
  { id: 135, name: "Serie A" },
  { id: 78, name: "Bundesliga" },
  { id: 61, name: "Ligue 1" },
  { id: 2, name: "Champions" },
  { id: 13, name: "Libertadores" },
  { id: 3, name: "Europa League" },
  { id: 128, name: "Argentina" },
  { id: 253, name: "MLS" },
  { id: 9, name: "Copa América" },
];

function Home() {
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? matches : matches.filter((m) => m.league === filter);
  const example = matches.find((m) => m.id === "real-barcelona") ?? matches[0];

  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO */}
      <section className="hero-gradient border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
             style={{ backgroundImage:
               "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
               backgroundSize: "24px 24px" }} />
        <div className="container-app py-12 md:py-20 grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-4 items-center relative">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand/15 text-brand px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5 border border-brand/30">
              <Flame className="w-3.5 h-3.5" />
              A I.A que enxerga o que você não vê
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.02]">
              A <span className="text-brand">AGU</span>
              <span className="text-foreground">.</span>
              <span className="text-primary">IA</span> já analisou
              <br className="hidden md:block" /> o jogo. Falta só{" "}
              <span className="text-gold">você lucrar.</span>
            </h1>
            <p className="text-muted-foreground mt-5 text-lg max-w-xl">
              Olhos de águia, cérebro de máquina. Nossa IA cruza{" "}
              <strong className="text-foreground">+200 variáveis</strong> por partida — escalações,
              árbitros, retrospecto, clima — e entrega os palpites com maior probabilidade de bater,
              antes da bola rolar.
            </p>

            <div className="flex flex-wrap gap-3 mt-7">
              <Link
                to="/planos"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-gold-foreground font-bold hover:opacity-90 shadow-lg shadow-gold/20"
              >
                <Sparkles className="w-4 h-4" />
                Começar grátis
              </Link>
              <a
                href="#exemplo"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-secondary text-foreground font-bold hover:bg-secondary/70 border border-border"
              >
                Ver análise completa
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-8 max-w-lg">
              <MiniStat big="78%" label="acerto recente" />
              <MiniStat big="+10k" label="jogos analisados" />
              <MiniStat big="24/7" label="aprendendo" />
            </div>
          </div>

          {/* Mascot */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full blur-3xl bg-brand/20 scale-75" />
            <img
              src={mascotImg}
              alt="AGU.IA, mascote águia cibernética"
              width={1024}
              height={1536}
              className="relative w-full max-w-md lg:max-w-lg brand-glow drop-shadow-2xl"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* LEAGUES MARQUEE */}
      <section className="border-b border-border bg-card/30 py-8">
        <div className="container-app">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Análises em mais de 30 competições — incluindo
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 md:gap-x-12">
            {LEAGUE_LOGOS.map((l) => (
              <div key={l.id} className="flex flex-col items-center gap-1.5 group">
                <img
                  src={`https://media.api-sports.io/football/leagues/${l.id}.png`}
                  alt={l.name}
                  width={44}
                  height={44}
                  loading="lazy"
                  className="h-11 w-11 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                  style={{ filter: "brightness(1.4) contrast(1.05)" }}
                />
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
                  {l.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF / WHY */}
      <section className="container-app py-14 md:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            Por que a AGU.IA acerta mais
          </p>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl">
            Enquanto o boteco discute, a IA <span className="text-brand">calcula</span>.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          <Proof icon={Database} big="+200" title="Variáveis por jogo" desc="Escalação, lesionados, retrospecto, clima, árbitro, tática." />
          <Proof icon={ShieldCheck} big="78%" title="Precisão recente" desc="Nos mercados de maior confiança da última rodada." />
          <Proof icon={TrendingUp} big="24/7" title="Aprendendo" desc="O modelo se reajusta a cada partida finalizada." />
          <Proof icon={Trophy} big="1.200+" title="Competições" desc="Brasileirão, Premier, Champions, La Liga, Libertadores…" />
        </div>
      </section>

      {/* BIG EXAMPLE ANALYSIS */}
      <section id="exemplo" className="border-y border-border bg-card/30">
        <div className="container-app py-14 md:py-20">
          <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3">
                Análise real, ao vivo
              </p>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl">
                Isto é o que a AGU.IA entrega <span className="text-gold">em cada jogo</span>.
              </h2>
              <p className="text-muted-foreground mt-3 max-w-2xl">
                Um exemplo do nível de profundidade. Confiança calibrada, dados que sustentam o palpite
                e mercados que ninguém te conta.
              </p>
            </div>
            <Link
              to="/partida/$id"
              params={{ id: example.id }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand text-brand-foreground font-bold hover:opacity-90"
            >
              Ver análise completa
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="rounded-3xl border border-border bg-background overflow-hidden shadow-2xl">
            {/* Match header */}
            <div className="p-6 md:p-8 border-b border-border bg-gradient-to-br from-brand/10 via-transparent to-primary/10">
              <div className="flex items-center justify-between gap-6">
                <TeamBlock name={example.home.name} logo={example.home.logo} form={example.stats.homeForm} />
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                    {example.leagueShort}
                  </p>
                  <p className="font-display font-extrabold text-2xl md:text-3xl mt-1">VS</p>
                  <p className="text-xs text-muted-foreground mt-1">{example.venue.split(",")[0]}</p>
                </div>
                <TeamBlock name={example.away.name} logo={example.away.logo} form={example.stats.awayForm} reverse />
              </div>
            </div>

            {/* AI summary */}
            <div className="p-6 md:p-8 border-b border-border">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-brand/20 text-brand grid place-items-center flex-shrink-0">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-brand mb-1">
                    Resumo da AGU.IA
                  </p>
                  <p className="text-foreground/90 leading-relaxed">{example.summary}</p>
                </div>
              </div>
            </div>

            {/* Top picks with confidence bars */}
            <div className="p-6 md:p-8 grid md:grid-cols-3 gap-4 border-b border-border">
              {example.topMarkets.map((m, i) => (
                <PickCard key={i} pick={m} />
              ))}
            </div>

            {/* Stats grid */}
            <div className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatTile icon={BarChart3} label="Média de gols" value={example.stats.avgGoals.toFixed(1)} />
              <StatTile icon={Target} label="Escanteios/jogo" value={example.stats.avgCorners.toFixed(1)} />
              <StatTile icon={Users} label="Confronto direto" value={example.stats.h2h} small />
              <StatTile icon={Whistle} label="Árbitro" value={`${example.refereeStats.cardsPerGame} 🟨/jogo`} />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-app py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            Em 3 passos
          </p>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl">
            Da escalação ao palpite, em <span className="text-brand">segundos</span>.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <Step n={1} icon={Database} title="Coleta de dados" desc="A IA cruza estatísticas de times, jogadores, árbitros, clima e mercado de odds em tempo real." />
          <Step n={2} icon={Brain} title="Análise neural" desc="Modelos próprios (Poisson + redes neurais) calculam a probabilidade real de cada mercado." />
          <Step n={3} icon={CheckCircle2} title="Palpites prontos" desc="Você recebe as melhores entradas — com confiança calibrada e justificativa transparente." />
        </div>
      </section>

      {/* MATCHES */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-y border-border">
        <div className="container-app">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
            {leagues.map((l) => (
              <button
                key={l.id}
                onClick={() => setFilter(l.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  filter === l.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="mr-1.5">{l.emoji}</span>
                {l.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main id="partidas" className="container-app py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-extrabold text-2xl">Partidas do dia</h2>
          <span className="text-sm text-muted-foreground">{visible.length} jogos</span>
        </div>
        {visible.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">Nenhuma partida nesta liga hoje.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        )}
      </main>

      {/* FINAL CTA */}
      <section className="border-t border-border">
        <div className="container-app py-16 md:py-24 text-center">
          <Zap className="w-10 h-10 text-gold mx-auto mb-4" />
          <h2 className="font-display font-extrabold text-3xl md:text-5xl max-w-3xl mx-auto leading-tight">
            Pare de apostar no escuro. <span className="text-brand">Voe com a AGU.IA.</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            5 análises grátis. Sem cartão. Cancele quando quiser.
          </p>
          <Link
            to="/planos"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-gold text-gold-foreground font-bold mt-7 hover:opacity-90 shadow-xl shadow-gold/20"
          >
            <Sparkles className="w-4 h-4" />
            Quero meus palpites grátis
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function MiniStat({ big, label }: { big: string; label: string }) {
  return (
    <div>
      <div className="font-display font-extrabold text-2xl md:text-3xl text-foreground leading-none">
        {big}
      </div>
      <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{label}</p>
    </div>
  );
}

function Proof({
  icon: Icon,
  big,
  title,
  desc,
}: {
  icon: typeof Brain;
  big: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-brand/40 transition-colors">
      <Icon className="w-5 h-5 text-brand mb-3" />
      <div className="font-display font-extrabold text-3xl text-foreground leading-none">{big}</div>
      <p className="text-sm font-bold text-foreground mt-2">{title}</p>
      <p className="text-sm text-muted-foreground mt-1 leading-snug">{desc}</p>
    </div>
  );
}

function TeamBlock({
  name,
  logo,
  form,
  reverse,
}: {
  name: string;
  logo: string;
  form: ("V" | "E" | "D")[];
  reverse?: boolean;
}) {
  return (
    <div className={`flex-1 flex flex-col items-center gap-3 ${reverse ? "" : ""}`}>
      <img src={logo} alt={name} width={64} height={64} className="w-14 h-14 md:w-16 md:h-16 object-contain" />
      <p className="font-display font-bold text-base md:text-lg text-center">{name}</p>
      <div className="flex gap-1">
        {form.map((r, i) => (
          <span
            key={i}
            className={`w-5 h-5 rounded text-[10px] font-bold grid place-items-center ${
              r === "V"
                ? "bg-primary/20 text-primary"
                : r === "E"
                  ? "bg-gold/20 text-gold"
                  : "bg-destructive/20 text-destructive"
            }`}
          >
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}

function PickCard({ pick }: { pick: (typeof matches)[number]["topMarkets"][number] }) {
  const conf = pick.confidence === "ALTA" ? 88 : pick.confidence === "MÉDIA" ? 62 : 38;
  const color =
    pick.confidence === "ALTA" ? "bg-primary" : pick.confidence === "MÉDIA" ? "bg-gold" : "bg-muted-foreground";
  const dot =
    pick.confidence === "ALTA" ? "🟢" : pick.confidence === "MÉDIA" ? "🟡" : "⚪";
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            {pick.market}
          </p>
          <p className="font-bold text-foreground mt-1 leading-snug">{pick.pick}</p>
        </div>
        {pick.odd && (
          <span className="text-sm font-display font-extrabold text-gold flex-shrink-0">
            @{pick.odd.toFixed(2)}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground leading-snug">{pick.reason}</p>
      <div>
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide mb-1">
          <span className="text-muted-foreground">
            {dot} Confiança {pick.confidence}
          </span>
          <span className="text-foreground">{conf}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div className={`h-full ${color} rounded-full`} style={{ width: `${conf}%` }} />
        </div>
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  small,
}: {
  icon: typeof Brain;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <p className={`font-display font-extrabold text-foreground ${small ? "text-sm" : "text-xl"}`}>
        {value}
      </p>
    </div>
  );
}

function Step({
  n,
  icon: Icon,
  title,
  desc,
}: {
  n: number;
  icon: typeof Brain;
  title: string;
  desc: string;
}) {
  return (
    <div className="relative bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors">
      <div className="absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-brand text-brand-foreground grid place-items-center font-display font-extrabold shadow-lg">
        {n}
      </div>
      <Icon className="w-6 h-6 text-primary mb-3 mt-2" />
      <p className="font-display font-bold text-lg">{title}</p>
      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{desc}</p>
    </div>
  );
}
