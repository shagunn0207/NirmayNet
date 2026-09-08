"use client";

import React from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge } from "@/components/common/Badge";
import {
  Users,
  Clock,
  AlertOctagon,
  Send,
  Calendar,
  FlaskConical,
  Stethoscope,
  ChevronRight,
  Ambulance,
  HeartPulse,
  Pill,
} from "lucide-react";

interface PHCDashboardViewProps {
  onNavigateTab: (tabId: string) => void;
  onOpenConsultation: (patientId: string) => void;
  onOpenReferralModal: (patientId?: string) => void;
}

export const PHCDashboardView: React.FC<PHCDashboardViewProps> = ({
  onNavigateTab,
  onOpenConsultation,
  onOpenReferralModal,
}) => {
  const {
    patients,
    ashaReferrals,
    hospitalReferrals,
    medicines,
    diagnosticOrders,
    followups,
  } = useHealthcare();

  const waitingPatients = patients.filter((p) => p.currentStatus === "Waiting");
  const emergencyCases = patients.filter(
    (p) => p.triagePriority === "EMERGENCY" && p.currentStatus !== "Completed"
  );
  const pendingAsha = ashaReferrals.filter((r) => r.status === "Pending Review");
  const pendingHospitalReferrals = hospitalReferrals.filter(
    (r) => r.status !== "COMPLETED"
  );
  const pendingLabTests = diagnosticOrders.filter((d) => d.status === "Pending");
  const upcomingFollowups = followups.filter((f) => f.status === "Upcoming" || f.status === "Missed");
  const lowStockCount = medicines.filter((m) => m.status !== "In Stock").length;

  const kpis = [
    {
      title: "OPD Patients Today",
      value: "184",
      sub: "+14% vs avg",
      icon: Users,
      color: "border-teal-200 bg-teal-50/50 text-teal-900",
      accent: "text-teal-700",
    },
    {
      title: "Patients in Queue",
      value: waitingPatients.length.toString(),
      sub: "Avg wait: 18 min",
      icon: Clock,
      color: "border-sky-200 bg-sky-50/50 text-sky-900",
      accent: "text-sky-700",
      onClick: () => onNavigateTab("queue"),
    },
    {
      title: "Urgent / Emergency",
      value: emergencyCases.length.toString(),
      sub: "Immediate triage",
      icon: AlertOctagon,
      color: "border-red-200 bg-red-50 text-red-900",
      accent: "text-red-600 font-extrabold",
      urgent: emergencyCases.length > 0,
      onClick: () => onNavigateTab("queue"),
    },
    {
      title: "ASHA Inbound Alerts",
      value: pendingAsha.length.toString(),
      sub: "Field referrals pending",
      icon: HeartPulse,
      color: "border-amber-200 bg-amber-50 text-amber-900",
      accent: "text-amber-700 font-bold",
      onClick: () => onNavigateTab("asha-inbox"),
    },
    {
      title: "Active DH Referrals",
      value: pendingHospitalReferrals.length.toString(),
      sub: "In transit / admitted",
      icon: Send,
      color: "border-indigo-200 bg-indigo-50/50 text-indigo-900",
      accent: "text-indigo-700",
      onClick: () => onNavigateTab("referrals"),
    },
    {
      title: "Pending Diagnostics",
      value: pendingLabTests.length.toString(),
      sub: "PHC laboratory tests",
      icon: FlaskConical,
      color: "border-purple-200 bg-purple-50/50 text-purple-900",
      accent: "text-purple-700",
      onClick: () => onNavigateTab("diagnostics"),
    },
    {
      title: "Follow-ups Due",
      value: upcomingFollowups.length.toString(),
      sub: "Maternal & NCD cohort",
      icon: Calendar,
      color: "border-emerald-200 bg-emerald-50/50 text-emerald-900",
      accent: "text-emerald-700",
      onClick: () => onNavigateTab("followups"),
    },
    {
      title: "Medicines Low/Out",
      value: lowStockCount.toString(),
      sub: "Supply indent needed",
      icon: Pill,
      color: "border-orange-200 bg-orange-50/50 text-orange-900",
      accent: "text-orange-700",
      onClick: () => onNavigateTab("inventory"),
    },
  ];

  const criticalCase = emergencyCases[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Critical Emergency Banner */}
      {criticalCase && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse-subtle">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded">
                  Critical Emergency Case
                </span>
                <span className="text-sm font-bold text-red-950">
                  {criticalCase.name} ({criticalCase.age}y, {criticalCase.sex}) · {criticalCase.village}
                </span>
                <span className="text-xs font-semibold text-red-800 bg-red-100 px-2 py-0.5 rounded">
                  Token: {criticalCase.token}
                </span>
              </div>
              <p className="text-xs text-red-900 mt-1 font-medium leading-relaxed">
                <strong>Symptoms:</strong> {criticalCase.symptoms.join(", ")} |{" "}
                <strong>Vitals:</strong> BP {criticalCase.vitals.bp} mmHg · Pulse {criticalCase.vitals.pulse} bpm · SpO2 {criticalCase.vitals.spo2}% · Hb {criticalCase.vitals.hb || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={() => onOpenConsultation(criticalCase.id)}
              className="flex-1 sm:flex-none px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Attend Case</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenReferralModal(criticalCase.id)}
              className="flex-1 sm:flex-none px-4 py-2 bg-white border border-red-300 text-red-800 hover:bg-red-100 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Ambulance className="w-4 h-4 text-red-600" />
              <span>108 Referral</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
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

      {/* Two-Column Quick Views */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patient Queue Preview */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Current OPD Queue</h3>
              <p className="text-xs text-slate-500">Patients waiting in OPD registration</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("queue")}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>View Full Queue ({waitingPatients.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {waitingPatients.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/70 transition-all gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-800 font-extrabold text-sm flex items-center justify-center shrink-0 border border-teal-200">
                    {p.token || "OPD"}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {p.name}
                      </span>
                      <UrgencyBadge priority={p.triagePriority} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {p.age}y · {p.sex} · {p.village} — {p.visitReason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                    Wait: {p.waitTimeMinutes}m
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenConsultation(p.id)}
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Consult
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: ASHA Field Referrals & Rapid Transfer */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* ASHA Inbox Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">ASHA Referral Inbox</h3>
                <p className="text-xs text-slate-500">Transfers sent by village health workers</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab("asha-inbox")}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <span>All ({pendingAsha.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {pendingAsha.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No pending ASHA referrals</p>
              ) : (
                pendingAsha.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {ref.patientName} ({ref.age}y, {ref.sex})
                      </span>
                      <UrgencyBadge priority={ref.priority} size="sm" />
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      <strong>ASHA:</strong> {ref.ashaName} ({ref.subCentre}) — {ref.referralReason}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-amber-100 text-[11px] text-slate-500">
                      <span>BP: {ref.vitals.bp} · SpO2: {ref.vitals.spo2}%</span>
                      <button
                        type="button"
                        onClick={() => onNavigateTab("asha-inbox")}
                        className="text-teal-700 font-bold hover:underline"
                      >
                        Review & Accept →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-gradient-to-br from-teal-800 to-slate-900 text-white rounded-2xl p-5 shadow-sm">
            <h4 className="text-sm font-black tracking-wide uppercase text-teal-300 mb-1">
              Quick Operations
            </h4>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Fast actions for patient dispatch, emergency referral to District Hospital, and supply indents.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onOpenReferralModal()}
                className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-left transition-colors"
              >
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Ambulance className="w-4 h-4 text-amber-300" />
                  <span>Refer to DH</span>
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5">108 Emergency dispatch</div>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab("inventory")}
                className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-left transition-colors"
              >
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-emerald-300" />
                  <span>Drug Indent</span>
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5">Request low stock</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
