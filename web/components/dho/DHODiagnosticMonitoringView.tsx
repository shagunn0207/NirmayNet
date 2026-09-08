"use client";

import React from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { FlaskConical, CheckCircle2, XCircle, AlertTriangle, Activity, Wrench } from "lucide-react";

export const DHODiagnosticMonitoringView: React.FC = () => {
  const { diagnostics, phcMetrics } = useHealthcare();

  const shortages = [
    {
      facility: "PHC Dhadgaon",
      equipment: "12-Lead Electrocardiogram (ECG)",
      issue: "Lead calibration error / Probe damaged",
      status: "Service Engineer Assigned",
      daysDown: 4,
      impact: "Cardiac and chest pain cases requiring emergency transfer to Nandurbar DH",
    },
    {
      facility: "PHC Khapar",
      equipment: "Semi-Automated Biochemistry Analyzer",
      issue: "Reagent pack expired",
      status: "Reagents Dispatched",
      daysDown: 2,
      impact: "Liver and renal function test delay",
    },
    {
      facility: "PHC Toranmal",
      equipment: "Centrifuge Machine",
      issue: "Motor vibration failure",
      status: "Replacement Unit Approved",
      daysDown: 6,
      impact: "Blood cross-matching and serum separation",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Alert Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="pb-3 border-b border-slate-100 mb-4">
          <h2 className="text-base font-extrabold text-slate-900">
            District Diagnostic Network & Equipment Uptime
          </h2>
          <p className="text-xs text-slate-500">
            Monitoring pathology tests, point-of-care rapid diagnostics, and radiology equipment downtime
          </p>
        </div>

        {/* Diagnostic Availability by Test Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
            <span className="font-extrabold text-emerald-950 block text-sm mb-1">
              Point-of-Care Rapid Kits
            </span>
            <span className="text-2xl font-black text-emerald-800">96.4%</span>
            <p className="text-slate-600 text-[11px] mt-1">
              Malaria RDT, Urine Albumin, Rapid Pregnancy & HIV kits available across all 18 PHCs.
            </p>
          </div>

          <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200">
            <span className="font-extrabold text-blue-950 block text-sm mb-1">
              Primary Pathology (Hb & Glucose)
            </span>
            <span className="text-2xl font-black text-blue-800">89.2%</span>
            <p className="text-slate-600 text-[11px] mt-1">
              Hemocue & digital glucometers functional. Microcuvette inventory verified.
            </p>
          </div>

          <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200">
            <span className="font-extrabold text-amber-950 block text-sm mb-1">
              Biomedical Equipment Uptime
            </span>
            <span className="text-2xl font-black text-amber-800">65.6%</span>
            <p className="text-slate-600 text-[11px] mt-1">
              3 rural PHCs have active equipment breakdown tickets with biomedical AMC engineers.
            </p>
          </div>
        </div>
      </div>

      {/* Facilities with Shortages / Breakdown Tickets */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Active Biomedical Equipment Breakdown Tickets
            </h3>
            <p className="text-xs text-slate-500">
              Contractor SLA monitoring for repair and calibration
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
            {shortages.length} Active Tickets
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Facility</th>
                <th className="py-3 px-4">Equipment / Test</th>
                <th className="py-3 px-4">Specific Defect / Issue</th>
                <th className="py-3 px-4">Days Down</th>
                <th className="py-3 px-4">Clinical Impact</th>
                <th className="py-3 px-4">SLA Resolution Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shortages.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-black text-slate-900">{item.facility}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{item.equipment}</td>
                  <td className="py-3.5 px-4 text-slate-600">{item.issue}</td>
                  <td className="py-3.5 px-4 font-extrabold text-red-700">{item.daysDown} days</td>
                  <td className="py-3.5 px-4 text-slate-700 max-w-xs">{item.impact}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
