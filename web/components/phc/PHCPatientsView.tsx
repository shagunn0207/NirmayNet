"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge } from "@/components/common/Badge";
import {
  Search,
  Filter,
  User,
  MapPin,
  Phone,
  Calendar,
  FileText,
  Clock,
  HeartPulse,
  Stethoscope,
  Send,
  ShieldAlert,
  ChevronRight,
  Activity,
  CheckCircle2,
} from "lucide-react";

interface PHCPatientsViewProps {
  onOpenConsultation: (patientId: string) => void;
  onOpenReferralModal: (patientId: string) => void;
}

export const PHCPatientsView: React.FC<PHCPatientsViewProps> = ({
  onOpenConsultation,
  onOpenReferralModal,
}) => {
  const { patients, setSelectedPatient } = useHealthcare();

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patients[0]?.id || "P-101"
  );

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.village.toLowerCase().includes(search.toLowerCase()) ||
      p.abhaId.includes(search) ||
      (p.token && p.token.toLowerCase().includes(search.toLowerCase()));

    const matchesRisk =
      riskFilter === "ALL" ||
      (riskFilter === "ROUTINE" && !p.riskCategory) ||
      p.riskCategory === riskFilter;

    const matchesStatus =
      statusFilter === "ALL" || p.currentStatus === statusFilter;

    return matchesSearch && matchesRisk && matchesStatus;
  });

  const selectedPatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    const p = patients.find((pt) => pt.id === id);
    if (p) setSelectedPatient(p);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-5">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900">
              PHC Master Patient Directory & Clinical Records
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-teal-100 text-teal-900">
              {patients.length} Registered Patients
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Longitudinal Electronic Health Records (EHR) linking ASHA home visits, PHC consultations, and Hospital transfers
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, ABHA, village, token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-slate-50 font-medium"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Risk Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="font-bold text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Clinical Cohort:
          </span>
          {(["ALL", "Maternal", "Child", "Diabetes", "Hypertension", "ROUTINE"] as const).map(
            (cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setRiskFilter(cat)}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  riskFilter === cat
                    ? "bg-teal-700 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat === "ALL" ? "All Cohorts" : cat}
              </button>
            )
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="font-bold text-slate-500 shrink-0">Status:</span>
          {(["ALL", "Waiting", "In Consultation", "Completed", "Referred to DH"] as const).map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors text-[11px] ${
                  statusFilter === st
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Two-Pane Layout: List (Left) + Detail Profile (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane: Patient Cards List */}
        <div className="lg:col-span-5 flex flex-col gap-2.5 max-h-[750px] overflow-y-auto pr-1">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No patients match the search or filter criteria.
            </div>
          ) : (
            filteredPatients.map((p) => {
              const isSelected = selectedPatient && selectedPatient.id === p.id;
              const isEmergency = p.triagePriority === "EMERGENCY";

              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPatient(p.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs flex flex-col gap-1.5 ${
                    isSelected
                      ? "border-teal-700 bg-teal-50/60 shadow-xs ring-2 ring-teal-500/20"
                      : isEmergency
                      ? "border-red-200 bg-red-50/20 hover:border-red-400"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                        {p.token}
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {p.name}
                      </span>
                    </div>
                    <UrgencyBadge priority={p.triagePriority} size="sm" />
                  </div>

                  <p className="text-slate-600 font-medium truncate">
                    {p.visitReason}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>{p.age}y · {p.sex} · {p.village}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.currentStatus === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : p.currentStatus === "In Consultation"
                          ? "bg-teal-100 text-teal-800 animate-pulse"
                          : p.currentStatus === "Referred to DH"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.currentStatus}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Pane: Comprehensive Patient Health Record */}
        {selectedPatient ? (
          <div className="lg:col-span-7 bg-slate-50/80 border border-slate-200 rounded-2xl p-5 flex flex-col gap-5 text-xs">
            {/* Patient Header Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-900 font-black text-xl flex items-center justify-center shrink-0">
                  {selectedPatient.sex === "Female" ? "👩" : "👨"}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-black text-slate-900">
                      {selectedPatient.name}
                    </h3>
                    <UrgencyBadge priority={selectedPatient.triagePriority} />
                    {selectedPatient.riskCategory && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 text-[10px] font-bold">
                        {selectedPatient.riskCategory} High-Risk
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 flex-wrap">
                    <span>{selectedPatient.age} yrs · {selectedPatient.sex}</span>
                    <span>·</span>
                    <span>Blood: <strong>{selectedPatient.bloodGroup}</strong></span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {selectedPatient.village}
                    </span>
                    <span>·</span>
                    <span>ABHA ID: <strong>{selectedPatient.abhaId}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenConsultation(selectedPatient.id)}
                  className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Start Consultation</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenReferralModal(selectedPatient.id)}
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Refer DH</span>
                </button>
              </div>
            </div>

            {/* Current Vitals Card */}
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                Recorded Vitals (Current Visit)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[9px] uppercase text-slate-400 block font-bold">BP</span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {selectedPatient.vitals.bp}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[9px] uppercase text-slate-400 block font-bold">Pulse</span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {selectedPatient.vitals.pulse} bpm
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[9px] uppercase text-slate-400 block font-bold">SpO2</span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {selectedPatient.vitals.spo2}%
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[9px] uppercase text-slate-400 block font-bold">Temp</span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {selectedPatient.vitals.temp}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[9px] uppercase text-slate-400 block font-bold">Weight / Hb</span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {selectedPatient.vitals.weight}kg {selectedPatient.vitals.hb ? `/ ${selectedPatient.vitals.hb}` : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* ASHA Field Intake Notes */}
            {selectedPatient.ashaNotes && (
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4">
                <span className="text-[10px] uppercase font-black tracking-wide text-amber-900 block mb-1">
                  ASHA Field Health Worker Notes
                </span>
                <p className="text-amber-950 italic leading-relaxed">
                  &quot;{selectedPatient.ashaNotes}&quot;
                </p>
              </div>
            )}

            {/* Medical History & Chronic Conditions */}
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                Medical History & Allergies
              </span>
              <ul className="space-y-1.5">
                {selectedPatient.medicalHistory.map((h, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Consultation History */}
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                Past PHC Consultations & Prescriptions ({selectedPatient.consultationHistory.length})
              </span>
              {selectedPatient.consultationHistory.length === 0 ? (
                <p className="text-slate-400 italic">No previous consultations on record.</p>
              ) : (
                <div className="space-y-3">
                  {selectedPatient.consultationHistory.map((c, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                      <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                        <span className="font-bold text-slate-800">{c.date}</span>
                        <span>{c.doctor} · {c.facility}</span>
                      </div>
                      <p className="font-extrabold text-slate-900 mb-1">{c.assessment}</p>
                      <p className="text-slate-600 mb-2">{c.notes}</p>
                      <div className="flex flex-wrap gap-1">
                        {c.prescription.map((rx, rIdx) => (
                          <span
                            key={rIdx}
                            className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium text-[11px]"
                          >
                            {rx}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
