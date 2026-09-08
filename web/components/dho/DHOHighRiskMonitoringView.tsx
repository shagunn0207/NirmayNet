"use client";

import React from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { ShieldAlert, Heart, Baby, Activity, AlertCircle, CheckCircle2, MapPin } from "lucide-react";

export const DHOHighRiskMonitoringView: React.FC = () => {
  const { followups, patients } = useHealthcare();

  const maternalHighRisk = patients.filter((p) => p.riskCategory === "Maternal");
  const pediatricHighRisk = patients.filter((p) => p.riskCategory === "Child");
  const ncdHighRisk = patients.filter(
    (p) => p.riskCategory === "Diabetes" || p.riskCategory === "Hypertension"
  );

  const missedFollowups = followups.filter((f) => f.status === "Missed");
  const upcomingFollowups = followups.filter((f) => f.status === "Upcoming");

  return (
    <div className="flex flex-col gap-6">
      {/* High-Risk Cohort Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-rose-900 tracking-wider">
              Maternal High-Risk ANC Cohort
            </span>
            <Heart className="w-5 h-5 text-rose-600" />
          </div>
          <span className="text-3xl font-black text-rose-950">{maternalHighRisk.length}</span>
          <p className="text-xs text-rose-800 mt-1 leading-relaxed">
            Severe gestational anemia &lt;7 g/dL, pre-eclampsia, multi-gravida high risk.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
              SAM Pediatric Under-5 Watch
            </span>
            <Baby className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-3xl font-black text-amber-950">{pediatricHighRisk.length}</span>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            Severe acute malnutrition (SAM) and recurring pediatric infection surveillance.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
              NCD Chronic Care Cohort
            </span>
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-3xl font-black text-blue-950">{ncdHighRisk.length}</span>
          <p className="text-xs text-blue-800 mt-1 leading-relaxed">
            Uncontrolled diabetes mellitus and Stage-2 essential hypertension cases.
          </p>
        </div>
      </div>

      {/* Missed Follow-ups Escalation Board */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900">
                Missed & Overdue ASHA Home Visits Escalation Board
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-100 text-red-800">
                {missedFollowups.length} Overdue
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Patients requiring immediate field contact to prevent dropout or mortality
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {missedFollowups.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No missed follow-ups currently recorded.
            </p>
          ) : (
            missedFollowups.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-red-200 bg-red-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">
                      {item.patientName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10px]">
                      {item.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-black text-[10px]">
                      OVERDUE ({item.dueDate})
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium mt-1">{item.reason}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Assigned Field ASHA: <strong>{item.ashaAssigned}</strong> · Contact: {item.phone}
                    {item.notes ? ` · Note: ${item.notes}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${item.phone}`}
                    className="px-3 py-1.5 bg-white border border-red-300 text-red-800 hover:bg-red-50 font-bold rounded-lg transition-colors"
                  >
                    Contact Patient
                  </a>
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg transition-colors"
                  >
                    Dispatch ANM Supervisor
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
