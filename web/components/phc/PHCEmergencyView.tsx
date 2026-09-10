"use client";

import React from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge, ReferralStatusBadge } from "@/components/common/Badge";
import {
  Ambulance,
  AlertOctagon,
  HeartPulse,
  Send,
  Stethoscope,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  ShieldAlert,
  Zap,
} from "lucide-react";

interface PHCEmergencyViewProps {
  onOpenConsultation: (patientId: string) => void;
  onOpenReferralModal: (patientId: string) => void;
}

export const PHCEmergencyView: React.FC<PHCEmergencyViewProps> = ({
  onOpenConsultation,
  onOpenReferralModal,
}) => {
  const { patients, hospitalReferrals } = useHealthcare();

  // Patients flagged as EMERGENCY
  const emergencyPatients = patients.filter(
    (p) => p.triagePriority === "EMERGENCY"
  );

  // Active emergency transfers to District Hospital
  const emergencyTransfers = hospitalReferrals.filter(
    (r) => r.priority === "EMERGENCY" && r.status !== "COMPLETED"
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Red Alert Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <AlertOctagon className="w-7 h-7 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                CASUALTY PROTOCOL ACTIVE
              </span>
              <span className="text-red-100 text-xs font-semibold">24/7 Red Alert</span>
            </div>
            <h2 className="text-xl font-black mt-0.5">
              PHC Emergency & Resuscitation Bay
            </h2>
            <p className="text-xs text-red-100 mt-0.5">
              Immediate triage, emergency stabilization, and fast-track 108 ALS dispatch to Nandurbar District Hospital
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenReferralModal(emergencyPatients[0]?.id || "P-101")}
            className="px-4 py-2.5 bg-white text-red-700 hover:bg-red-50 rounded-xl font-black text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Ambulance className="w-4 h-4 text-red-600" />
            <span>Dispatch 108 Ambulance</span>
          </button>
        </div>
      </div>

      {/* Emergency KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-2xs">
          <span className="text-xs font-bold text-red-700 uppercase block mb-1">
            Emergency Cases In PHC
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-red-900">{emergencyPatients.length}</span>
            <span className="text-xs text-red-600 font-bold animate-pulse">Critical</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-500 uppercase block mb-1">
            Active 108 Transits
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{emergencyTransfers.length}</span>
            <span className="text-xs text-blue-700 font-bold">En Route</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-teal-700 uppercase block mb-1">
            Avg Ambulance ETA
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-teal-900">14 min</span>
            <span className="text-xs text-teal-700 font-bold">Golden Hour</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-purple-700 uppercase block mb-1">
            District HDU Status
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-900">Reserved</span>
            <span className="text-xs text-purple-700 font-bold">Bed #04 Standby</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Emergency Patients List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              <span>Priority Red Patients Requiring Immediate Action</span>
            </h3>
            <span className="text-xs text-slate-500 font-bold">
              {emergencyPatients.length} Active Patients
            </span>
          </div>

          {emergencyPatients.map((patient) => {
            const transfer = hospitalReferrals.find(
              (r) => r.patientId === patient.id && r.status !== "COMPLETED"
            );

            return (
              <div
                key={patient.id}
                className="bg-white border-2 border-red-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4 hover:border-red-400 transition-colors"
              >
                {/* Patient Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-black text-xs border border-red-300">
                        {patient.token}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900">
                        {patient.name}
                      </h4>
                      <UrgencyBadge priority="EMERGENCY" />
                      {patient.riskCategory && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">
                          {patient.riskCategory} High-Risk
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>{patient.age} yrs · {patient.sex} · Blood: {patient.bloodGroup}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {patient.village}
                      </span>
                      <span>·</span>
                      <span>ABHA: <strong>{patient.abhaId}</strong></span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black self-start sm:self-auto ${
                      patient.currentStatus === "Referred to DH"
                        ? "bg-purple-100 text-purple-900 border border-purple-300"
                        : "bg-red-100 text-red-900 border border-red-300 animate-pulse"
                    }`}
                  >
                    {patient.currentStatus}
                  </span>
                </div>

                {/* Emergency Vitals Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                  <div className="p-2.5 bg-red-50 rounded-xl border border-red-100">
                    <span className="text-[10px] uppercase font-bold text-red-700 block">
                      Blood Pressure
                    </span>
                    <span className="text-base font-black text-red-950">
                      {patient.vitals.bp} mmHg
                    </span>
                  </div>
                  <div className="p-2.5 bg-red-50 rounded-xl border border-red-100">
                    <span className="text-[10px] uppercase font-bold text-red-700 block">
                      Pulse Rate
                    </span>
                    <span className="text-base font-black text-red-950">
                      {patient.vitals.pulse} bpm
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Oxygen SpO2
                    </span>
                    <span className={`text-base font-black ${Number(patient.vitals.spo2) < 94 ? "text-red-700" : "text-slate-800"}`}>
                      {patient.vitals.spo2}%
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Temperature
                    </span>
                    <span className="text-base font-black text-slate-800">
                      {patient.vitals.temp}
                    </span>
                  </div>
                </div>

                {/* Reason & Symptoms */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Emergency Presentation:
                  </span>
                  <p className="text-xs font-extrabold text-red-900 leading-snug">
                    {patient.visitReason}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {patient.symptoms?.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-red-50 border border-red-200 text-red-800 text-[11px] font-bold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Active Transfer Card if Dispatched */}
                {transfer && (
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <Ambulance className="w-5 h-5 text-blue-700 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-blue-950">
                            Transfer #{transfer.id} → {transfer.destinationFacility}
                          </span>
                          <ReferralStatusBadge status={transfer.status} size="sm" />
                        </div>
                        <span className="text-[11px] text-blue-800 mt-0.5 block">
                          Vehicle: <strong>{transfer.vehicleNumber || "MH-39-AM-1081"}</strong> · Driver: {transfer.driverContact || "Santosh Gavit"} · ETA: <strong>{transfer.ambulanceEta || "18m"}</strong>
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-blue-700 font-bold bg-white px-2.5 py-1 rounded-lg border border-blue-200 shrink-0">
                      Specialist Assigned: {transfer.assignedDoctor || "Dr. Neelam Joshi"}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Wait Time in Bay: <strong>{patient.waitTimeMinutes} mins</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenConsultation(patient.id)}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Examine & Stabilize</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenReferralModal(patient.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{transfer ? "Update DH Referral" : "Escalate to DH"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Emergency Protocols & Rapid Directives */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Standing Clinical Orders */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-3.5">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <Zap className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-extrabold text-slate-900">
                PHC First-Response Protocols
              </h3>
            </div>

            {/* Protocol 1 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-extrabold text-slate-900 block mb-1">
                1. Severe Pre-Eclampsia (Pritchard Regimen)
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Loading: <strong>Inj MgSO4 50% 4g IV (slow over 10m) + 10g IM (5g in each buttock)</strong>. Oral Labetalol 100mg if systolic &gt; 160.
              </p>
            </div>

            {/* Protocol 2 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-extrabold text-slate-900 block mb-1">
                2. Acute Coronary Syndrome (ACS)
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Loading triple therapy: <strong>Tab Aspirin 300mg + Tab Clopidogrel 300mg + Tab Atorvastatin 80mg</strong>. Sublingual Sorbitrate 5mg SOS.
              </p>
            </div>

            {/* Protocol 3 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-extrabold text-slate-900 block mb-1">
                3. Snake Envenomation (Neurotoxic / Hemotoxic)
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                ASV stock status: <strong className="text-red-700 font-bold">Stockout at PHC!</strong> Immediate 108 ambulance dispatch with bag-valve mask support to District Hospital.
              </p>
            </div>
          </div>

          {/* Quick Contacts */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal-700" />
              <span>Emergency Hotlines</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-semibold text-slate-700">108 Emergency ALS Dispatch</span>
                <span className="font-black text-red-700">108</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-semibold text-slate-700">DH Nandurbar Casualty Wing</span>
                <span className="font-bold text-slate-900">+91 2564 222100</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-semibold text-slate-700">Obstetric HDU Duty Specialist</span>
                <span className="font-bold text-slate-900">+91 98220 11200</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-semibold text-slate-700">District Blood Bank (Nandurbar)</span>
                <span className="font-bold text-slate-900">+91 2564 222144</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
