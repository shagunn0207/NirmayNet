const referralQueue: any[] = [];

const urgencyColors: Record<string, string> = {
  Critical: "#dc2626",
  High: "#f59e0b",
  Routine: "#10b981",
};

export function ReferralCard() {
  return (
    <section
      style={{
        background: "#ffffff",
        borderRadius: 20,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "18px 20px", borderBottom: "1px solid #e5e7eb" }}>
        <div
          style={{
            fontSize: 12,
            color: "#6b7280",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Referral dispatch
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>
          Active referrals
        </div>
      </div>

      <div style={{ display: "grid", gap: 12, padding: 18 }}>
        {referralQueue.map((ref) => (
          <div
            key={ref.id}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 16,
              background: "#f8fafc",
              padding: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 17, color: "#111827" }}>
                {ref.patient}
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  borderRadius: 999,
                  padding: "5px 8px",
                  background: "#fef2f2",
                  color: urgencyColors[ref.urgency],
                }}
              >
                {ref.urgency}
              </span>
            </div>
            <div style={{ fontSize: 13, color: "#475569", marginBottom: 8 }}>
              {ref.facility}
            </div>
            <div style={{ fontSize: 13, color: "#334155", marginBottom: 12 }}>
              {ref.reason}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                color: "#334155",
              }}
            >
              <span>ETA: {ref.eta}</span>
              <span style={{ fontWeight: 700, color: "#0f172a" }}>
                {ref.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
