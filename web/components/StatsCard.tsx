type Tone = "teal" | "amber" | "sky" | "rose";

export function StatsCard({
  title,
  value,
  delta,
  tone,
}: {
  title: string;
  value: string;
  delta: string;
  tone: Tone;
}) {
  const palette: Record<Tone, { bg: string; accent: string }> = {
    teal: { bg: "#e6fffb", accent: "#0f766e" },
    amber: { bg: "#fff7ed", accent: "#b45309" },
    sky: { bg: "#eff6ff", accent: "#2563eb" },
    rose: { bg: "#fff1f2", accent: "#e11d48" },
  };

  const colors = palette[tone];

  return (
    <div
      style={{
        background: colors.bg,
        border: "1px solid #e5e7eb",
        borderRadius: 18,
        padding: 20,
        minHeight: 120,
      }}
    >
      <div style={{ fontSize: 13, color: "#4b5563", marginBottom: 12 }}>
        {title}
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: "#111827",
          marginBottom: 8,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: colors.accent }}>
        {delta}
      </div>
    </div>
  );
}
