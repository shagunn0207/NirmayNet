const alerts: any[] = [];

export function AlertBanner() {
  return (
    <section
      style={{
        background: "#fff7ed",
        border: "1px solid #fed7aa",
        borderRadius: 18,
        padding: 18,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 800, color: "#7c2d12" }}>
          Alerts & summary
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            background: "#ffedd5",
            color: "#9a4d00",
            padding: "6px 10px",
            borderRadius: 999,
          }}
        >
          Live
        </span>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              background: "#fff",
              borderRadius: 12,
              padding: 12,
              border: "1px solid #fed7aa",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background:
                  alert.level === "Critical"
                    ? "#dc2626"
                    : alert.level === "Warning"
                      ? "#f59e0b"
                      : "#2563eb",
                marginTop: 6,
              }}
            />
            <div>
              <div
                style={{ fontWeight: 700, color: "#111827", marginBottom: 3 }}
              >
                {alert.title}
              </div>
              <div style={{ fontSize: 13, color: "#4b5563" }}>
                {alert.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
