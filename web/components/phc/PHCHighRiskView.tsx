"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge } from "@/components/common/Badge";
import { HighRiskCategory } from "@/lib/healthcareData";
import {
  ShieldAlert,
  Heart,
  Baby,
  Activity,
  Flame,
  Stethoscope,
  Send,
  MapPin,
  FileText,
} from "lucide-react";

interface PHCHighRiskViewProps {
  onOpenConsultation: (patientId: string) => void;
  onOpenReferralModal: (patientId: string) => void;
}

export const PHCHighRiskView: React.FC<PHCHighRiskViewProps> = ({
  onOpenConsultation,
  onOpenReferralModal,
}) => {
  const { patients } = useHealthcare();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const highRiskPatients = patients.filter((p) => Boolean(p.riskCategory));

  const filteredPatients = highRiskPatients.filter(
    (p) => selectedCategory === "ALL" || p.riskCategory === selectedCategory
  );

  const categories = [
    { id: "ALL", label: "All High-Risk", count: highRiskPatients.length, icon: ShieldAlert },
    {
      id: "Maternal",
      label: "Maternal / ANC",
      count: highRiskPatients.filter((p) => p.riskCategory === "Maternal").length,
      icon: Heart,
      color: "text-rose-600",
    },
    {
      id: "Child",
      label: "Pediatric / Under 5",
      count: highRiskPatients.filter((p) => p.riskCategory === "Child").length,
      icon: Baby,
      color: "text-amber-600",
    },
    {
      id: "Diabetes",
      label: "NCD - Diabetes",
      count: highRiskPatients.filter((p) => p.riskCategory === "Diabetes").length,
      icon: Activity,
      color: "text-blue-600",
    },
    {
      id: "Hypertension",
      label: "NCD - Hypertension",
      count: highRiskPatients.filter((p) => p.riskCategory === "Hypertension").length,
      icon: Flame,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div className="pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-extrabold text-slate-900">
            High-Risk Vulnerable Cohort Registry
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800">
            {highRiskPatients.length} Flagged Cases
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Priority tracking for pregnant women, infants under 5, and severe NCD cases under Dhadgaon PHC
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold border transition-all shrink-0 ${
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? "text-white" : cat.color || "text-slate-500"}`} />
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  isSelected ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-800"
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* High-Risk Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPatients.map((p) => {
          const isEmergency = p.triagePriority === "EMERGENCY";
          return (
            <div
              key={p.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                isEmergency
                  ? "border-red-300 bg-red-50/40 shadow-xs"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-extrabold text-slate-900">{p.name}</h3>
                      <span className="text-xs text-slate-500 font-semibold">
                        ({p.age}y, {p.sex})
                      </span>
                      <UrgencyBadge priority={p.triagePriority} size="sm" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {p.village}
                      </span>
                      <span>·</span>
                      <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                        {p.riskCategory} Cohort
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                    {p.bloodGroup}
                  </span>
                </div>

                {/* Vitals Summary */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center text-xs mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">BP</span>
                    <span className={`font-black ${isEmergency ? "text-red-700" : "text-slate-800"}`}>
                      {p.vitals.bp}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">SpO2 / Pulse</span>
                    <span className="font-black text-slate-800">
                      {p.vitals.spo2}% / {p.vitals.pulse}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Hb / Wt</span>
                    <span className="font-black text-slate-800">
                      {p.vitals.hb || "N/A"} · {p.vitals.weight}kg
                    </span>
                  </div>
                </div>

                {/* Clinical Flags & ASHA Field Notes */}
                <div className="text-xs space-y-1.5 mb-4">
                  <p className="text-slate-800">
                    <strong>Chief Complaint:</strong> {p.visitReason}
                  </p>
                  {p.ashaNotes && (
                    <p className="text-amber-900 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/60 italic leading-relaxed">
                      &quot;{p.ashaNotes}&quot;
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onOpenConsultation(p.id)}
                  className="flex-1 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Examine & Consult</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenReferralModal(p.id)}
                  className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
                  title="Direct District Referral"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Refer DH</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
