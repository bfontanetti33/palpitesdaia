import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { PaywallBlur } from "@/components/PaywallBlur";
import { matches } from "@/lib/mock-data";

export const Route = createFileRoute("/zebras")({
  head: () => ({
    meta: [
      { title: "Zebras do dia — Palpites da I.A" },
      { name: "description", content: "Partidas onde o azarão tem chance real de surpreender, identificadas pela IA." },
    ],
  }),
  component: ZebrasPage,
});

function ZebrasPage() {
  const zebras = matches.filter((m) => m.isUnderdogPick);
  return (
    <div className="min-h-screen">
      <Header />
      <section className="field-gradient border-b border-border">
        <div className="container-app py-10">
          <div className="inline-flex items-center gap-2 bg-gold/15 text-gold px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Zebras
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl mb-3">Onde os dados contradizem o favoritismo.</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            A IA identifica jogos onde o azarão tem chance real de surpreender. Surpresas com embasamento.
          </p>
        </div>
      </section>

      <main className="container-app py-8">
        <div className="grid md:grid-cols-2 gap-5">
          {zebras.map((m) => {
            const rec = m.allMarkets[0];
            return (
              <article key={m.id} className="bg-card border border-gold/30 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-3 right-3 text-2xl">🦓</div>
                <div className="text-xs text-muted-foreground mb-2">{m.leagueEmoji} {m.leagueShort}</div>
                <div className="flex items-center gap-3 mb-3">
                  <img src={m.home.logo} alt="" className="w-10 h-10 rounded-full" />
                  <span className="font-display font-bold">{m.home.name}</span>
                  <span className="text-muted-foreground text-sm">vs</span>
                  <img src={m.away.logo} alt="" className="w-10 h-10 rounded-full" />
                  <span className="font-display font-bold">{m.away.name}</span>
                </div>
                <div className="bg-secondary/60 rounded-xl p-3 mb-3">
                  <div className="text-xs text-muted-foreground">{rec.market}</div>
                  <div className="font-display font-bold">{rec.pick}</div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{m.underdogNote}</p>
                <div className="flex items-center justify-between">
                  <ConfidenceBadge level={rec.confidence} />
                  {rec.odd && (
                    <span className="text-sm font-bold text-gold">Odd {rec.odd.toFixed(2)}</span>
                  )}
                </div>
                <Link
                  to="/partida/$id"
                  params={{ id: m.id }}
                  className="mt-3 block text-center text-sm font-semibold text-primary hover:underline"
                >
                  Ver análise completa →
                </Link>
              </article>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
