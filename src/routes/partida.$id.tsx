import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, MapPin, Users, Flag as WhistleIcon, AlertTriangle, TrendingUp, Trophy, Target, Sparkles } from "lucide-react";
import type { Match, MarketPick } from "@/lib/mock-data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { PaywallBlur } from "@/components/PaywallBlur";
import { matches } from "@/lib/mock-data";

export const Route = createFileRoute("/partida/$id")({
  head: ({ params }) => {
    const m = matches.find((x) => x.id === params.id);
    const title = m ? `${m.home.name} x ${m.away.name} — Análise da IA` : "Partida";
    return {
      meta: [
        { title: `${title} | Palpites da I.A` },
        { name: "description", content: m?.summary ?? "Análise completa gerada por IA." },
      ],
    };
  },
  loader: ({ params }) => {
    const match = matches.find((m) => m.id === params.id);
    if (!match) throw notFound();
    return { match };
  },
  component: MatchPage,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">Partida não encontrada</div>
  ),
});

const FormDot = ({ r }: { r: "V" | "E" | "D" }) => {
  const c = r === "V" ? "bg-confidence-high" : r === "E" ? "bg-confidence-mid" : "bg-destructive";
  return (
    <span className={`w-6 h-6 rounded-md ${c} text-[10px] font-bold grid place-items-center text-white`}>
      {r}
    </span>
  );
};

function MatchPage() {
  const { match } = Route.useLoaderData() as { match: Match };
  const dateStr = new Date(match.date).toLocaleString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
  const deep = buildDeepStats(match);



  return (
    <div className="min-h-screen">
      <Header />

      <div className="field-gradient border-b border-border">
        <div className="container-app py-6">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>

          <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
            <span>{match.leagueEmoji}</span>
            <span className="font-semibold">{match.league}</span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-5">
            <div className="flex flex-col items-center md:flex-row md:items-center gap-3 md:gap-4">
              <img src={match.home.logo} alt="" className="w-16 h-16 md:w-20 md:h-20 rounded-full" />
              <span className="font-display font-extrabold text-lg md:text-2xl text-center md:text-left">
                {match.home.name}
              </span>
            </div>
            <span className="font-display font-extrabold text-2xl text-muted-foreground">VS</span>
            <div className="flex flex-col-reverse items-center md:flex-row md:items-center md:justify-end gap-3 md:gap-4">
              <span className="font-display font-extrabold text-lg md:text-2xl text-center md:text-right">
                {match.away.name}
              </span>
              <img src={match.away.logo} alt="" className="w-16 h-16 md:w-20 md:h-20 rounded-full" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {dateStr}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {match.venue}</span>
            <span className="inline-flex items-center gap-1.5"><WhistleIcon className="w-4 h-4" /> {match.referee}</span>
          </div>
        </div>
      </div>

      <main className="container-app py-8 space-y-8">
        {/* Resumo */}
        <section className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-display font-extrabold text-xl mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full" />
            Resumo da IA
          </h2>
          <p className="text-muted-foreground leading-relaxed">{match.summary}</p>
        </section>

        {/* Mercados */}
        <section>
          <h2 className="font-display font-extrabold text-xl mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full" />
            Análise por mercado
          </h2>

          <PaywallBlur message="Acesso a todos os 24 mercados analisados">
            <div className="grid md:grid-cols-2 gap-4">
              {match.allMarkets.map((m) => (
                <div key={m.market} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">{m.market}</div>
                      <div className="font-display font-bold text-lg mt-0.5">{m.pick}</div>
                    </div>
                    <ConfidenceBadge level={m.confidence} compact />
                  </div>
                  <p className="text-sm text-muted-foreground">{m.reason}</p>
                  {m.odd && (
                    <div className="mt-3 inline-flex items-center gap-2 text-xs bg-gold/15 text-gold rounded-full px-2.5 py-1 font-bold">
                      Odd estimada: {m.odd.toFixed(2)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </PaywallBlur>
        </section>

        {/* Stats */}
        <section className="grid md:grid-cols-2 gap-5">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-display font-bold mb-4">Forma recente</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold truncate">{match.home.name}</span>
              <div className="flex gap-1">{match.stats.homeForm.map((r, i) => <FormDot key={i} r={r} />)}</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold truncate">{match.away.name}</span>
              <div className="flex gap-1">{match.stats.awayForm.map((r, i) => <FormDot key={i} r={r} />)}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 border-t border-border pt-3">{match.stats.h2h}</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-display font-bold mb-4">Médias do confronto</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <Stat label="Gols/jogo" value={match.stats.avgGoals.toFixed(1)} />
              <Stat label="Escanteios" value={match.stats.avgCorners.toFixed(1)} />
              <Stat label="Cartões" value={match.stats.avgCards.toFixed(1)} />
            </div>
          </div>
        </section>

        {/* Jogadores */}
        <section className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Jogadores-chave
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {(["home", "away"] as const).map((side) => (
              <div key={side}>
                <div className="text-xs uppercase font-bold text-muted-foreground mb-2">
                  {match[side].name}
                </div>
                <ul className="space-y-2">
                  {match.keyPlayers[side].map((p) => (
                    <li key={p.name} className="flex items-center justify-between bg-secondary/60 rounded-xl px-3 py-2.5">
                      <span className="font-semibold text-sm">{p.name}</span>
                      <span className="text-xs text-muted-foreground">{p.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Árbitro */}
        <section className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-bold mb-1 flex items-center gap-2">
            <WhistleIcon className="w-5 h-5 text-gold" /> {match.referee}
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Análise do árbitro escalado</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <Stat label="Cartões/jogo" value={match.refereeStats.cardsPerGame.toFixed(1)} />
            <Stat label="Pênaltis/jogo" value={match.refereeStats.pensPerGame.toFixed(1)} />
            <Stat label="Perfil" value={match.refereeStats.tendency} small />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Stat({ label, value, small = false }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="bg-secondary/60 rounded-xl p-3">
      <div className={`font-display font-extrabold ${small ? "text-sm" : "text-2xl"} text-foreground`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
