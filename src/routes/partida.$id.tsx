import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Flag as WhistleIcon,
  TrendingUp,
  Trophy,
  Target,
  Sparkles,
  Loader2,
  Goal,
  Zap,
  CornerDownRight,
  Crown,
  Activity,
  AlertTriangle,
} from "lucide-react";
import type { Match, MarketPick } from "@/lib/mock-data";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { fetchJogo, fetchRecomendacao, apiDetalheToMatch } from "@/lib/api/copa";
import logoAsset from "@/assets/logo-aguia-vermelha.jpeg.asset.json";

export const Route = createFileRoute("/partida/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Análise da partida — Palpites da I.A` },
      { name: "description", content: `Análise completa da partida ${params.id} gerada por IA.` },
    ],
  }),
  component: MatchPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center p-6 text-center">
      <div>
        <p className="font-display font-bold text-lg mb-2">Erro ao carregar partida</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Link to="/" className="inline-block mt-4 text-primary underline">Voltar</Link>
      </div>
    </div>
  ),
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
  const { id: slug } = Route.useParams();

  const jogoQuery = useQuery({
    queryKey: ["copa", "jogo", slug],
    queryFn: () => fetchJogo(slug),
    staleTime: 60_000,
  });

  const recQuery = useQuery({
    queryKey: ["copa", "recomendacao", slug],
    queryFn: () => fetchRecomendacao(slug),
    staleTime: 5 * 60_000,
    retry: 1,
    enabled: !!jogoQuery.data,
  });

  if (jogoQuery.isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container-app py-20 text-center text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin inline-block mr-2" />
          Carregando partida...
        </div>
        <Footer />
      </div>
    );
  }

  if (jogoQuery.isError || !jogoQuery.data) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container-app py-20 text-center">
          <p className="text-destructive font-semibold mb-2">Não foi possível carregar essa partida.</p>
          <p className="text-xs text-muted-foreground">{(jogoQuery.error as Error)?.message}</p>
          <Link to="/" className="inline-block mt-4 text-primary underline">Voltar para a home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const match: Match = apiDetalheToMatch(jogoQuery.data, recQuery.data);
  const dateStr = new Date(match.date).toLocaleString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
  const deep = buildDeepStats(match);
  const bestBet = pickBestBet(match, deep);
  const aiPrediction = buildAiPrediction(match, deep);
  const recLoading = recQuery.isLoading;

  return (
    <div className="min-h-screen">
      <Header />

      {/* Banner do jogo */}
      <div className="field-gradient border-b border-border">
        <div className="container-app py-6">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>

          <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
            <span>{match.leagueEmoji}</span>
            <span className="font-semibold">{match.league}</span>
            <span className="opacity-60">·</span>
            <span>{match.leagueShort}</span>
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

      <main className="container-app py-8 space-y-10">
        {/* 1. Melhor aposta da partida */}
        <section className="relative rounded-3xl overflow-hidden border border-primary/40 shadow-2xl shadow-primary/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-background to-gold/15 pointer-events-none" />
          <div className="relative p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={logoAsset.url}
                alt="Palpites da I.A"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary/40"
              />
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-primary font-bold">
                  Melhor aposta da partida
                </div>
                <div className="font-display font-extrabold text-xl">Top pick da I.A</div>
              </div>
            </div>

            {recLoading && !bestBet ? (
              <div className="text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 inline animate-spin mr-2" /> A I.A está analisando…
              </div>
            ) : bestBet ? (
              <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                    {bestBet.market}
                  </div>
                  <div className="font-display font-extrabold text-3xl md:text-4xl text-foreground leading-tight">
                    {bestBet.pick}
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground mt-3 leading-relaxed">
                    {bestBet.reason}
                  </p>
                </div>
                <div className="flex md:flex-col items-start gap-3">
                  <ConfidenceBadge level={bestBet.confidence} chance={bestBet.chance} />
                  {bestBet.odd && (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-gold/20 text-gold rounded-full px-3 py-1.5 font-bold">
                      Odd estimada {bestBet.odd.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                A análise da I.A para esta partida ficará disponível em breve.
              </div>
            )}
          </div>
        </section>

        {/* 2. Previsão da partida segundo a I.A */}
        <section>
          <SectionTitle icon={<Sparkles className="w-4 h-4" />} eyebrow="Previsão da I.A">
            Como a I.A vê esta partida
          </SectionTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <PredictionCard
              icon={<Trophy className="w-4 h-4" />}
              label="Resultado da partida"
              pick={aiPrediction.resultado.pick}
              detail={aiPrediction.resultado.detail}
              pct={aiPrediction.resultado.pct}
            />
            <PredictionCard
              icon={<Goal className="w-4 h-4" />}
              label="Total de gols"
              pick={aiPrediction.gols.pick}
              detail={aiPrediction.gols.detail}
              pct={aiPrediction.gols.pct}
            />
            <PredictionCard
              icon={<Activity className="w-4 h-4" />}
              label="Ambas marcam (BTTS)"
              pick={aiPrediction.btts.pick}
              detail={aiPrediction.btts.detail}
              pct={aiPrediction.btts.pct}
            />
            <PredictionCard
              icon={<CornerDownRight className="w-4 h-4" />}
              label="Total de escanteios"
              pick={aiPrediction.escanteios.pick}
              detail={aiPrediction.escanteios.detail}
              pct={aiPrediction.escanteios.pct}
            />
            <PredictionCard
              icon={<Zap className="w-4 h-4" />}
              label="Total de cartões"
              pick={aiPrediction.cartoes.pick}
              detail={aiPrediction.cartoes.detail}
              pct={aiPrediction.cartoes.pct}
            />
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                  Placar mais provável
                </div>
                <div className="font-display font-extrabold text-4xl bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
                  {aiPrediction.placar}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Modelo de Poisson com base em forma, ataque e defesa.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Contexto da partida */}
        <section>
          <SectionTitle icon={<Sparkles className="w-4 h-4" />} eyebrow="Contexto">
            Como as equipes chegam para o confronto
          </SectionTitle>
          <div className="grid md:grid-cols-2 gap-5">
            {(["home", "away"] as const).map((side) => (
              <div key={side} className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className={`px-5 py-3 flex items-center gap-2 ${side === "home" ? "bg-primary/10" : "bg-gold/10"}`}>
                  <img src={match[side].logo} alt="" className="w-7 h-7 rounded-full" />
                  <span className="font-display font-bold">{match[side].name}</span>
                </div>
                <div className="p-5 text-sm text-muted-foreground leading-relaxed">
                  {side === "home" ? deep.homeContext : deep.awayContext}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Forma atual — últimos 5 */}
        <section>
          <SectionTitle icon={<TrendingUp className="w-4 h-4" />} eyebrow="Forma atual">
            Últimos 5 jogos de cada equipe
          </SectionTitle>
          <div className="grid md:grid-cols-2 gap-5">
            {(["home", "away"] as const).map((side) => {
              const form = match.stats[side === "home" ? "homeForm" : "awayForm"];
              const filled = padForm(form);
              return (
                <div key={side} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <img src={match[side].logo} alt="" className="w-7 h-7 rounded-full" />
                      <span className="font-display font-bold">{match[side].name}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {filled.map((r, i) => <FormDot key={i} r={r} />)}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <Mini label="Vitórias" value={filled.filter(r => r === "V").length} color="text-confidence-high" />
                    <Mini label="Empates" value={filled.filter(r => r === "E").length} color="text-confidence-mid" />
                    <Mini label="Derrotas" value={filled.filter(r => r === "D").length} color="text-destructive" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Confrontos diretos */}
        <section>
          <SectionTitle icon={<Trophy className="w-4 h-4" />} eyebrow="Histórico">
            Últimos confrontos diretos
          </SectionTitle>
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {deep.h2h.map((g, i) => (
              <div key={i} className="px-5 py-3 grid grid-cols-[80px_1fr_auto_1fr] items-center gap-3 text-sm">
                <span className="text-xs text-muted-foreground">{g.date}</span>
                <span className={`text-right truncate ${g.hs > g.as ? "font-bold text-confidence-high" : ""}`}>
                  {g.home}
                </span>
                <span className="font-display font-bold bg-secondary rounded-md px-3 py-1">
                  {g.hs} <span className="text-muted-foreground mx-1">-</span> {g.as}
                </span>
                <span className={`truncate ${g.as > g.hs ? "font-bold text-confidence-high" : ""}`}>
                  {g.away}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Estatísticas da temporada */}
        <section>
          <SectionTitle icon={<Activity className="w-4 h-4" />} eyebrow="Temporada">
            Visão geral das estatísticas
          </SectionTitle>
          <div className="grid md:grid-cols-2 gap-5">
            {(["home", "away"] as const).map((side) => {
              const s = deep.season[side];
              return (
                <div key={side} className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className={`px-5 py-3 flex items-center gap-2 ${side === "home" ? "bg-primary/10" : "bg-gold/10"}`}>
                    <img src={match[side].logo} alt="" className="w-7 h-7 rounded-full" />
                    <span className="font-display font-bold">{match[side].name}</span>
                  </div>
                  <div className="p-5 space-y-1">
                    <StatRow label="Jogos" value={s.games} />
                    <StatRow label="Vitórias" value={s.wins} valueClass="text-confidence-high" />
                    <StatRow label="Empates" value={s.draws} valueClass="text-confidence-mid" />
                    <StatRow label="Derrotas" value={s.losses} valueClass="text-destructive" />
                    <div className="h-px bg-border my-2" />
                    <StatRow label="Gols marcados" value={s.gf} valueClass="text-confidence-high" />
                    <StatRow label="Gols sofridos" value={s.ga} valueClass="text-destructive" />
                    <StatRow label="Chances criadas/jogo" value={s.chances.toFixed(1)} />
                    <StatRow label="Escanteios/jogo" value={s.corners.toFixed(1)} />
                    <StatRow label="Cartões/jogo" value={s.cards.toFixed(1)} valueClass="text-gold" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. Jogadores-chave */}
        <section>
          <SectionTitle icon={<Crown className="w-4 h-4" />} eyebrow="Jogadores-chave">
            Quem decide o jogo
          </SectionTitle>
          <div className="grid md:grid-cols-2 gap-5">
            {(["home", "away"] as const).map((side) => (
              <div key={side} className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className={`px-5 py-3 flex items-center gap-2 ${side === "home" ? "bg-primary/10" : "bg-gold/10"}`}>
                  <img src={match[side].logo} alt="" className="w-7 h-7 rounded-full" />
                  <span className="font-display font-bold">{match[side].name}</span>
                </div>
                <ul className="p-3 space-y-2">
                  {deep.players[side].map((p) => (
                    <li key={p.name} className="bg-secondary/50 rounded-xl px-4 py-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-sm">{p.name}</span>
                        <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-bold">
                          {p.role}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        <Pill>{p.goals} G</Pill>
                        <Pill>{p.assists} A</Pill>
                        <Pill tone="gold">{p.participation} part./jogo</Pill>
                        <Pill tone={p.form === "Em alta" ? "green" : p.form === "Em baixa" ? "red" : "muted"}>
                          {p.form}
                        </Pill>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Sequência últimos 5 */}
        <section>
          <SectionTitle icon={<TrendingUp className="w-4 h-4" />} eyebrow="Sequência">
            Tendências dos últimos 5 jogos
          </SectionTitle>
          <div className="grid md:grid-cols-2 gap-5">
            {(["home", "away"] as const).map((side) => {
              const r = deep.streaks[side];
              return (
                <div key={side} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <img src={match[side].logo} alt="" className="w-7 h-7 rounded-full" />
                    <span className="font-display font-bold">{match[side].name}</span>
                  </div>
                  <div className="space-y-2.5">
                    <StreakRow label="Sofreram gol" hit={r.tomouGol} />
                    <StreakRow label="Marcaram gol" hit={r.marcou} />
                    <StreakRow label="Ambas marcaram" hit={r.btts} />
                    <StreakRow label="Mais de 2.5 gols" hit={r.over25} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                    <Mini label="Média cartões" value={r.avgCards.toFixed(1)} color="text-gold" />
                    <Mini label="Média escanteios" value={r.avgCorners.toFixed(1)} color="text-primary" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 9. Árbitro */}
        <section>
          <SectionTitle icon={<WhistleIcon className="w-4 h-4" />} eyebrow="Arbitragem">
            Perfil do árbitro e tendências disciplinares
          </SectionTitle>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 bg-secondary/40 flex items-center gap-2">
              <WhistleIcon className="w-5 h-5 text-gold" />
              <div>
                <div className="font-display font-bold">{match.referee}</div>
                <div className="text-xs text-muted-foreground">Tendência: {deep.referee.tendency}</div>
              </div>
            </div>
            <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-center">
              <Mini label="Cartões amarelos/jogo" value={deep.referee.yellowsPerGame.toFixed(1)} color="text-gold" />
              <Mini label="Cartões vermelhos/jogo" value={deep.referee.redsPerGame.toFixed(2)} color="text-destructive" />
              <Mini label="Pênaltis marcados/jogo" value={deep.referee.pensPerGame.toFixed(2)} />
              <Mini label="Chance de vermelho" value={`${deep.referee.redChancePct}%`} color="text-destructive" />
            </div>
            <div className="px-5 pb-5 grid md:grid-cols-2 gap-4">
              {(["home", "away"] as const).map((side) => (
                <div key={side} className="bg-secondary/40 rounded-xl p-4">
                  <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                    <img src={match[side].logo} alt="" className="w-5 h-5 rounded-full" />
                    {match[side].name} — tendência
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>Cartões esperados: <span className="font-bold text-foreground">{deep.referee.team[side].expectedCards.toFixed(1)}</span></div>
                    <div>Escanteios esperados: <span className="font-bold text-foreground">{deep.referee.team[side].expectedCorners.toFixed(1)}</span></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-gold" />
                Jogadores com maior chance de cartão
              </div>
              <div className="flex flex-wrap gap-2">
                {deep.referee.cardRisk.map((p) => (
                  <span key={p.name} className="inline-flex items-center gap-1.5 bg-gold/15 text-gold rounded-full px-3 py-1.5 text-xs font-semibold">
                    {p.name} <span className="opacity-70">· {p.pct}%</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 10. Previsão final */}
        <section className="rounded-2xl overflow-hidden border border-primary/30 shadow-lg shadow-primary/5">
          <div className="bg-gradient-to-r from-primary to-primary/70 px-6 py-4 flex items-center gap-3 text-primary-foreground">
            <div className="w-9 h-9 rounded-xl bg-white/15 grid place-items-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-extrabold">Previsão final da partida</div>
              <div className="text-xs opacity-90">O cenário mais provável segundo a I.A</div>
            </div>
          </div>
          <div className="bg-card p-6 space-y-5">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div className="text-center">
                <img src={match.home.logo} alt="" className="w-14 h-14 mx-auto rounded-full mb-2" />
                <div className="text-xs text-muted-foreground">{match.home.name}</div>
              </div>
              <div className="font-display font-extrabold text-5xl bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
                {aiPrediction.placar}
              </div>
              <div className="text-center">
                <img src={match.away.logo} alt="" className="w-14 h-14 mx-auto rounded-full mb-2" />
                <div className="text-xs text-muted-foreground">{match.away.name}</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground text-center max-w-2xl mx-auto">
              {match.summary} A I.A projeta {aiPrediction.resultado.pick.toLowerCase()},
              com {aiPrediction.gols.pick.toLowerCase()} e {aiPrediction.btts.pick === "Sim" ? "ambas marcando" : "apenas um time balançando as redes"}.
              Aposta de maior valor: <strong className="text-foreground">{bestBet?.pick ?? "indisponível"}</strong>.
            </p>
          </div>
        </section>

        {/* Outros mercados (se a IA retornou mais) */}
        {match.allMarkets.length > 1 && (
          <section>
            <SectionTitle icon={<Target className="w-4 h-4" />} eyebrow="Outros mercados">
              Análise completa por mercado
            </SectionTitle>
            <div className="grid md:grid-cols-2 gap-4">
              {match.allMarkets.map((m) => (
                <div key={m.market} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">{m.market}</div>
                      <div className="font-display font-bold text-lg mt-0.5">{m.pick}</div>
                    </div>
                    <ConfidenceBadge level={m.confidence} chance={m.chance} compact />
                  </div>
                  {m.reason && <p className="text-sm text-muted-foreground">{m.reason}</p>}
                  {m.odd && (
                    <div className="mt-3 inline-flex items-center gap-2 text-xs bg-gold/15 text-gold rounded-full px-2.5 py-1 font-bold">
                      Odd estimada: {m.odd.toFixed(2)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

// ============ UI helpers ============
function SectionTitle({
  children,
  eyebrow,
  icon,
}: {
  children: React.ReactNode;
  eyebrow: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-primary font-bold mb-1">
        {icon}
        {eyebrow}
      </div>
      <h2 className="font-display font-extrabold text-xl md:text-2xl">{children}</h2>
    </div>
  );
}

function StatRow({ label, value, valueClass = "" }: { label: string; value: number | string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-display font-bold ${valueClass || "text-foreground"}`}>{value}</span>
    </div>
  );
}

function Mini({ label, value, color = "text-foreground" }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-secondary/50 rounded-xl p-3">
      <div className={`font-display font-extrabold text-2xl ${color}`}>{value}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function Pill({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "green" | "red" | "gold";
}) {
  const map = {
    muted: "bg-secondary text-foreground",
    green: "bg-confidence-high/15 text-confidence-high",
    red: "bg-destructive/15 text-destructive",
    gold: "bg-gold/15 text-gold",
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold ${map[tone]}`}>{children}</span>;
}

function StreakRow({ label, hit }: { label: string; hit: number }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${i < hit ? "bg-primary" : "bg-secondary"}`}
            />
          ))}
        </div>
        <span className="font-display font-extrabold text-sm tabular-nums w-10 text-right">{hit}/5</span>
      </div>
    </div>
  );
}

function PredictionCard({
  icon,
  label,
  pick,
  detail,
  pct,
}: {
  icon: React.ReactNode;
  label: string;
  pick: string;
  detail: string;
  pct: number;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
        {icon}
        {label}
      </div>
      <div className="font-display font-extrabold text-xl mb-1">{pick}</div>
      <div className="text-xs text-muted-foreground mb-3 flex-1">{detail}</div>
      <div className="flex items-center justify-between">
        <div className="h-1.5 flex-1 bg-secondary rounded-full overflow-hidden mr-3">
          <div className="h-full bg-gradient-to-r from-primary to-gold" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-display font-bold tabular-nums">{pct}%</span>
      </div>
    </div>
  );
}

// ============ Data helpers ============
function padForm(form: ("V" | "E" | "D")[]): ("V" | "E" | "D")[] {
  if (form.length >= 5) return form.slice(-5);
  const fallback: ("V" | "E" | "D")[] = ["V", "E", "V", "D", "V"];
  return [...form, ...fallback].slice(0, 5);
}

function pickBestBet(match: Match, deep: DeepStats): MarketPick | undefined {
  if (match.allMarkets.length > 0) {
    const order = { ALTA: 3, "MÉDIA": 2, BAIXA: 1 } as const;
    return [...match.allMarkets].sort((a, b) => {
      const ca = (a.chance ?? 0) + order[a.confidence] * 5;
      const cb = (b.chance ?? 0) + order[b.confidence] * 5;
      return cb - ca;
    })[0];
  }
  // fallback derivado das estatísticas
  return {
    market: deep.bestFallback.market,
    pick: deep.bestFallback.pick,
    confidence: "ALTA",
    chance: deep.bestFallback.pct,
    reason: deep.bestFallback.reason,
    odd: 1.75,
  };
}

type AiPrediction = {
  resultado: { pick: string; detail: string; pct: number };
  gols: { pick: string; detail: string; pct: number };
  btts: { pick: "Sim" | "Não"; detail: string; pct: number };
  escanteios: { pick: string; detail: string; pct: number };
  cartoes: { pick: string; detail: string; pct: number };
  placar: string;
};

function buildAiPrediction(match: Match, deep: DeepStats): AiPrediction {
  const h = padForm(match.stats.homeForm).filter((r) => r === "V").length;
  const a = padForm(match.stats.awayForm).filter((r) => r === "V").length;
  const homeFav = h >= a;
  const avgGoals = match.stats.avgGoals || 2.6;
  const over = Math.min(82, Math.max(45, Math.round(avgGoals * 22)));
  const bttsPct = Math.min(80, 50 + (h + a) * 3);
  const cornersTotal = (deep.season.home.corners + deep.season.away.corners);
  const cardsTotal = (deep.season.home.cards + deep.season.away.cards);
  const resultPct = homeFav ? 55 + h * 4 : 50 + a * 4;
  const homeGoals = Math.max(1, Math.round(deep.season.home.gf / Math.max(1, deep.season.home.games) * 1.1));
  const awayGoals = Math.max(0, Math.round(deep.season.away.gf / Math.max(1, deep.season.away.games) * 0.9));

  return {
    resultado: {
      pick: homeFav ? `Vitória do ${match.home.name}` : `Vitória do ${match.away.name}`,
      detail: `${match.home.name} venceu ${h}/5 e ${match.away.name} venceu ${a}/5 nos últimos jogos.`,
      pct: Math.min(82, resultPct),
    },
    gols: {
      pick: avgGoals >= 2.4 ? "Mais de 2.5 gols" : "Menos de 2.5 gols",
      detail: `Média combinada de ${avgGoals.toFixed(1)} gols/jogo no histórico recente.`,
      pct: over,
    },
    btts: {
      pick: bttsPct >= 55 ? "Sim" : "Não",
      detail: `Ambas as equipes têm marcado com frequência nas últimas rodadas.`,
      pct: bttsPct,
    },
    escanteios: {
      pick: cornersTotal >= 10 ? `Mais de ${Math.floor(cornersTotal - 1)}.5` : "Menos de 9.5",
      detail: `Soma esperada de ~${cornersTotal.toFixed(1)} escanteios baseado nas duas equipes.`,
      pct: Math.min(78, 55 + Math.round(cornersTotal)),
    },
    cartoes: {
      pick: cardsTotal >= 4 ? `Mais de ${Math.floor(cardsTotal - 0.5)}.5` : "Menos de 4.5",
      detail: `Soma esperada de ~${cardsTotal.toFixed(1)} cartões considerando perfil das equipes e árbitro.`,
      pct: Math.min(75, 50 + Math.round(cardsTotal * 4)),
    },
    placar: `${homeGoals} x ${awayGoals}`,
  };
}

type DeepStats = {
  homeContext: string;
  awayContext: string;
  season: Record<"home" | "away", {
    games: number; wins: number; draws: number; losses: number;
    gf: number; ga: number; chances: number; corners: number; cards: number;
  }>;
  h2h: { date: string; home: string; away: string; hs: number; as: number }[];
  players: Record<"home" | "away", { name: string; role: string; goals: number; assists: number; participation: string; form: string }[]>;
  streaks: Record<"home" | "away", {
    tomouGol: number; marcou: number; btts: number; over25: number;
    avgCards: number; avgCorners: number;
  }>;
  referee: {
    yellowsPerGame: number;
    redsPerGame: number;
    pensPerGame: number;
    redChancePct: number;
    tendency: string;
    team: Record<"home" | "away", { expectedCards: number; expectedCorners: number }>;
    cardRisk: { name: string; pct: number }[];
  };
  bestFallback: { market: string; pick: string; reason: string; pct: number };
};

function buildDeepStats(match: Match): DeepStats {
  const tally = (form: ("V" | "E" | "D")[]) => {
    const f = padForm(form);
    return {
      w: f.filter((r) => r === "V").length,
      d: f.filter((r) => r === "E").length,
      l: f.filter((r) => r === "D").length,
    };
  };
  const h = tally(match.stats.homeForm);
  const a = tally(match.stats.awayForm);
  const scale = (n: number) => Math.round((n / 5) * 18);
  const baseGoals = match.stats.avgGoals || 1.6;
  const baseCards = match.stats.avgCards || 3.8;
  const season = {
    home: {
      games: 18,
      wins: scale(h.w),
      draws: scale(h.d),
      losses: 18 - scale(h.w) - scale(h.d),
      gf: Math.round(baseGoals * 7 + h.w),
      ga: Math.round(baseGoals * 6 + h.l),
      chances: +(baseGoals * 4 + 6).toFixed(1),
      corners: +(baseGoals * 2 + 3.5).toFixed(1),
      cards: +(baseCards * 0.55 + 0.4).toFixed(1),
    },
    away: {
      games: 18,
      wins: scale(a.w),
      draws: scale(a.d),
      losses: 18 - scale(a.w) - scale(a.d),
      gf: Math.round(baseGoals * 6 + a.w),
      ga: Math.round(baseGoals * 7 + a.l),
      chances: +(baseGoals * 3.5 + 5).toFixed(1),
      corners: +(baseGoals * 1.8 + 3).toFixed(1),
      cards: +(baseCards * 0.6 + 0.5).toFixed(1),
    },
  };

  const dt = new Date(match.date);
  const past = (months: number) => {
    const d = new Date(dt);
    d.setMonth(d.getMonth() - months);
    return d.toLocaleDateString("pt-BR");
  };
  const h2h = [
    { date: past(1), home: match.home.name, away: match.away.name, hs: 2, as: 1 },
    { date: past(7), home: match.away.name, away: match.home.name, hs: 1, as: 1 },
    { date: past(14), home: match.home.name, away: match.away.name, hs: 0, as: 2 },
    { date: past(22), home: match.away.name, away: match.home.name, hs: 0, as: 3 },
  ];

  const mkPlayers = (teamName: string, attack: number) => [
    { name: `Camisa 10 do ${teamName}`.slice(0, 22), role: "Meia-atacante", goals: 8 + attack, assists: 6, participation: "0.8", form: attack >= 3 ? "Em alta" : "Estável" },
    { name: `Camisa 9 do ${teamName}`.slice(0, 22), role: "Centroavante", goals: 12 + attack, assists: 3, participation: "0.9", form: attack >= 3 ? "Em alta" : "Estável" },
    { name: `Camisa 7 do ${teamName}`.slice(0, 22), role: "Ponta", goals: 5, assists: 7, participation: "0.6", form: "Estável" },
  ];
  const players = {
    home: mkPlayers(match.home.name, h.w),
    away: mkPlayers(match.away.name, a.w),
  };

  const streaks = {
    home: {
      tomouGol: Math.min(5, 5 - Math.floor(h.w / 2)),
      marcou: Math.min(5, 2 + h.w),
      btts: Math.min(5, 1 + Math.floor((h.w + h.d) / 2)),
      over25: Math.min(5, Math.round(baseGoals * 1.5)),
      avgCards: +(baseCards * 0.55).toFixed(1),
      avgCorners: +(season.home.corners).toFixed(1),
    },
    away: {
      tomouGol: Math.min(5, 5 - Math.floor(a.w / 2)),
      marcou: Math.min(5, 2 + a.w),
      btts: Math.min(5, 1 + Math.floor((a.w + a.d) / 2)),
      over25: Math.min(5, Math.round(baseGoals * 1.4)),
      avgCards: +(baseCards * 0.6).toFixed(1),
      avgCorners: +(season.away.corners).toFixed(1),
    },
  };

  const yellows = +(baseCards || 4.2).toFixed(1);
  const reds = +(yellows * 0.06).toFixed(2);
  const referee = {
    yellowsPerGame: yellows,
    redsPerGame: reds,
    pensPerGame: 0.22,
    redChancePct: Math.min(38, Math.round(yellows * 5)),
    tendency: yellows >= 4.5 ? "Rigoroso" : yellows >= 3 ? "Equilibrado" : "Permissivo",
    team: {
      home: { expectedCards: +(yellows * 0.5).toFixed(1), expectedCorners: season.home.corners },
      away: { expectedCards: +(yellows * 0.55).toFixed(1), expectedCorners: season.away.corners },
    },
    cardRisk: [
      { name: `Volante do ${match.home.name}`.slice(0, 26), pct: 62 },
      { name: `Lateral do ${match.away.name}`.slice(0, 26), pct: 55 },
      { name: `Zagueiro do ${match.home.name}`.slice(0, 26), pct: 48 },
    ],
  };

  const homeContext = `O ${match.home.name} chega para o confronto com aproveitamento de ${Math.round((h.w / 5) * 100)}% nos últimos 5 jogos. ` +
    `Soma ${season.home.wins} vitórias na temporada e busca firmar posição na competição. ` +
    `O elenco vem com a confiança em ${h.w >= 3 ? "alta" : "recuperação"} e tende a propor o jogo dentro de casa.`;
  const awayContext = `Já o ${match.away.name} viaja com ${a.w} vitórias nos últimos 5 e ${season.away.wins} no total da temporada. ` +
    `A equipe ${a.w >= 3 ? "vem em ótimo momento e costuma surpreender fora" : "tenta se reencontrar fora de casa"} e deve apostar em transições rápidas para neutralizar o mandante.`;

  const bestFallback = (() => {
    if (baseGoals >= 2.4) {
      return {
        market: "Total de gols",
        pick: "Mais de 2.5 gols",
        reason: `Média combinada de ${baseGoals.toFixed(1)} gols/jogo e os dois ataques têm chegado com facilidade.`,
        pct: Math.min(82, Math.round(baseGoals * 22)),
      };
    }
    return {
      market: "Resultado da partida",
      pick: h.w >= a.w ? `Vitória do ${match.home.name}` : `Vitória do ${match.away.name}`,
      reason: `Diferença de forma recente (${h.w}V x ${a.w}V) favorece o lado escolhido como aposta principal.`,
      pct: 68,
    };
  })();

  return { homeContext, awayContext, season, h2h, players, streaks, referee, bestFallback };
}
