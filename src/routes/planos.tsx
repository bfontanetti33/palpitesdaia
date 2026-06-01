import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ShieldCheck, Sparkles, Smartphone } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos Premium — Palpites da I.A" },
      { name: "description", content: "Acesso completo a todas as análises da IA. Pagamento via PIX ou cartão." },
    ],
  }),
  component: PlansPage,
});

const features = {
  free: [
    "Listagem de partidas do dia",
    "Preview dos 3 principais mercados",
    "1 análise completa por dia",
  ],
  premium: [
    "Análises completas ilimitadas",
    "Todos os 24 mercados por partida",
    "Aba Zebras (azarões da IA)",
    "Bingos do dia (combinada da IA)",
    "Odds Baixas (estratégia segura)",
    "Histórico de palpites anteriores",
    "Análise de árbitros e jogadores",
    "Suporte prioritário",
  ],
};

function PlansPage() {
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  const price = period === "monthly" ? 29.9 : 19.9;

  return (
    <div className="min-h-screen">
      <Header />

      <section className="field-gradient border-b border-border">
        <div className="container-app py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-gold/15 text-gold px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Premium
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl mb-3">Tenha o time da IA do seu lado.</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Acesso total a todas as análises, zebras, bingos e odds baixas.
          </p>

          <div className="inline-flex mt-8 p-1 bg-secondary rounded-full">
            <button
              onClick={() => setPeriod("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
                period === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setPeriod("yearly")}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${
                period === "yearly" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Anual
              <span className="bg-gold text-gold-foreground text-[10px] px-2 py-0.5 rounded-full">-33%</span>
            </button>
          </div>
        </div>
      </section>

      <main className="container-app py-10">
        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {/* Free */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <h3 className="font-display font-extrabold text-2xl">Gratuito</h3>
            <p className="text-muted-foreground text-sm mt-1">Pra começar a conhecer</p>
            <div className="mt-5 mb-6">
              <span className="font-display font-extrabold text-5xl">R$0</span>
              <span className="text-muted-foreground">/sempre</span>
            </div>
            <ul className="space-y-2.5 text-sm">
              {features.free.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button className="mt-6 w-full py-3.5 rounded-xl bg-secondary text-foreground font-bold">
              Plano atual
            </button>
          </div>

          {/* Premium */}
          <div className="bg-card border-2 border-gold rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gold text-gold-foreground text-xs font-bold px-4 py-1 rounded-bl-xl">
              MAIS POPULAR
            </div>
            <h3 className="font-display font-extrabold text-2xl text-gold">Premium</h3>
            <p className="text-muted-foreground text-sm mt-1">Acesso total à IA</p>
            <div className="mt-5 mb-1">
              <span className="font-display font-extrabold text-5xl">R${price.toFixed(2).replace(".", ",")}</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            {period === "yearly" && (
              <p className="text-xs text-gold mb-5">Cobrado anualmente — R${(price * 12).toFixed(2).replace(".", ",")}/ano</p>
            )}
            {period === "monthly" && <p className="text-xs text-muted-foreground mb-5">Sem fidelidade</p>}
            <ul className="space-y-2.5 text-sm">
              {features.premium.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button className="mt-6 w-full py-3.5 rounded-xl bg-gold text-gold-foreground font-bold hover:opacity-90 flex items-center justify-center gap-2">
              <Smartphone className="w-4 h-4" /> Assinar agora com PIX
            </button>
            <button className="mt-2 w-full py-3 rounded-xl bg-secondary text-foreground font-semibold hover:bg-accent">
              Pagar com cartão
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Pagamento 100% seguro
          </div>
          <div className="inline-flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" /> Cancele quando quiser
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
