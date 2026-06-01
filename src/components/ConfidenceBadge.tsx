import type { Confidence } from "@/lib/mock-data";

const map: Record<Confidence, { label: string; dot: string; bg: string; text: string }> = {
  ALTA: {
    label: "Alta confiança",
    dot: "bg-confidence-high",
    bg: "bg-confidence-high/15",
    text: "text-confidence-high",
  },
  "MÉDIA": {
    label: "Média confiança",
    dot: "bg-confidence-mid",
    bg: "bg-confidence-mid/15",
    text: "text-confidence-mid",
  },
  BAIXA: {
    label: "Baixa confiança",
    dot: "bg-confidence-low",
    bg: "bg-confidence-low/15",
    text: "text-muted-foreground",
  },
};

export function ConfidenceBadge({ level, compact = false }: { level: Confidence; compact?: boolean }) {
  const c = map[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${c.bg} ${c.text} rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {compact ? level : c.label}
    </span>
  );
}

export function ConfidenceBar({ percent }: { percent: number }) {
  return (
    <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-primary to-gold transition-all"
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}
