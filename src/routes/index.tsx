import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Brain, Sparkles, ShieldCheck, Database, TrendingUp, Trophy, Zap, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MatchCard } from "@/components/MatchCard";
import { matches, leagues } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Palpites da I.A — Análise de futebol com inteligência artificial" },
      {
        name: "description",
        content:
          "Análises de futebol geradas por IA com base em dados reais de times, jogadores e árbitros. Recomendações para todos os mercados de aposta.",
      },
      { property: "og:title", content: "Palpites da I.A" },
      { property: "og:description", content: "Análise de futebol com dados reais. Palpites feitos pela inteligência artificial." },
    ],
  }),
  component: Home,
});

function Home() {
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? matches : matches.filter((m) => m.league === filter);

  return (
    <div className="min-h-screen">
      <Header />

      <section className="field-gradient border-b border-border">
        <div className="container-app py-12 md:py-20">
          <div className="inline-flex items-center gap-2 bg-primary/15 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
            <Zap className="w-3.5 h-3.5" />
            Análises completas em segundos
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] max-w-4xl">
            Previsões de futebol baseadas em{" "}
            <span className="text-primary">dados</span>,{" "}
            <span className="text-gold">não em achismo.</span>
          </h1>
          <p className="text-muted-foreground mt-5 text-lg md:text-xl max-w-2xl">
            Descubra hoje quem tem mais chance de vencer — <strong className="text-foreground">antes de apostar</strong>.
            Nossa IA analisa milhares de partidas, estatísticas de times, jogadores e árbitros pra te dar vantagem real.
          </p>

          <div className="flex flex-wrap gap-3 mt-7">
            <Link
              to="/planos"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-gold-foreground font-bold hover:opacity-90"
            >
              <Sparkles className="w-4 h-4" />
              Começar com 5 análises grátis
            </Link>
            <a
              href="#partidas"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-secondary text-foreground font-bold hover:bg-secondary/70"
            >
              Ver partidas de hoje
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Proof stats grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-10">
            <ProofCard
              icon={ShieldCheck}
              title="Precisão recente"
              big="78%"
              desc="de acerto nos resultados mais apostados da semana"
            />
            <ProofCard
              icon={Database}
              title="IA treinada com jogos reais"
              big="+10.000"
              desc="partidas analisadas pra gerar previsões mais precisas"
            />
            <ProofCard
              icon={TrendingUp}
              title="Melhora a cada rodada"
              big="24/7"
              desc="o modelo aprende e ajusta as previsões a cada jogo"
            />
            <ProofCard
              icon={Trophy}
              title="Principais ligas cobertas"
              big="1.200+"
              desc="Brasileirão, Premier, Champions, La Liga, Libertadores e mais"
            />
          </div>
        </div>
      </section>

      {/* League filter */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border">
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

      <main id="partidas" className="container-app py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-extrabold text-2xl">Partidas do dia</h2>
          <span className="text-sm text-muted-foreground">{visible.length} jogos</span>
        </div>

        {visible.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">Nenhuma partida nesta liga hoje.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((m, i) => (
              <MatchCard key={m.id} match={m} locked={i > 0} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function ProofCard({
  icon: Icon,
  title,
  big,
  desc,
}: {
  icon: typeof Brain;
  title: string;
  big: string;
  desc: string;
}) {
  return (
    <div className="bg-card/60 border border-border rounded-2xl p-5 backdrop-blur">
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">
        <Icon className="w-4 h-4 text-primary" />
        {title}
      </div>
      <div className="font-display font-extrabold text-3xl md:text-4xl text-foreground leading-none">
        {big}
      </div>
      <p className="text-sm text-muted-foreground mt-2 leading-snug">{desc}</p>
    </div>
  );
}
