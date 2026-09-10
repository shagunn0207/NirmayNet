"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import {
  Pill,
  AlertTriangle,
  AlertOctagon,
  CheckCircle,
  Plus,
  Send,
  Clock,
  Package,
} from "lucide-react";

export const PHCInventoryView: React.FC = () => {
  const { medicines, supplyRequests, requestMedicineSupply } = useHealthcare();

  const [selectedMedId, setSelectedMedId] = useState(medicines[0]?.id || "");
  const [requestQty, setRequestQty] = useState(500);
  const [requestPriority, setRequestPriority] = useState<"High" | "Routine">("High");

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMedId && requestQty > 0) {
      requestMedicineSupply(selectedMedId, requestQty, requestPriority);
    }
  };

  const lowStockMeds = medicines.filter((m) => m.status === "Low Stock");
  const outOfStockMeds = medicines.filter((m) => m.status === "Out of Stock");

  return (
    <div className="flex flex-col gap-6">
      {/* Alert Notices */}
      {(outOfStockMeds.length > 0 || lowStockMeds.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outOfStockMeds.length > 0 && (
            <div className="bg-red-50 border border-red-300 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
              <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black uppercase text-red-800 tracking-wide">
                  Critical Out-of-Stock Warning
                </span>
                <p className="text-xs text-red-900 mt-1 font-medium">
                  {outOfStockMeds.map((m) => m.name).join(", ")} completely depleted at Dhadgaon PHC. Urgent requisition dispatched to District Drug Warehouse.
                </p>
              </div>
            </div>
          )}

          {lowStockMeds.length > 0 && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black uppercase text-amber-800 tracking-wide">
                  Low Stock Threshold Alerts
                </span>
                <p className="text-xs text-amber-900 mt-1 font-medium">
                  {lowStockMeds.length} essential formulations (e.g., Labetalol, Magnesium Sulfate, ORS) are below buffer stock (&lt;30%).
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Stock Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              PHC Essential Drug Inventory (EDL)
            </h2>
            <p className="text-xs text-slate-500">
              Current stock count and buffer levels at Dhadgaon PHC pharmacy
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Total Items: {medicines.length}
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Medicine Formulation</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Min. Buffer Threshold</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medicines.map((m) => {
                const isOut = m.status === "Out of Stock";
                const isLow = m.status === "Low Stock";
                return (
                  <tr
                    key={m.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isOut ? "bg-red-50/30" : isLow ? "bg-amber-50/20" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Pill
                          className={`w-3.5 h-3.5 ${
                            isOut
                              ? "text-red-600"
                              : isLow
                              ? "text-amber-600"
                              : "text-teal-600"
                          }`}
                        />
                        <span>{m.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{m.category}</td>
                    <td className="py-3.5 px-4">
                      <span className={`font-black text-sm ${isOut ? "text-red-700" : isLow ? "text-amber-700" : "text-slate-800"}`}>
                        {m.currentStock} {m.unit}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {m.minThreshold} {m.unit}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isOut
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : isLow
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {isOut || isLow ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMedId(m.id);
                            setRequestQty(m.minThreshold * 2);
                          }}
                          className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg text-[11px] transition-colors"
                        >
                          Request Indent
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Adequate</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supply Requisition Form & Active Indents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Requisition Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              Submit Medicine Indent to District
            </h3>
            <p className="text-xs text-slate-500">
              Order restocking from District Health Officer / Central Warehouse
            </p>
          </div>

          <form onSubmit={handleRequestSubmit} className="flex flex-col gap-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Select Medicine</label>
              <select
                value={selectedMedId}
                onChange={(e) => setSelectedMedId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                {medicines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (Current: {m.currentStock} {m.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Quantity Requisitioned
              </label>
              <input
                type="number"
                min={10}
                step={10}
                value={requestQty}
                onChange={(e) => setRequestQty(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Priority</label>
              <div className="flex gap-2">
                {(["High", "Routine"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setRequestPriority(p)}
                    className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${
                      requestPriority === p
                        ? p === "High"
                          ? "bg-red-700 text-white border-red-700"
                          : "bg-teal-700 text-white border-teal-700"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {p} Priority
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Requisition Indent</span>
            </button>
          </form>
        </div>

        {/* Active Indent Orders */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              Active Supply Requisitions Sent to DHO
            </h3>
            <p className="text-xs text-slate-500">
              Track warehouse approval and transit dispatch
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {supplyRequests.map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3 text-xs"
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
                    Qty: <strong>{req.quantityRequested} {req.unit}</strong> · Placed: {req.requestDate} · Facility: {req.facility}
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-extrabold shrink-0 ${
                    req.status === "Pending Approval"
                      ? "bg-amber-100 text-amber-800"
                      : req.status === "Dispatched"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
