"use client";

import React from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import {
  BarChart3,
  Building2,
  Users,
  Send,
  Clock,
  Video,
  AlertOctagon,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Pill,
  Activity,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

interface DHOOverviewViewProps {
  onNavigateTab: (tabId: string) => void;
}

export const DHOOverviewView: React.FC<DHOOverviewViewProps> = ({
  onNavigateTab,
}) => {
  const { phcMetrics, hospitalReferrals, medicines, followups } = useHealthcare();

  const totalPatientsToday = phcMetrics.reduce((sum, p) => sum + p.highRiskTracked, 0) + 342;
  const totalReferralsSent = phcMetrics.reduce((sum, p) => sum + p.referralsSent, 0);
  const avgDistrictWait = phcMetrics.length > 0
    ? Math.round(phcMetrics.reduce((sum, p) => sum + p.teleconsultationsCompleted, 0) / phcMetrics.length)
    : 0;
  const criticalPhcs = phcMetrics.filter((p) => p.status === "Critical");
  const lowStockCount = medicines.filter((m) => m.status !== "In Stock").length;
  const missedFollowups = followups.filter((f) => f.status === "Missed").length;

  const kpis = [
    {
      title: "Total Patients Served Today",
      value: totalPatientsToday.toLocaleString(),
      sub: "+12.4% vs monthly daily avg",
      icon: Users,
      color: "border-indigo-200 bg-indigo-50/50 text-indigo-950",
      accent: "text-indigo-700",
    },
    {
      title: "Active Rural PHCs",
      value: "18",
      sub: `${criticalPhcs.length} need administrative focus`,
      icon: Building2,
      color: "border-teal-200 bg-teal-50/50 text-teal-950",
      accent: "text-teal-700",
      onClick: () => onNavigateTab("phc-performance"),
    },
    {
      title: "District Referral Volume",
      value: totalReferralsSent.toString(),
      sub: "86.4% Completion Rate",
      icon: Send,
      color: "border-blue-200 bg-blue-50/50 text-blue-950",
      accent: "text-blue-700",
      onClick: () => onNavigateTab("referral-analytics"),
    },
    {
      title: "Avg District Wait Time",
      value: `${avgDistrictWait} min`,
      sub: "Target: < 25 min",
      icon: Clock,
      color: "border-sky-200 bg-sky-50/50 text-sky-950",
      accent: "text-sky-700",
    },
    {
      title: "Teleconsultations Done",
      value: "94",
      sub: "Across 4 tribal blocks",
      icon: Video,
      color: "border-purple-200 bg-purple-50/50 text-purple-950",
      accent: "text-purple-700",
    },
    {
      title: "Emergency Escalations",
      value: hospitalReferrals.filter((r) => r.priority === "EMERGENCY").length.toString(),
      sub: "108 Transit Coordinated",
      icon: AlertOctagon,
      color: "border-red-200 bg-red-50 text-red-950",
      accent: "text-red-700 font-extrabold",
      onClick: () => onNavigateTab("referral-analytics"),
    },
    {
      title: "Facilities with Drug Stockout",
      value: criticalPhcs.length.toString(),
      sub: `${lowStockCount} EDL items low`,
      icon: Pill,
      color: "border-amber-200 bg-amber-50 text-amber-950",
      accent: "text-amber-800 font-bold",
      onClick: () => onNavigateTab("medicine-monitoring"),
    },
    {
      title: "Follow-up Adherence",
      value: "82.6%",
      sub: `${missedFollowups} overdue visits flagged`,
      icon: Calendar,
      color: "border-emerald-200 bg-emerald-50/50 text-emerald-950",
      accent: "text-emerald-700",
      onClick: () => onNavigateTab("high-risk-monitoring"),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Executive Alert Bar */}
      {criticalPhcs.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                DHO Executive Attention Notice
              </span>
              <p className="text-xs text-amber-950 mt-1 leading-relaxed">
                <strong>PHC Khapar</strong> and <strong>PHC Dhadgaon</strong> flagged for stockouts (Metformin, Anti-Snake Venom) and diagnostic equipment downtime (ECG calibrating).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateTab("medicine-monitoring")}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Approve Drug Indents
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab("phc-performance")}
              className="px-4 py-2 bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 rounded-xl text-xs font-bold transition-colors"
            >
              Inspect Facilities
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-8 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={kpi.onClick}
              className={`border rounded-2xl p-3.5 sm:p-4 transition-all ${kpi.color} ${
                kpi.onClick ? "cursor-pointer hover:shadow-md hover:scale-[1.01]" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold truncate opacity-85">{kpi.title}</span>
                <Icon className="w-4 h-4 shrink-0 opacity-75" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black">{kpi.value}</span>
                <span className={`text-[11px] truncate ${kpi.accent}`}>{kpi.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two-Column Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: PHC Network Status */}
        <div className="xl:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                PHC-to-District Referral Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Referral volume and completion rate across rural Primary Health Centres
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
              Live Transit Network
            </span>
          </div>

          {/* Bar Chart Visualization (SVG) */}
          <div className="flex flex-col gap-3 py-2">
            {phcMetrics.map((phc) => {
              const maxReferrals = 25;
              const barWidth = Math.round((phc.referralsSent / maxReferrals) * 100);
              return (
                <div key={phc.id} className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-800">{phc.name} ({phc.block})</span>
                    <span className="text-slate-600">
                      {phc.referralsSent} referrals · {phc.referralCompletionRate}% completed
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                    <div
                      className="bg-blue-700 h-full rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-auto flex items-center justify-between text-xs text-slate-500">
            <span>Average Referral Transit Time: <strong>34 mins</strong></span>
            <button
              type="button"
              onClick={() => onNavigateTab("referral-analytics")}
              className="text-blue-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>Detailed Referral Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Key Alerts */}
        <div className="xl:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4">
          <div>
            <div className="pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Quality & Healthcare Access Index
              </h3>
              <p className="text-xs text-slate-500">District performance against State NHM benchmarks</p>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>Medicine Stock Availability (District EDL)</span>
                  <span>79.0%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: "79%" }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">State Benchmark: &gt; 80%</span>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>Diagnostic Equipment Uptime</span>
                  <span>65.6%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "65.6%" }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">State Benchmark: &gt; 85%</span>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>High-Risk Maternal Follow-up Completion</span>
                  <span>88.0%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-teal-600 h-full rounded-full" style={{ width: "88%" }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Target: &gt; 90%</span>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>108 Ambulance Dispatch Response Time (&lt;30m)</span>
                  <span>92.3%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: "92.3%" }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Emergency golden hour compliance</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-slate-800">
                District Accreditation Rank: 4th in Nashik Division
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
