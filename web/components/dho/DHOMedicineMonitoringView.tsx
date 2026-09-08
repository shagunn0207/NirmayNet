"use client";

import React from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { Pill, AlertOctagon, AlertTriangle, CheckCircle2, Clock, Send } from "lucide-react";

export const DHOMedicineMonitoringView: React.FC = () => {
  const { medicines, supplyRequests, showToast } = useHealthcare();

  const outOfStockMeds = medicines.filter((m) => m.status === "Out of Stock");
  const lowStockMeds = medicines.filter((m) => m.status === "Low Stock");

  const handleApproveAllIndents = () => {
    showToast(
      "Indents Approved",
      "All pending facility supply requisitions approved for release from District Drug Warehouse.",
      "success"
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Alert Notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50 border border-red-300 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
          <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-black uppercase text-red-800 tracking-wide">
              District Drug Stockout Emergency
            </span>
            <p className="text-xs text-red-900 mt-1 font-medium leading-relaxed">
              <strong>Tab Metformin 500mg</strong> and <strong>Inj Anti-Snake Venom</strong> are completely exhausted at multiple rural tribal health centres. Emergency bulk release from Haffkine Bio-Pharma quota recommended.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-black uppercase text-amber-800 tracking-wide">
              Maternal Drug Buffer Shortage
            </span>
            <p className="text-xs text-amber-900 mt-1 font-medium leading-relaxed">
              Labetalol and Magnesium Sulfate vials in Dhadgaon, Toranmal, and Molgi are operating below the 30% buffer margin.
            </p>
          </div>
        </div>
      </div>

      {/* Two-Column Monitoring View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: District EDL Supply Requisitions Awaiting Approval */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Facility Indents Awaiting DHO Approval
                </h3>
                <p className="text-xs text-slate-500">
                  Requisitions submitted by PHC Medical Officers
                </p>
              </div>
              <button
                type="button"
                onClick={handleApproveAllIndents}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Approve All
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              {supplyRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {req.medicineName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          req.priority === "High"
                            ? "bg-red-100 text-red-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {req.priority}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Facility: <strong>{req.facility}</strong> · Qty: <strong>{req.quantityRequested} {req.unit}</strong> · {req.requestDate}
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-extrabold shrink-0 ${
                      req.status === "Pending Approval"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 mt-4">
            Authorized central supplier: <strong>Maharashtra Medical Goods Procurement Authority (MMGPA)</strong>.
          </div>
        </div>

        {/* Right Column: Facilities Requiring Immediate Drug Intervention */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">
                Facilities with Critical Stock Depletion
              </h3>
              <p className="text-xs text-slate-500">
                Prioritized delivery routes for district drug distribution vehicles
              </p>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="p-3.5 bg-red-50/50 rounded-xl border border-red-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-slate-900">PHC Khapar (Akkalkuwa Block)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800">
                    CRITICAL (62% Stock)
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Depleted: Anti-Snake Venom (0 vials), Inj Oxytocin (&lt;10). High snakebite incidence reported in post-monsoon weeks.
                </p>
              </div>

              <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-slate-900">PHC Dhadgaon (Akrani Block)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                    ALERT (74% Stock)
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Depleted: Tab Metformin (0 tabs), Labetalol 100mg (&lt;50 tabs). Supply indent pending district dispatch.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-slate-900">PHC Molgi (Akkalkuwa Block)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    STABLE (88% Stock)
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Buffer stock compliant across essential maternal and emergency lines.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 mt-4">
            GPS Fleet tracking active: Central van MH-39-DV-4001 dispatched towards Khapar-Dhadgaon route.
          </div>
        </div>
      </div>
    </div>
  );
};
