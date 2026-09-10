const patientTimeline: any[] = [];

const typeColors: Record<string, string> = {
  consultation: "#0ea5e9",
  triage: "#8b5cf6",
  referral: "#f59e0b",
  followup: "#10b981",
};

export function PatientTimeline() {
  return (
    <section
      style={{
        background: "#ffffff",
        borderRadius: 20,
        border: "1px solid #e5e7eb",
        padding: 20,
      }}
    >
      <div
        style={{
          fontSize: 12,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#6b7280",
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        Case pathway
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: "#111827",
          marginBottom: 16,
        }}
      >
        Recent care journey
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {patientTimeline.map((item) => (
          <div
            key={item.id}
            style={{
              display: "grid",
              gridTemplateColumns: "70px 1fr",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <div style={{ fontWeight: 700, color: "#334155", paddingTop: 4 }}>
              {item.time}
            </div>
            <div
              style={{
                borderLeft: "2px solid #dbeafe",
                paddingLeft: 16,
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: -7,
                  top: 4,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: typeColors[item.type],
                  display: "inline-block",
                }}
              />
              <div
                style={{ fontWeight: 800, color: "#111827", marginBottom: 4 }}
              >
                {item.title}
              </div>
              <div style={{ fontSize: 13, color: "#475569" }}>{item.note}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
