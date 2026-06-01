import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { PaywallBlur } from "@/components/PaywallBlur";
import { lowOddsPicks } from "@/lib/mock-data";

export const Route = createFileRoute("/odds-baixas")({
  head: () => ({
    meta: [
      { title: "Odds baixas — Palpites da I.A" },
      { name: "description", content: "Seleção da IA com odds entre 1.10 e 1.50 para consistência e alavancagem." },
    ],
  }),
  component: LowOddsPage,
});

function LowOddsPage() {
  const sorted = [...lowOddsPicks].sort((a, b) => (a.confidence === "ALTA" ? -1 : 1));
  return (
    <div className="min-h-screen">
      <Header />
      <section className="field-gradient border-b border-border">
        <div className="container-app py-10">
          <div className="inline-flex items-center gap-2 bg-primary/15 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" /> Odds baixas
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl mb-3">Odds menores, mais chance de acertar.</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Ideal para quem prefere consistência ou trabalha com estratégia de alavancagem.
          </p>
        </div>
      </section>

      <main className="container-app py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {sorted.map((p, i) => (
            <Link
              key={i}
              to="/partida/$id"
              params={{ id: p.matchId }}
              className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-colors"
            >
              <div className="text-xs text-muted-foreground mb-1">{p.label}</div>
              <div className="font-display font-bold mb-3">{p.market}</div>
              <div className="flex items-center justify-between">
                <ConfidenceBadge level={p.confidence} compact />
                <span className="font-display font-extrabold text-2xl text-primary">{p.odd.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
