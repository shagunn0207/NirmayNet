import { AlertBanner } from "@/components/AlertBanner";
import { QueueBoard } from "@/components/QueueBoard";
import { ReferralCard } from "@/components/ReferralCard";
import { StatsCard } from "@/components/StatsCard";
import { PatientTimeline } from "@/components/PatientTimeline";
import { DispatchStatus } from "@/components/DispatchStatus";

const metrics: any[] = [];

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
              textTransform: "uppercase",
              color: "#0f766e",
            }}
          >
            NirmayNet Operations Dashboard
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
          {metrics.map((metric: any) => (
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 24,
            marginBottom: 24,
          }}
        >
          <div style={{ display: "grid", gap: 24 }}>
            <QueueBoard />
            <PatientTimeline />
          </div>
          <div style={{ display: "grid", gap: 24 }}>
            <ReferralCard />
            <DispatchStatus />
          </div>
        </div>
      </div>
    </main>
  );
}
