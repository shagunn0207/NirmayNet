"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge } from "@/components/common/Badge";
import { UrgencyLevel } from "@/lib/healthcareData";
import {
  Search,
  Filter,
  Stethoscope,
  Send,
  User,
  Clock,
  MapPin,
  FileText,
} from "lucide-react";

interface PHCQueueViewProps {
  onOpenConsultation: (patientId: string) => void;
  onOpenReferralModal: (patientId: string) => void;
  onViewRecord: (patientId: string) => void;
}

export const PHCQueueView: React.FC<PHCQueueViewProps> = ({
  onOpenConsultation,
  onOpenReferralModal,
  onViewRecord,
}) => {
  const { patients } = useHealthcare();
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.village.toLowerCase().includes(search.toLowerCase()) ||
      (p.token && p.token.toLowerCase().includes(search.toLowerCase())) ||
      p.abhaId.includes(search);

    const matchesPriority =
      priorityFilter === "ALL" || p.triagePriority === priorityFilter;

    const matchesStatus =
      statusFilter === "ALL" || p.currentStatus === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">OPD Patient Queue</h2>
          <p className="text-xs text-slate-500">
            Real-time patient triage and consultation queue at Dhadgaon PHC
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, village, ABHA, token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="font-bold text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Priority:
          </span>
          {(["ALL", "EMERGENCY", "URGENT", "ROUTINE"] as const).map((prio) => (
            <button
              key={prio}
              type="button"
              onClick={() => setPriorityFilter(prio)}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                priorityFilter === prio
                  ? prio === "EMERGENCY"
                    ? "bg-red-700 text-white"
                    : prio === "URGENT"
                    ? "bg-amber-700 text-white"
                    : prio === "ROUTINE"
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {prio === "ALL" ? "All Priorities" : prio}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="font-bold text-slate-500 shrink-0">Status:</span>
          {(["ALL", "Waiting", "In Consultation", "Completed", "Referred to DH"] as const).map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  statusFilter === st
                    ? "bg-teal-700 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Queue Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-widest text-[10px]">
              <th className="py-4 px-5">Token</th>
              <th className="py-4 px-5">Patient Details</th>
              <th className="py-4 px-5">Priority & Triage</th>
              <th className="py-4 px-5">Reason for Visit</th>
              <th className="py-4 px-5">Vitals Summary</th>
              <th className="py-4 px-5">Wait Time</th>
              <th className="py-4 px-5">Status</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No patients match the selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredPatients.map((p) => {
                const isEmergency = p.triagePriority === "EMERGENCY";
                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-slate-50/80 transition-colors group ${
                      isEmergency ? "bg-red-50/30" : ""
                    }`}
                  >
                    {/* Token */}
                    <td className="py-4 px-5 font-black text-slate-900 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center min-w-[3rem] px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
                        {p.token || "OPD"}
                      </span>
                    </td>

                    {/* Patient Details */}
                    <td className="py-4 px-5">
                      <div>
                        <div className="font-extrabold text-slate-900 text-sm">{p.name}</div>
                        <div className="text-slate-500 text-xs flex items-center gap-1.5 mt-0.5 font-medium">
                          <span>{p.age}y · {p.sex}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {p.village}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <UrgencyBadge priority={p.triagePriority} size="sm" />
                    </td>

                    {/* Reason */}
                    <td className="py-4 px-5 text-slate-800 max-w-xs truncate text-xs">
                      <span className="font-bold">{p.visitReason}</span>
                      {p.riskCategory && (
                        <span className="block text-[10px] text-teal-700 font-bold mt-0.5">
                          Risk: {p.riskCategory}
                        </span>
                      )}
                    </td>

                    {/* Vitals */}
                    <td className="py-4 px-5 whitespace-nowrap text-slate-700 text-xs">
                      <div>BP: <strong className={isEmergency ? "text-red-700" : "text-slate-900"}>{p.vitals.bp}</strong></div>
                      <div>SpO2: <strong className="text-slate-900">{p.vitals.spo2}%</strong> · PR: {p.vitals.pulse}</div>
                    </td>

                    {/* Wait Time */}
                    <td className="py-4 px-5 whitespace-nowrap text-slate-500 text-xs font-bold">
                      <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 w-fit">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {p.waitTimeMinutes} mins
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
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
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenConsultation(p.id)}
                          className="px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                          title="Start / Continue Clinical Consultation"
                        >
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>Consult</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenReferralModal(p.id)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                          title="Refer to District Hospital"
                        >
                          <Send className="w-4 h-4 text-red-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onViewRecord(p.id)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                          title="View Complete Health History"
                        >
                          <FileText className="w-4 h-4 text-slate-600" />
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
  );
};
