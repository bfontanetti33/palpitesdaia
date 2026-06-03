import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Brain, Sparkles, ShieldCheck, Database, TrendingUp, Trophy, Zap, ArrowRight, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MatchCard } from "@/components/MatchCard";
import { fetchJogos, apiJogoToMatch } from "@/lib/api/copa";

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
  const { data: jogos, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["copa", "jogos"],
    queryFn: fetchJogos,
    staleTime: 60_000,
  });

  const matches = (jogos ?? []).map(apiJogoToMatch);

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
            O <span className="text-primary">fim do achismo</span> nas suas{" "}
            <span className="text-gold">apostas</span> começa aqui.
          </h1>
          <p className="text-muted-foreground mt-5 text-lg md:text-xl max-w-2xl">
            Chega de palpite de boteco. Nossa IA processa milhares de jogos, escalações, árbitros e estatísticas em segundos —{" "}
            <strong className="text-foreground">e te entrega as apostas com maior probabilidade de bater</strong>, antes da bola rolar.
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
              Ver partidas
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-10">
            <ProofCard icon={ShieldCheck} title="Precisão recente" big="78%" desc="de acerto nos resultados mais apostados da semana" />
            <ProofCard icon={Database} title="IA treinada com jogos reais" big="+10.000" desc="partidas analisadas pra gerar previsões mais precisas" />
            <ProofCard icon={TrendingUp} title="Melhora a cada rodada" big="24/7" desc="o modelo aprende e ajusta as previsões a cada jogo" />
            <ProofCard icon={Trophy} title="Cobertura Copa do Mundo" big="72" desc="partidas analisadas no torneio completo" />
          </div>
        </div>
      </section>

      <main id="partidas" className="container-app py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-extrabold text-2xl">Partidas da Copa</h2>
          <span className="text-sm text-muted-foreground">
            {isLoading ? "carregando..." : `${matches.length} jogos`}
          </span>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-card border border-border animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-destructive font-semibold">Não consegui carregar os jogos.</p>
            <p className="text-xs text-muted-foreground">{(error as Error)?.message}</p>
            <button onClick={() => refetch()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold">
              <Loader2 className="w-4 h-4" /> Tentar de novo
            </button>
          </div>
        ) : matches.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">Nenhuma partida disponível.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} />
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
