import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Brain, Sparkles } from "lucide-react";
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
        <div className="container-app py-10 md:py-16">
          <div className="inline-flex items-center gap-2 bg-primary/15 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Brain className="w-3.5 h-3.5" />
            Powered by I.A
          </div>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] max-w-3xl">
            A <span className="text-primary">pelada certa</span> pra apostar,{" "}
            <span className="text-gold">analisada pela IA.</span>
          </h1>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl">
            Dados reais de times, jogadores e árbitros. Recomendações para mais de 20 mercados em cada partida.
          </p>
          <div className="flex items-center gap-4 mt-6 text-sm">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gold" />
              <span><strong className="text-foreground">1.200+</strong> ligas cobertas</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div><strong className="text-foreground">24</strong> mercados por jogo</div>
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

      <main className="container-app py-8">
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
