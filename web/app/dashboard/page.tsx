import { AlertBanner } from "@/components/AlertBanner";
import { QueueBoard } from "@/components/QueueBoard";
import { ReferralCard } from "@/components/ReferralCard";
import { StatsCard } from "@/components/StatsCard";
import { PatientTimeline } from "@/components/PatientTimeline";
import { DispatchStatus } from "@/components/DispatchStatus";
import { metrics } from "@/lib/mockData";

export default function DashboardPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        color: "#111827",
        padding: "32px 24px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <header style={{ marginBottom: 28 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: "#0f766e",
              textTransform: "uppercase",
            }}
          >
            NirmayNet
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 8,
            }}
          >
            <h1 style={{ margin: 0, fontSize: 38, lineHeight: 1.1 }}>
              Rural health operations dashboard
            </h1>
            <button
              style={{
                background: "#0f766e",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "12px 18px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Dispatch queue
            </button>
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {metrics.map((metric) => (
            <StatsCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              delta={metric.delta}
              tone={metric.tone}
            />
          ))}
        </section>

        <AlertBanner />

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: 20,
            marginBottom: 20,
          }}
        >
          <QueueBoard />
          <DispatchStatus />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 20,
          }}
        >
          <ReferralCard />
          <PatientTimeline />
        </section>
      </div>
    </main>
  );
}
