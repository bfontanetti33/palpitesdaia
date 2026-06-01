import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import type { Match } from "@/lib/mock-data";
import { ConfidenceBadge } from "./ConfidenceBadge";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MatchCard({ match }: { match: Match }) {
  const previewMarkets = match.topMarkets;

  return (
    <article className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-colors">
      <div className="px-5 pt-4 pb-3 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 text-muted-foreground font-medium">
          <span>{match.leagueEmoji}</span>
          {match.leagueShort}
        </span>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          {formatTime(match.date)}
        </span>
      </div>

      <div className="px-5 pb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <img src={match.home.logo} alt={match.home.name} className="w-9 h-9 rounded-full" />
          <span className="font-display font-bold truncate">{match.home.name}</span>
        </div>
        <span className="text-muted-foreground font-bold text-sm">VS</span>
        <div className="flex items-center gap-2 justify-end min-w-0">
          <span className="font-display font-bold truncate text-right">{match.away.name}</span>
          <img src={match.away.logo} alt={match.away.name} className="w-9 h-9 rounded-full" />
        </div>
      </div>

      <div className="px-5 pb-3 flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="w-3.5 h-3.5" />
        <span className="truncate">{match.venue}</span>
      </div>

      <div className="px-5 pb-5">
        <div className="space-y-2.5">
          {previewMarkets.map((m) => (
            <div key={m.market} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-secondary/60">
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">{m.market}</div>
                <div className="font-semibold text-sm truncate">{m.pick}</div>
              </div>
              <ConfidenceBadge level={m.confidence} compact />
            </div>
          ))}
        </div>
      </div>

      <Link
        to="/partida/$id"
        params={{ id: match.id }}
        className="flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
      >
        Ver análise completa
        <ArrowRight className="w-4 h-4" />
      </Link>
    </article>
  );
}
