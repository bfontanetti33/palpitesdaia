import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Target, Check, AlertTriangle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConfidenceBar } from "@/components/ConfidenceBadge";
import { PaywallBlur } from "@/components/PaywallBlur";
import { bingoOfTheDay } from "@/lib/mock-data";

export const Route = createFileRoute("/bingos")({
  head: () => ({
    meta: [
      { title: "Bingo do dia — Palpites da I.A" },
      { name: "description", content: "A IA monta uma aposta combinada do dia com odd alta e chance real de acerto." },
    ],
  }),
  component: BingosPage,
});

function BingosPage() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const txt = bingoOfTheDay.selections.map((s) => `${s.label}: ${s.market} (${s.odd})`).join("\n");
    navigator.clipboard?.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <section className="field-gradient border-b border-border">
        <div className="container-app py-10">
          <div className="inline-flex items-center gap-2 bg-primary/15 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Target className="w-3.5 h-3.5" /> Aposta do dia
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl mb-3">Bingo do dia</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            A IA combinou os melhores palpites do dia para gerar uma aposta com odd alta e percentualmente possível.
          </p>
        </div>
      </section>

      <main className="container-app py-8">
        <PaywallBlur>
          <div className="max-w-2xl mx-auto bg-card border border-gold/30 rounded-3xl p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Odd total</div>
              <div className="font-display font-extrabold text-6xl md:text-7xl text-gold mt-1">
                {bingoOfTheDay.totalOdd.toFixed(2)}
              </div>
              <div className="mt-4 max-w-xs mx-auto">
                <div className="text-xs text-muted-foreground mb-1.5 flex justify-between">
                  <span>Confiança</span>
                  <span className="font-bold text-foreground">{bingoOfTheDay.confidence}%</span>
                </div>
                <ConfidenceBar percent={bingoOfTheDay.confidence} />
              </div>
            </div>

            <div className="space-y-3">
              {bingoOfTheDay.selections.map((s, i) => (
                <div key={i} className="bg-secondary/60 rounded-xl p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="font-semibold truncate">{s.market}</div>
                  </div>
                  <span className="font-display font-bold text-gold">{s.odd.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <button
              onClick={copy}
              className="mt-6 w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:opacity-90"
            >
              {copied ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar palpites</>}
            </button>

            <div className="mt-5 flex items-start gap-2 text-xs text-muted-foreground bg-secondary/40 p-3 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
              <span>Quanto maior a odd, maior o risco. Aposte com responsabilidade.</span>
            </div>
          </div>
        </PaywallBlur>
      </main>

      <Footer />
    </div>
  );
}
