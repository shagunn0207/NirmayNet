export function DispatchStatus() {
  return (
    <section
      style={{
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: 20,
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
          marginBottom: 10,
        }}
      >
        Dispatch
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        <div style={{ background: "#ecfeff", borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 12, color: "#115e59" }}>Ambulance</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#134e4a" }}>
            3
          </div>
        </div>
        <div style={{ background: "#eff6ff", borderRadius: 14, padding: 14 }}>
          <div style={{ fontSize: 12, color: "#1d4ed8" }}>Referral drivers</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#1e3a8a" }}>
            8
          </div>
        </div>
      </div>
    </section>
  );
}
