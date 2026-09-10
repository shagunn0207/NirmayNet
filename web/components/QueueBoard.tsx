const queuePatients: any[] = [];

const triageColors: Record<string, string> = {
  Emergency: "#ef4444",
  Urgent: "#f59e0b",
  Routine: "#10b981",
};

export function QueueBoard() {
  return (
    <section
      style={{
        background: "#ffffff",
        borderRadius: 20,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 20px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              color: "#6b7280",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Queue
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>
            Current patient flow
          </div>
        </div>
        <button
          style={{
            background: "#ecfeff",
            color: "#115e59",
            border: "none",
            borderRadius: 999,
            padding: "8px 12px",
            fontWeight: 700,
          }}
        >
          Refresh
        </button>
      </div>

      <div style={{ padding: 18 }}>
        <div style={{ display: "grid", gap: 12 }}>
          {queuePatients.map((patient) => (
            <div
              key={patient.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1.3fr 0.9fr 0.9fr 1fr",
                gap: 12,
                alignItems: "center",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                padding: 14,
              }}
            >
              <div>
                <div
                  style={{ fontWeight: 800, color: "#111827", fontSize: 17 }}
                >
                  {patient.name}
                </div>
                <div style={{ fontSize: 13, color: "#475569" }}>
                  {patient.id} · {patient.age} yrs · {patient.sex} ·{" "}
                  {patient.village}
                </div>
              </div>
              <div>
                <div
                  style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}
                >
                  Token
                </div>
                <div style={{ fontWeight: 700, color: "#0f172a" }}>
                  {patient.token}
                </div>
              </div>
              <div>
                <div
                  style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}
                >
                  Triage
                </div>
                <span
                  style={{
                    display: "inline-block",
                    background: "#fef2f2",
                    color: triageColors[patient.triage],
                    borderRadius: 999,
                    padding: "6px 10px",
                    fontWeight: 800,
                    fontSize: 12,
                  }}
                >
                  {patient.triage}
                </span>
              </div>
              <div>
                <div
                  style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}
                >
                  Status
                </div>
                <div style={{ fontWeight: 700, color: "#0f172a" }}>
                  {patient.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
