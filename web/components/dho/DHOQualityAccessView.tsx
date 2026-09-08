"use client";

import React from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import {
  ShieldCheck,
  Clock,
  Send,
  Users,
  Activity,
  Award,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Ambulance,
  Heart,
  Baby,
} from "lucide-react";

export const DHOQualityAccessView: React.FC = () => {
  const { phcMetrics, hospitalReferrals, followups } = useHealthcare();

  const totalPatients = phcMetrics.reduce((acc, p) => acc + p.patientsToday, 0);
  const avgWait = Math.round(
    phcMetrics.reduce((acc, p) => acc + p.avgWaitMinutes, 0) / phcMetrics.length
  );
  const completedFollowups = followups.filter((f) => f.status === "Completed").length;
  const followUpRate = Math.round((completedFollowups / followups.length) * 100) || 82;

  const emergencyReferrals = hospitalReferrals.filter((r) => r.priority === "EMERGENCY");
  const completedEmergency = emergencyReferrals.filter((r) => r.status === "COMPLETED");

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm border border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
            <Award className="w-7 h-7 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-indigo-800 text-indigo-200 text-[10px] font-black uppercase tracking-wider">
                NHM BENCHMARKS
              </span>
              <span className="text-indigo-200 text-xs font-semibold">Government of Maharashtra Public Health</span>
            </div>
            <h2 className="text-xl font-black mt-0.5">
              District Healthcare Quality & Access Scorecard
            </h2>
            <p className="text-xs text-indigo-200 mt-0.5">
              Continuity of care indices, clinical response times, and facility service level agreements (SLAs)
            </p>
          </div>
        </div>

        <div className="px-4 py-2 bg-indigo-800/60 rounded-xl border border-indigo-600/30 text-right">
          <span className="text-[10px] uppercase font-bold text-indigo-300 block">Quality Accreditation</span>
          <span className="text-sm font-black text-white">4th in Nashik Division</span>
        </div>
      </div>

      {/* Quality Indicator Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
            Avg OPD Wait Time
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{avgWait}m</span>
            <span className="text-xs text-emerald-700 font-bold">&lt; 30m Target</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Across 18 rural PHCs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
            Golden-Hour Compliance
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-800">92.4%</span>
            <span className="text-xs text-teal-700 font-bold">108 ALS</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">&lt; 30m response time</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
            Follow-Up Completion
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-800">{followUpRate}%</span>
            <span className="text-xs text-indigo-700 font-bold">Post-Discharge</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">ASHA home verification</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
            District Referral Loop
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-800">86.2%</span>
            <span className="text-xs text-purple-700 font-bold">Resolved</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">Full counter-referrals</span>
        </div>
      </div>

      {/* Visual Analytics & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: PHC Wait Time & Access Comparison */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                PHC Patient Flow & Waiting Time Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Wait times compared against state target threshold of &le;30 mins
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Benchmark: &le;30m
            </span>
          </div>

          <div className="flex flex-col gap-3 py-1">
            {phcMetrics.map((phc) => {
              const maxWait = 45;
              const barPercent = Math.min(100, Math.round((phc.avgWaitMinutes / maxWait) * 100));
              const isOver = phc.avgWaitMinutes > 30;

              return (
                <div key={phc.id} className="text-xs flex flex-col gap-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-800">{phc.name} ({phc.block})</span>
                    <span className={isOver ? "text-red-700 font-black" : "text-emerald-700"}>
                      {phc.avgWaitMinutes} mins {isOver ? "· Above Target" : "· Optimal"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOver ? "bg-red-600" : "bg-teal-600"
                      }`}
                      style={{ width: `${barPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Quality Indices */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between gap-4">
          <div>
            <div className="pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Service Level Agreements (SLA) Uptime
              </h3>
              <p className="text-xs text-slate-500">Key performance indicators tracked across the district</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>Maternal ANC Registration &lt;12 Weeks</span>
                  <span>94.2%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-600 h-full rounded-full" style={{ width: "94.2%" }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">State Target: &gt;90%</span>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>Essential Drugs Buffer Stock Retention</span>
                  <span>74.0%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "74%" }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Alert: Metformin and ASV shortage</span>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>NRC Therapeutic Nutritional Recovery</span>
                  <span>88.5%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-teal-600 h-full rounded-full" style={{ width: "88.5%" }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Z-score improvement tracking</span>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>Biomedical Equipment SLA Resolution (&lt;72h)</span>
                  <span>68.0%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: "68%" }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Target: &gt;85% repair within SLA</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-slate-800">
                District Health Action Plan (DHAP) Approved
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
