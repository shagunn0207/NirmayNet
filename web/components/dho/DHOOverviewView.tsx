"use client";

import React from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import {
  BarChart3,
  Building2,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Search,
} from "lucide-react";

interface DHOOverviewViewProps {
  onNavigateTab: (tabId: string) => void;
}

export const DHOOverviewView: React.FC<DHOOverviewViewProps> = ({
  onNavigateTab,
}) => {
  const { phcMetrics } = useHealthcare();

  const totalPatientsToday = phcMetrics.reduce((sum, p) => sum + p.highRiskTracked, 0) + 342;
  const criticalPhcs = phcMetrics.filter((p) => p.status === "Critical");

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-indigo-950 rounded-3xl p-4 sm:px-6 sm:py-4 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold">District Health Office Active</h2>
            <p className="text-xs text-indigo-300">Monitoring 18 Rural Primary Health Centres</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-900 text-indigo-200 text-xs font-bold rounded-xl border border-indigo-800">
            <Users className="w-4 h-4 text-indigo-300" />
            <span>{totalPatientsToday.toLocaleString()} Patients Served Today</span>
          </div>
          <button
            onClick={() => onNavigateTab("phc-performance")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-xs font-bold rounded-xl transition-colors"
          >
            <Building2 className="w-4 h-4" />
            <span>Inspect Facilities</span>
          </button>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalPhcs.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Executive Attention Required</h3>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <span className="text-sm font-bold text-amber-950 block">
                  Critical Facility Warnings
                </span>
                <p className="text-xs text-amber-900 mt-1 font-medium leading-relaxed">
                  <strong>PHC Khapar</strong> and <strong>PHC Dhadgaon</strong> flagged for stockouts (Metformin, Anti-Snake Venom) and diagnostic equipment downtime (ECG calibrating).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto">
              <button
                type="button"
                onClick={() => onNavigateTab("medicine-monitoring")}
                className="flex-1 sm:flex-none px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Approve Drug Indents
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area: PHC Performance & Quality Index */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Column: PHC Referral Distribution */}
        <div className="flex-1 bg-white rounded-3xl overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col border border-slate-100">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                PHC-to-District Referral Distribution
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Referral volume and completion rate across rural Primary Health Centres
              </p>
            </div>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 uppercase tracking-wider">
              Live Network
            </span>
          </div>

          <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-5">
            {phcMetrics.map((phc) => {
              const maxReferrals = 25;
              const barWidth = Math.round((phc.referralsSent / maxReferrals) * 100);
              return (
                <div key={phc.id} className="flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-800 text-sm">{phc.name} <span className="text-slate-400 text-xs font-medium">({phc.block})</span></span>
                    <span className="text-slate-600">
                      {phc.referralsSent} referrals · {phc.referralCompletionRate}% completed
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden flex">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>Average Referral Transit Time: <strong>34 mins</strong></span>
            <button
              type="button"
              onClick={() => onNavigateTab("referral-analytics")}
              className="text-indigo-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>Detailed Referral Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Quality Index */}
        <div className="w-full lg:w-[400px] xl:w-[450px] bg-white rounded-3xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col border border-slate-100">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-lg font-black text-slate-900">
              Quality & Healthcare Access Index
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">District performance vs State NHM benchmarks</p>
          </div>

          <div className="p-5 flex flex-col gap-6 flex-1">
            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1.5 text-sm">
                <span>Medicine Stock Availability</span>
                <span>79.0%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "79%" }} />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">State Benchmark: &gt; 80%</span>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1.5 text-sm">
                <span>Diagnostic Equipment Uptime</span>
                <span>65.6%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "65.6%" }} />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">State Benchmark: &gt; 85%</span>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1.5 text-sm">
                <span>Maternal Follow-up Completion</span>
                <span>88.0%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: "88%" }} />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Target: &gt; 90%</span>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1.5 text-sm">
                <span>108 Ambulance Dispatch (&lt;30m)</span>
                <span>92.3%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: "92.3%" }} />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Emergency golden hour compliance</span>
            </div>
          </div>

          <div className="p-5 bg-emerald-50 rounded-b-3xl border-t border-emerald-100 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-bold text-emerald-900 text-sm">
                Accreditation Rank: 4th in Division
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
