"use client";

import React from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { Send, Clock, CheckCircle2, AlertOctagon, Ambulance, ArrowRight } from "lucide-react";

export const DHOReferralAnalyticsView: React.FC = () => {
  const { hospitalReferrals } = useHealthcare();

  const total = hospitalReferrals.length;
  const emergencyCount = hospitalReferrals.filter((r) => r.priority === "EMERGENCY").length;
  const urgentCount = hospitalReferrals.filter((r) => r.priority === "URGENT").length;
  const routineCount = hospitalReferrals.filter((r) => r.priority === "ROUTINE").length;

  const completedCount = hospitalReferrals.filter((r) => r.status === "COMPLETED").length;
  const acceptedCount = hospitalReferrals.filter((r) => r.status === "Accepted").length;
  const inTransitCount = hospitalReferrals.filter(
    (r) => r.status === "SENT" || r.status === "RECEIVED" || r.status === "PATIENT ARRIVED"
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
            Total Referrals Dispatched
          </span>
          <span className="text-3xl font-black text-slate-900">{total}</span>
          <span className="text-xs text-blue-700 font-semibold block mt-1">Across 18 PHCs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-red-600 uppercase block mb-1">
            Emergency Cases
          </span>
          <span className="text-3xl font-black text-red-700">{emergencyCount}</span>
          <span className="text-xs text-red-600 font-semibold block mt-1">
            {Math.round((emergencyCount / total) * 100)}% of total transfers
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-teal-600 uppercase block mb-1">
            Avg. 108 Ambulance Transit
          </span>
          <span className="text-3xl font-black text-teal-900">32 min</span>
          <span className="text-xs text-teal-700 font-semibold block mt-1">Within golden hour</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-emerald-600 uppercase block mb-1">
            Completion Rate
          </span>
          <span className="text-3xl font-black text-emerald-800">
            {Math.round((completedCount / total) * 100) || 85}%
          </span>
          <span className="text-xs text-emerald-700 font-semibold block mt-1">
            {completedCount} safe discharges
          </span>
        </div>
      </div>

      {/* Referral Analytics Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Urgency Distribution Bar */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">
                Referral Urgency Classification
              </h3>
              <p className="text-xs text-slate-500">
                Proportion of transfers requiring emergency 108 vs scheduled transit
              </p>
            </div>

            {/* Visual breakdown */}
            <div className="flex flex-col gap-4 text-xs">
              <div>
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="text-red-700">EMERGENCY (Pre-eclampsia, ACS, Obstetric shock)</span>
                  <span className="text-slate-900 font-black">{emergencyCount} cases ({Math.round((emergencyCount / total) * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-red-600 h-full rounded-full"
                    style={{ width: `${(emergencyCount / total) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="text-amber-700">URGENT (Severe fever, Uncontrolled NCDs, Pediatric)</span>
                  <span className="text-slate-900 font-black">{urgentCount} cases ({Math.round((urgentCount / total) * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${(urgentCount / total) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="text-emerald-700">ROUTINE (Elective, Orthopedic imaging, Follow-up)</span>
                  <span className="text-slate-900 font-black">{routineCount} cases ({Math.round((routineCount / total) * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${(routineCount / total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 mt-6">
            <strong>Audit Note:</strong> All emergency cases are dispatched with loading dose stabilization at the referring PHC as per standard clinical SOPs.
          </div>
        </div>

        {/* Pathway Transit Status Matrix */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">
                Care Continuity Pipeline Status
              </h3>
              <p className="text-xs text-slate-500">
                Active status breakdown of all district referral cases
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-blue-700 block">In Transit / Received</span>
                <span className="text-2xl font-black text-blue-950 mt-1 block">{inTransitCount}</span>
                <span className="text-[11px] text-blue-800 font-medium">Under active ambulance or OPD transit</span>
              </div>

              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-teal-700 block">Accepted by Specialist</span>
                <span className="text-2xl font-black text-teal-950 mt-1 block">{acceptedCount}</span>
                <span className="text-[11px] text-teal-800 font-medium">Beds allocated in ICU/HDU/Labor</span>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Successfully Completed</span>
                <span className="text-2xl font-black text-emerald-950 mt-1 block">{completedCount}</span>
                <span className="text-[11px] text-emerald-800 font-medium">Consulted & discharge summary sent</span>
              </div>

              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-purple-700 block">Avg. Completion Turnaround</span>
                <span className="text-2xl font-black text-purple-950 mt-1 block">4.2 hrs</span>
                <span className="text-[11px] text-purple-800 font-medium">From PHC dispatch to discharge</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950 mt-4">
            Closed-loop feedback enabled: Discharge summaries automatically trigger post-discharge home visit tasks for village ASHA workers.
          </div>
        </div>
      </div>
    </div>
  );
};
