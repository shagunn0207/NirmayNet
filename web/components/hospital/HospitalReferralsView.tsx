"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge, ReferralStatusBadge } from "@/components/common/Badge";
import { ReferralStatus, HospitalReferral } from "@/lib/healthcareData";
import {
  Send,
  Building2,
  Ambulance,
  CheckCircle,
  Clock,
  UserCheck,
  AlertCircle,
  FileText,
  HelpCircle,
  CheckCheck,
} from "lucide-react";

interface HospitalReferralsViewProps {
  selectedReferralId?: string | null;
}

export const HospitalReferralsView: React.FC<HospitalReferralsViewProps> = ({
  selectedReferralId,
}) => {
  const {
    hospitalReferrals,
    updateHospitalReferralStatus,
    requestMoreReferralInfo,
    specialists,
  } = useHealthcare();

  const [activeRefId, setActiveRefId] = useState<string>(
    selectedReferralId || hospitalReferrals[0]?.id || ""
  );
  const [filter, setFilter] = useState<string>("ALL");

  // State for clarification notes modal/input
  const [clarificationNote, setClarificationNote] = useState("");
  const [selectedSpecialist, setSelectedSpecialist] = useState(
    specialists[0]?.name || "Dr. Neelam Joshi"
  );
  const [statusNote, setStatusNote] = useState("");

  const activeReferral =
    hospitalReferrals.find((r) => r.id === activeRefId) || hospitalReferrals[0];

  const filteredReferrals = hospitalReferrals.filter((r) => {
    if (filter === "ALL") return true;
    if (filter === "EMERGENCY") return r.priority === "EMERGENCY";
    if (filter === "ACTIVE") return r.status !== "COMPLETED";
    if (filter === "IN_TRANSIT") return r.ambulanceStatus === "In Transit";
    if (filter === "COMPLETED") return r.status === "COMPLETED";
    return true;
  });

  const handleStatusTransition = (newStatus: ReferralStatus) => {
    if (!activeReferral) return;
    updateHospitalReferralStatus(
      activeReferral.id,
      newStatus,
      statusNote ? statusNote : activeReferral.hospitalNotes,
      selectedSpecialist
    );
    setStatusNote("");
  };

  const handleSendClarification = () => {
    if (!activeReferral || !clarificationNote.trim()) return;
    requestMoreReferralInfo(activeReferral.id, clarificationNote.trim());
    setClarificationNote("");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900">
              PHC Referral Inbound & Admission Management
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900">
              {hospitalReferrals.filter((r) => r.status !== "COMPLETED").length} Active Transits
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Receive, triage, assign specialists, and confirm arrival for rural transfers
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1">
          {(["ALL", "ACTIVE", "EMERGENCY", "IN_TRANSIT", "COMPLETED"] as const).map(
            (tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors shrink-0 ${
                  filter === tab
                    ? "bg-blue-800 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {tab === "ALL"
                  ? "All Referrals"
                  : tab === "ACTIVE"
                  ? "Active"
                  : tab === "EMERGENCY"
                  ? "Emergency"
                  : tab === "IN_TRANSIT"
                  ? "Ambulance Transit"
                  : "Completed"}
              </button>
            )
          )}
        </div>
      </div>

      {/* Two-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane: Referrals List */}
        <div className="lg:col-span-5 flex flex-col gap-2.5 max-h-[750px] overflow-y-auto pr-1">
          {filteredReferrals.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">
              No referrals found matching the selected filter.
            </p>
          ) : (
            filteredReferrals.map((ref) => {
              const isSelected = activeReferral && activeReferral.id === ref.id;
              const isEmergency = ref.priority === "EMERGENCY";
              return (
                <div
                  key={ref.id}
                  onClick={() => setActiveRefId(ref.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs flex flex-col gap-1.5 ${
                    isSelected
                      ? "border-blue-700 bg-blue-50/50 shadow-xs ring-2 ring-blue-500/20"
                      : isEmergency
                      ? "border-red-200 bg-red-50/20 hover:border-red-400"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-sm text-slate-900">
                      {ref.patientName} ({ref.age}y, {ref.sex})
                    </span>
                    <UrgencyBadge priority={ref.priority} size="sm" />
                  </div>

                  <p className="text-slate-700 font-bold truncate">
                    {ref.department} — {ref.reason}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>From: <strong>{ref.referringFacility}</strong></span>
                    <ReferralStatusBadge status={ref.status} size="sm" />
                  </div>

                  {ref.ambulanceRequested && ref.status !== "COMPLETED" && (
                    <div className="flex items-center justify-between text-[10px] text-red-700 bg-red-50 px-2 py-0.5 rounded font-semibold mt-0.5">
                      <span>108 {ref.vehicleNumber || "Ambulance"}</span>
                      <span>ETA: {ref.ambulanceEta || "In Transit"}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Pane: Selected Referral Workflow & Action Workbench */}
        {activeReferral ? (
          <div className="lg:col-span-7 bg-slate-50/80 border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 text-xs">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-black text-slate-900">
                    {activeReferral.patientName}
                  </h3>
                  <span className="text-slate-500 font-bold">
                    ({activeReferral.age} yrs, {activeReferral.sex})
                  </span>
                  <UrgencyBadge priority={activeReferral.priority} />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Referral ID: <strong className="text-slate-800">{activeReferral.id}</strong> · Received: {activeReferral.timestamp}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Status</span>
                <ReferralStatusBadge status={activeReferral.status} />
              </div>
            </div>

            {/* Referring PHC Summary */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Referring Center</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {activeReferral.referringFacility} ({activeReferral.referringDoctor})
                  </span>
                </div>
                <span className="font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                  Target: {activeReferral.department}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Referral Reason</span>
                <p className="font-extrabold text-slate-900">{activeReferral.reason}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Pre-Transfer Clinical Summary</span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {activeReferral.clinicalSummary}
                </p>
              </div>

              {/* Vitals */}
              <div className="grid grid-cols-4 gap-2 text-center pt-1 text-[11px]">
                <div className="p-1.5 bg-slate-50 rounded-lg">
                  <span className="text-[9px] uppercase text-slate-400 block font-bold">BP</span>
                  <span className="font-bold text-slate-800">{activeReferral.vitals.bp}</span>
                </div>
                <div className="p-1.5 bg-slate-50 rounded-lg">
                  <span className="text-[9px] uppercase text-slate-400 block font-bold">Pulse</span>
                  <span className="font-bold text-slate-800">{activeReferral.vitals.pulse} bpm</span>
                </div>
                <div className="p-1.5 bg-slate-50 rounded-lg">
                  <span className="text-[9px] uppercase text-slate-400 block font-bold">SpO2</span>
                  <span className="font-bold text-slate-800">{activeReferral.vitals.spo2}%</span>
                </div>
                <div className="p-1.5 bg-slate-50 rounded-lg">
                  <span className="text-[9px] uppercase text-slate-400 block font-bold">Temp</span>
                  <span className="font-bold text-slate-800">{activeReferral.vitals.temp}</span>
                </div>
              </div>
            </div>

            {/* Ambulance Dispatch Card */}
            {activeReferral.ambulanceRequested && (
              <div className="bg-red-50/70 border border-red-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Ambulance className="w-5 h-5 text-red-600 shrink-0" />
                  <div>
                    <span className="font-bold text-red-950 block">108 Emergency Ambulance Transit</span>
                    <span className="text-[11px] text-red-800">
                      Vehicle: <strong>{activeReferral.vehicleNumber || "MH-39-AM-1081"}</strong> · Driver: {activeReferral.driverContact || "Santosh Gavit"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-red-700 block">ETA</span>
                  <span className="font-black text-red-900 text-sm">
                    {activeReferral.ambulanceEta || "20 mins"}
                  </span>
                </div>
              </div>
            )}

            {/* Workflow Step Actions */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col gap-3">
              <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wider block">
                Update Referral Stage & Hospital Actions:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusTransition("ACCEPTED")}
                  className={`py-2 px-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                    activeReferral.status === "ACCEPTED"
                      ? "bg-teal-800 text-white"
                      : "bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200"
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Accept Referral</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusTransition("PATIENT ARRIVED")}
                  className={`py-2 px-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                    activeReferral.status === "PATIENT ARRIVED"
                      ? "bg-purple-800 text-white"
                      : "bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200"
                  }`}
                >
                  <Ambulance className="w-3.5 h-3.5" />
                  <span>Patient Arrived</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusTransition("ASSIGNED")}
                  className={`py-2 px-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                    activeReferral.status === "ASSIGNED"
                      ? "bg-indigo-800 text-white"
                      : "bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200"
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Assign Specialist</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusTransition("CONSULTED")}
                  className={`py-2 px-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                    activeReferral.status === "CONSULTED"
                      ? "bg-amber-800 text-white"
                      : "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>In Consultation</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusTransition("COMPLETED")}
                  className={`py-2 px-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                    activeReferral.status === "COMPLETED"
                      ? "bg-emerald-800 text-white"
                      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Complete / Discharge</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusTransition("REFERRED FURTHER")}
                  className={`py-2 px-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                    activeReferral.status === "REFERRED FURTHER"
                      ? "bg-rose-800 text-white"
                      : "bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Refer to Tertiary (GMC)</span>
                </button>
              </div>

              {/* Specialist Selection & Hospital Note Field */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Assign Attending Specialist:
                  </label>
                  <select
                    value={selectedSpecialist}
                    onChange={(e) => setSelectedSpecialist(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  >
                    {specialists.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.specialty}) — [{s.status}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Update Hospital / Ward Notes:
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., Bed 4 in HDU prepped. Obstetric team standing by..."
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Request More Information Form */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col gap-2">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>Request Clinical Clarification from Referring PHC:</span>
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask referring doctor for missing lab report, ultrasound, or stabilization details..."
                  value={clarificationNote}
                  onChange={(e) => setClarificationNote(e.target.value)}
                  className="flex-1 p-2 rounded-xl border border-amber-300 text-xs bg-white"
                />
                <button
                  type="button"
                  onClick={handleSendClarification}
                  disabled={!clarificationNote.trim()}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 disabled:opacity-40 text-white rounded-xl font-bold shrink-0 transition-colors"
                >
                  Send Clarification
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 flex items-center justify-center py-20 text-slate-400">
            Select a referral from the left pane to view details.
          </div>
        )}
      </div>
    </div>
  );
};
