"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge } from "@/components/common/Badge";
import {
  Search,
  User,
  MapPin,
  Phone,
  FileText,
  Clock,
  HeartPulse,
  Building2,
  Calendar,
} from "lucide-react";

export const HospitalPatientsView: React.FC = () => {
  const { patients } = useHealthcare();
  const [search, setSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patients[0]?.id || "P-101"
  );

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.village.toLowerCase().includes(search.toLowerCase()) ||
      p.abhaId.includes(search)
  );

  const selectedPatient =
    patients.find((p) => p.id === selectedPatientId) || patients[0];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">
            District Master Patient Health Directory
          </h2>
          <p className="text-xs text-slate-500">
            Unified Longitudinal Health Records connecting ASHA field notes, PHC visits, and Hospital charts
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, ABHA ID, village..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Two-Column Master/Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-4 flex flex-col gap-2.5 max-h-[700px] overflow-y-auto pr-1">
          {filtered.map((p) => {
            const isSelected = selectedPatient && selectedPatient.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs flex flex-col gap-1 ${
                  isSelected
                    ? "border-blue-700 bg-blue-50/60 shadow-xs ring-2 ring-blue-500/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">{p.name}</span>
                  <UrgencyBadge priority={p.triagePriority} size="sm" />
                </div>
                <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
                  <span>{p.age}y · {p.sex}</span>
                  <span>·</span>
                  <span>{p.village}</span>
                </div>
                <span className="text-[10px] text-teal-700 font-bold mt-0.5">
                  ABHA: {p.abhaId}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Detail Pane */}
        {selectedPatient && (
          <div className="lg:col-span-8 bg-slate-50/70 border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 text-xs">
            {/* Patient Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 font-black text-xl flex items-center justify-center shrink-0 border border-blue-200">
                  {selectedPatient.sex === "Female" ? "👩" : "👨"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">{selectedPatient.name}</h3>
                    <UrgencyBadge priority={selectedPatient.triagePriority} />
                    {selectedPatient.riskCategory && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">
                        {selectedPatient.riskCategory} High-Risk
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500 text-xs flex items-center gap-2 mt-0.5">
                    <span>Age: {selectedPatient.age} yrs</span>
                    <span>·</span>
                    <span>Blood: {selectedPatient.bloodGroup}</span>
                    <span>·</span>
                    <span>Village: {selectedPatient.village}</span>
                    <span>·</span>
                    <span>Phone: {selectedPatient.phone}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">ABHA Identifier</span>
                <span className="font-black text-slate-900 bg-white px-2 py-1 rounded-md border border-slate-200">
                  {selectedPatient.abhaId}
                </span>
              </div>
            </div>

            {/* Vitals Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">BP</span>
                <span className="text-xs font-black text-slate-900">{selectedPatient.vitals.bp}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Pulse</span>
                <span className="text-xs font-black text-slate-900">{selectedPatient.vitals.pulse} bpm</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">SpO2</span>
                <span className="text-xs font-black text-slate-900">{selectedPatient.vitals.spo2}%</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Temp</span>
                <span className="text-xs font-black text-slate-900">{selectedPatient.vitals.temp}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Weight / Hb</span>
                <span className="text-xs font-black text-slate-900">
                  {selectedPatient.vitals.weight}kg {selectedPatient.vitals.hb ? `/ ${selectedPatient.vitals.hb}` : ""}
                </span>
              </div>
            </div>

            {/* ASHA & PHC Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedPatient.ashaNotes && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="font-bold text-amber-900 text-[10px] uppercase block mb-1">
                    ASHA Field Worker Intake Notes
                  </span>
                  <p className="text-amber-950 italic leading-relaxed text-xs">
                    &quot;{selectedPatient.ashaNotes}&quot;
                  </p>
                </div>
              )}

              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-700 text-[10px] uppercase block mb-1">
                  Chronic Medical History
                </span>
                <ul className="space-y-1 text-slate-700">
                  {selectedPatient.medicalHistory.map((h, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Consultation History */}
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 text-xs uppercase block mb-2">
                Longitudinal Consultation Records
              </span>
              {selectedPatient.consultationHistory.length === 0 ? (
                <p className="text-slate-400 italic text-xs">No previous consultations logged.</p>
              ) : (
                <div className="space-y-2">
                  {selectedPatient.consultationHistory.map((c, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                      <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                        <span className="font-bold text-slate-800">{c.date}</span>
                        <span>{c.doctor} · {c.facility}</span>
                      </div>
                      <p className="font-bold text-slate-900">{c.assessment}</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">{c.notes}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {c.prescription.map((rx, rIdx) => (
                          <span key={rIdx} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-700">
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
        )}
      </div>
    </div>
  );
};
