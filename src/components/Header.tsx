import { Link } from "@tanstack/react-router";
import { Brain, Menu, Sparkles, Trophy, Target, Zap } from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Partidas", icon: Trophy },
  { to: "/zebras", label: "Zebras", icon: Sparkles },
  { to: "/bingos", label: "Bingos", icon: Target },
  { to: "/odds-baixas", label: "Odds Baixas", icon: Zap },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="container-app flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-lg">
            <span className="w-9 h-9 rounded-xl bg-primary text-primary-foreground grid place-items-center">
              <Brain className="w-5 h-5" />
            </span>
            <span>
              Palpites <span className="text-primary">da I.A</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((i) => (
              <Link
                key={i.to}
                to={i.to}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                activeProps={{ className: "px-4 py-2 rounded-lg text-sm font-semibold text-foreground bg-accent" }}
              >
                {i.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Entrar
            </Link>
            <Link
              to="/planos"
              className="px-4 py-2 rounded-lg text-sm font-bold bg-gold text-gold-foreground hover:opacity-90 transition-opacity"
            >
              Assinar
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="container-app py-3 flex flex-col gap-1">
              <Link to="/login" onClick={() => setOpen(false)} className="px-4 py-3 rounded-lg hover:bg-accent">
                Entrar
              </Link>
              <Link
                to="/planos"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg bg-gold text-gold-foreground font-bold text-center"
              >
                Assinar Premium
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border">
        <div className="grid grid-cols-4">
          {navItems.map((i) => {
            const Icon = i.icon;
            return (
              <Link
                key={i.to}
                to={i.to}
                className="flex flex-col items-center gap-1 py-2.5 text-xs text-muted-foreground"
                activeProps={{ className: "flex flex-col items-center gap-1 py-2.5 text-xs text-primary font-semibold" }}
              >
                <Icon className="w-5 h-5" />
                {i.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
