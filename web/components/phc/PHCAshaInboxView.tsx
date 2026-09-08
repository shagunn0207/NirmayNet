"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge } from "@/components/common/Badge";
import {
  HeartPulse,
  User,
  Phone,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Stethoscope,
  Send,
  Calendar,
} from "lucide-react";

interface PHCAshaInboxViewProps {
  onOpenConsultation: (patientId: string) => void;
  onOpenReferralModal: (patientId: string) => void;
}

export const PHCAshaInboxView: React.FC<PHCAshaInboxViewProps> = ({
  onOpenConsultation,
  onOpenReferralModal,
}) => {
  const { ashaReferrals, acceptAshaReferral } = useHealthcare();
  const [filter, setFilter] = useState<"ALL" | "Pending Review" | "Accepted">("ALL");

  const filteredReferrals = ashaReferrals.filter(
    (r) => filter === "ALL" || r.status === filter
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900">
              ASHA Field Referral Inbox
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              {ashaReferrals.filter((r) => r.status === "Pending Review").length} Pending
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time referrals from ASHA workers across Chinchpada, Toranmal, and Nandurbar sub-centres
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          {(["ALL", "Pending Review", "Accepted"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                filter === tab
                  ? "bg-teal-700 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Referrals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReferrals.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-400 text-xs">
            No ASHA referrals found under the current filter.
          </div>
        ) : (
          filteredReferrals.map((ref) => {
            const isPending = ref.status === "Pending Review";
            const isEmergency = ref.priority === "EMERGENCY";

            return (
              <div
                key={ref.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                  isEmergency
                    ? "border-red-300 bg-red-50/40 shadow-xs"
                    : isPending
                    ? "border-amber-300 bg-amber-50/30"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div>
                  {/* Card Top: Patient & Priority */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-extrabold text-slate-900">
                          {ref.patientName}
                        </h3>
                        <span className="text-xs text-slate-500 font-semibold">
                          ({ref.age}y, {ref.sex})
                        </span>
                        <UrgencyBadge priority={ref.priority} size="sm" />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {ref.village}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {ref.timestamp}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isPending
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {ref.status}
                    </span>
                  </div>

                  {/* ASHA Info Badge */}
                  <div className="bg-white/80 border border-slate-200 rounded-xl p-3 mb-3 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-black text-xs flex items-center justify-center">
                        👩‍⚕️
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-tight">
                          ASHA: {ref.ashaName}
                        </p>
                        <p className="text-[10px] text-slate-500">{ref.subCentre}</p>
                      </div>
                    </div>
                    <a
                      href={`tel:${ref.ashaPhone}`}
                      className="text-teal-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{ref.ashaPhone}</span>
                    </a>
                  </div>

                  {/* Referral Reason & Symptoms */}
                  <div className="mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Reason for Referral
                    </h4>
                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      {ref.referralReason}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {ref.symptoms.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Vitals & ASHA Clinical Assessment */}
                  <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100 text-xs">
                    <div className="grid grid-cols-3 gap-2 mb-2 pb-2 border-b border-slate-200 text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Blood Pressure</span>
                        <span className={`font-black text-xs ${isEmergency ? "text-red-700" : "text-slate-800"}`}>
                          {ref.vitals.bp} mmHg
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">SpO2</span>
                        <span className="font-black text-xs text-slate-800">{ref.vitals.spo2}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Pulse / Hb</span>
                        <span className="font-black text-xs text-slate-800">
                          {ref.vitals.pulse} bpm {ref.vitals.hb ? `/ ${ref.vitals.hb}` : ""}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
                        ASHA Field Assessment:
                      </span>
                      <p className="text-slate-700 italic leading-relaxed">
                        &quot;{ref.ashaAssessment}&quot;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  {isPending ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          acceptAshaReferral(ref.id);
                          onOpenConsultation(ref.patientId);
                        }}
                        className="flex-1 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Accept & Consult</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenReferralModal(ref.patientId)}
                        className="py-2 px-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                        title="Escalate directly to District Hospital"
                      >
                        <Send className="w-3.5 h-3.5 text-red-600" />
                        <span>Escalate DH</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenConsultation(ref.patientId)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Stethoscope className="w-4 h-4 text-teal-700" />
                      <span>Open Patient Record & Consultation</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
