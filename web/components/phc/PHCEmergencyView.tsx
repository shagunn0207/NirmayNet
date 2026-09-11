"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge, ReferralStatusBadge } from "@/components/common/Badge";
import {
  Ambulance,
  Search,
  Stethoscope,
  MapPin,
  Send,
  AlertOctagon,
  Clock,
  Phone,
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
  const [search, setSearch] = useState("");

  // Patients flagged as EMERGENCY
  const emergencyPatients = patients.filter(
    (p) => p.triagePriority === "EMERGENCY"
  );

  const emergencyTransfers = hospitalReferrals.filter(
    (r) => r.priority === "EMERGENCY" && r.status !== "COMPLETED"
  );

  // Filter
  const filteredPatients = emergencyPatients.filter((p) => {
    return p.name.toLowerCase().includes(search.toLowerCase()) || p.token?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 flex items-center justify-between">
          <div>
            <div className="text-4xl font-black text-red-600">{emergencyPatients.length}</div>
            <div className="text-sm text-slate-500 font-medium mt-1">Critical Cases</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center animate-pulse">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 flex items-center justify-between">
          <div>
            <div className="text-4xl font-black text-slate-900">{emergencyTransfers.length}</div>
            <div className="text-sm text-slate-500 font-medium mt-1">Active Transits</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center">
            <Ambulance className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 flex items-center justify-between">
          <div>
            <div className="text-4xl font-black text-slate-900">14 min</div>
            <div className="text-sm text-slate-500 font-medium mt-1">Avg ETA</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 flex items-center justify-between">
          <div>
            <div className="text-4xl font-black text-slate-900">Bed #04</div>
            <div className="text-sm text-slate-500 font-medium mt-1">DH HDU Status</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-3xl overflow-hidden pt-2 flex flex-col flex-1 min-h-0 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        {/* Toolbar */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search emergency cases..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-full pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onOpenReferralModal(emergencyPatients[0]?.id || "P-101")}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-full shadow-xs transition-colors"
            >
              <Ambulance className="w-4 h-4" />
              <span>Dispatch 108</span>
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2.5 rounded-full">
              <Phone className="w-4 h-4" />
              <span>DH Casualty: 108</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto flex-1 px-2 sm:px-6 pb-6">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold capitalize">
                <th className="px-6 py-4 w-10">Token</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Vitals</th>
                <th className="px-6 py-4">Presentation</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No emergency cases found.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const transfer = hospitalReferrals.find(
                    (r) => r.patientId === patient.id && r.status !== "COMPLETED"
                  );
                  return (
                    <tr
                      key={patient.id}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="text-red-600 font-black text-sm bg-red-50 px-2 py-1 rounded-lg">
                          {patient.token}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm">
                            {patient.name}
                          </span>
                          <span className="text-xs text-slate-500 mt-0.5">
                            {patient.age} yrs · {patient.sex} · ABHA: {patient.abhaId}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400">BP</span>
                            <span className="text-xs font-bold text-red-700">{patient.vitals.bp}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400">SpO2</span>
                            <span className={`text-xs font-bold ${Number(patient.vitals.spo2) < 94 ? "text-red-700" : "text-slate-700"}`}>
                              {patient.vitals.spo2}%
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Pulse</span>
                            <span className="text-xs font-bold text-slate-700">{patient.vitals.pulse}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-red-900 max-w-[200px] truncate">
                            {patient.visitReason}
                          </span>
                          <div className="flex gap-1 mt-1">
                            {patient.symptoms?.slice(0, 2).map((s, idx) => (
                              <span key={idx} className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium">
                                {s}
                              </span>
                            ))}
                            {(patient.symptoms?.length || 0) > 2 && (
                              <span className="text-[10px] text-slate-400">+{patient.symptoms!.length - 2}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {transfer ? (
                          <div className="flex flex-col">
                            <ReferralStatusBadge status={transfer.status} size="sm" />
                            <span className="text-[10px] text-slate-500 font-bold mt-1">ETA: {transfer.ambulanceEta || "18m"}</span>
                          </div>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                            {patient.currentStatus}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenConsultation(patient.id)}
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Examine & Stabilize"
                          >
                            <Stethoscope className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenReferralModal(patient.id)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{transfer ? "Update" : "Escalate"}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
