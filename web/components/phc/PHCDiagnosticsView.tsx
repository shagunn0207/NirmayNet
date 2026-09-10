"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import {
  FlaskConical,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Plus,
  FileCheck,
} from "lucide-react";

export const PHCDiagnosticsView: React.FC = () => {
  const {
    diagnostics,
    diagnosticOrders,
    recordDiagnosticResult,
    patients,
    orderDiagnosticTest,
  } = useHealthcare();

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "");
  const [selectedTestName, setSelectedTestName] = useState(diagnostics[0]?.name || "");

  // Result entry state
  const [enteringResultOrderId, setEnteringResultOrderId] = useState<string | null>(null);
  const [customResult, setCustomResult] = useState("");

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPatientId && selectedTestName) {
      orderDiagnosticTest(selectedPatientId, selectedTestName);
    }
  };

  const handleSaveResult = (orderId: string) => {
    if (customResult.trim()) {
      recordDiagnosticResult(orderId, customResult.trim());
      setEnteringResultOrderId(null);
      setCustomResult("");
    }
  };

  const availableTests = diagnostics.filter((d) => d.availability === "Available");
  const unavailableTests = diagnostics.filter((d) => d.availability !== "Available");

  return (
    <div className="flex flex-col gap-6">
      {/* Test Availability Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Available at PHC */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-extrabold text-slate-900">
                Tests Available at Dhadgaon PHC
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
              {availableTests.length} In-House
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {availableTests.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-2.5 bg-emerald-50/40 rounded-xl border border-emerald-100 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800 block">{t.name}</span>
                  <span className="text-[10px] text-slate-500">{t.category} · Turnaround: {t.averageTurnaroundHours} hrs</span>
                </div>
                <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Ready</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Unavailable at PHC (Requires DH Referral) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <h3 className="text-sm font-extrabold text-slate-900">
                Unavailable Tests (District Referral Required)
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-100 text-red-800">
              {unavailableTests.length} Deficit
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {unavailableTests.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-2.5 bg-red-50/40 rounded-xl border border-red-100 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800 block">{t.name}</span>
                  <span className="text-[10px] text-red-700 font-medium">Status: {t.availability}</span>
                </div>
                <span className="text-red-700 font-bold flex items-center gap-1 text-[11px]">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Refer DH</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lab Order Creation & Pending Results Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              PHC Laboratory Worklist & Diagnostic Results
            </h2>
            <p className="text-xs text-slate-500">
              Track sample collection, pending tests, and record clinical lab values
            </p>
          </div>

          {/* Quick Order Inline Form */}
          <form onSubmit={handleOrder} className="flex items-center gap-2 flex-wrap text-xs">
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.token || "OPD"})
                </option>
              ))}
            </select>

            <select
              value={selectedTestName}
              onChange={(e) => setSelectedTestName(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
            >
              {availableTests.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold flex items-center gap-1 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Order Test</span>
            </button>
          </form>
        </div>

        {/* Diagnostic Orders List */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Test Requested</th>
                <th className="py-3 px-4">Ordered By / Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Clinical Result</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {diagnosticOrders.map((order) => {
                const isCompleted = order.status === "Completed";
                return (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{order.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{order.patientName}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{order.testName}</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {order.orderedBy ? `${order.orderedBy} · ` : ""}{order.orderDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800 animate-pulse"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {isCompleted ? (
                        <div>
                          <strong className="text-slate-900 font-bold">{order.result}</strong>
                          {order.referenceRange && (
                            <span className="text-[10px] text-slate-400 block">
                              Ref: {order.referenceRange}
                            </span>
                          )}
                        </div>
                      ) : enteringResultOrderId === order.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="Enter result..."
                            value={customResult}
                            onChange={(e) => setCustomResult(e.target.value)}
                            className="p-1 rounded border border-slate-300 text-xs w-28 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveResult(order.id)}
                            className="px-2 py-1 bg-emerald-700 text-white rounded text-[11px] font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Awaiting lab run</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {!isCompleted && enteringResultOrderId !== order.id && (
                        <button
                          type="button"
                          onClick={() => {
                            setEnteringResultOrderId(order.id);
                            setCustomResult("");
                          }}
                          className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 rounded-lg font-bold text-[11px] transition-colors"
                        >
                          Record Result
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
