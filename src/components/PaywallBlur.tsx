import { Link } from "@tanstack/react-router";
import { Lock, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export function PaywallBlur({ children, message }: { children: ReactNode; message?: string }) {
  return (
    <div className="relative">
      <div className="blur-paywall">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center bg-gradient-to-t from-background via-background/85 to-background/40 rounded-2xl">
        <div className="w-12 h-12 rounded-full bg-gold/15 grid place-items-center">
          <Lock className="w-5 h-5 text-gold" />
        </div>
        <div>
          <p className="font-display font-bold">Conteúdo exclusivo Premium</p>
          <p className="text-sm text-muted-foreground mt-1">
            {message ?? "Desbloqueie todas as análises da IA"}
          </p>
        </div>
        <Link
          to="/planos"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-gold-foreground font-bold text-sm hover:opacity-90"
        >
          <Sparkles className="w-4 h-4" />
          Desbloquear agora
        </Link>
      </div>
    </div>
  );
}
