"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { Search, Filter, AlertTriangle, Building2, CheckCircle, AlertOctagon } from "lucide-react";

export const DHOPHCPerformanceView: React.FC = () => {
  const { phcMetrics } = useHealthcare();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredPHCs = phcMetrics.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.block.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-5">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">
            Primary Health Centre (PHC) Operational Scorecard
          </h2>
          <p className="text-xs text-slate-500">
            Comparative performance matrix across all 18 PHCs in Nandurbar District
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search PHC name or block..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="font-bold text-slate-500 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Facility Status:
        </span>
        {(["ALL", "Operational", "Alert", "Critical"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              statusFilter === tab
                ? tab === "Critical"
                  ? "bg-red-700 text-white"
                  : tab === "Alert"
                  ? "bg-amber-700 text-white"
                  : tab === "Operational"
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Performance Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">PHC Facility</th>
              <th className="py-3 px-4">Taluka / Block</th>
              <th className="py-3 px-4">OPD Patients</th>
              <th className="py-3 px-4">Avg Wait</th>
              <th className="py-3 px-4">Referrals Sent</th>
              <th className="py-3 px-4">Completion %</th>
              <th className="py-3 px-4">Medicine Stock</th>
              <th className="py-3 px-4">Diagnostics</th>
              <th className="py-3 px-4">Administrative Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPHCs.map((phc) => {
              const isCritical = phc.status === "Critical";
              const isAlert = phc.status === "Alert";

              return (
                <tr
                  key={phc.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isCritical
                      ? "bg-red-50/30 font-medium"
                      : isAlert
                      ? "bg-amber-50/20"
                      : ""
                  }`}
                >
                  <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                    {phc.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{phc.block}</td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-800">
                    {phc.patientsToday}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">
                    {phc.avgWaitMinutes} mins
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {phc.referralsSent}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-slate-800">
                      {phc.referralCompletionRate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-extrabold ${
                        phc.medicineStockPercent < 70
                          ? "text-red-700 font-black"
                          : phc.medicineStockPercent < 80
                          ? "text-amber-700"
                          : "text-emerald-700"
                      }`}
                    >
                      {phc.medicineStockPercent}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-extrabold ${
                        phc.diagnosticAvailabilityPercent < 60
                          ? "text-red-700 font-black"
                          : "text-slate-800"
                      }`}
                    >
                      {phc.diagnosticAvailabilityPercent}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isCritical
                            ? "bg-red-100 text-red-800 border border-red-300"
                            : isAlert
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        }`}
                      >
                        {phc.status}
                      </span>
                      {phc.alertDetail && (
                        <span className="block text-[10px] text-red-700 font-bold mt-0.5">
                          {phc.alertDetail}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
