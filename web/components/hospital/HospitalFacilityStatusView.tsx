"use client";

import React from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import {
  Bed,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Minus,
  Zap,
  Droplet,
} from "lucide-react";

export const HospitalFacilityStatusView: React.FC = () => {
  const { facilityStatus, updateBedAvailability, toggleEquipmentStatus } =
    useHealthcare();

  const bedCards = [
    {
      id: "icu" as const,
      name: "Intensive Care Unit (ICU)",
      available: facilityStatus.icuBedsAvailable,
      total: facilityStatus.icuTotal,
      color: "border-red-200 bg-red-50/40 text-red-950",
      accent: "text-red-700",
    },
    {
      id: "maternity" as const,
      name: "Maternity & Labor Ward (SNCU)",
      available: facilityStatus.maternityBedsAvailable,
      total: facilityStatus.maternityTotal,
      color: "border-purple-200 bg-purple-50/40 text-purple-950",
      accent: "text-purple-700",
    },
    {
      id: "emergency" as const,
      name: "Emergency Casualty / HDU",
      available: facilityStatus.emergencyBedsAvailable,
      total: facilityStatus.emergencyTotal,
      color: "border-amber-200 bg-amber-50/40 text-amber-950",
      accent: "text-amber-700",
    },
    {
      id: "general" as const,
      name: "General Inpatient Wards",
      available: facilityStatus.generalBedsAvailable,
      total: facilityStatus.generalTotal,
      color: "border-teal-200 bg-teal-50/40 text-teal-950",
      accent: "text-teal-700",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Bed Capacity Management */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="pb-3 border-b border-slate-100 mb-4">
          <h2 className="text-base font-extrabold text-slate-900">
            District Civil Hospital Bed Capacity Management
          </h2>
          <p className="text-xs text-slate-500">
            Real-time occupancy and bed availability tracking for incoming rural PHC transfers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bedCards.map((bed) => {
            const occupancyPercent = Math.round(
              ((bed.total - bed.available) / bed.total) * 100
            );
            return (
              <div
                key={bed.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${bed.color}`}
              >
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider block mb-1">
                    {bed.name}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">
                      {bed.available}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      free of {bed.total} total
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full ${
                        occupancyPercent > 85 ? "bg-red-600" : "bg-blue-600"
                      }`}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {occupancyPercent}% Occupancy
                  </span>
                </div>

                {/* Adjust Stepper */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] font-bold text-slate-700">Adjust Free:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateBedAvailability(bed.id, -1)}
                      disabled={bed.available <= 0}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-black text-slate-800 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 shadow-2xs"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateBedAvailability(bed.id, 1)}
                      disabled={bed.available >= bed.total}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-black text-slate-800 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Equipment, Diagnostics & Blood Bank Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Critical Equipment & Infrastructure */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              Critical Infrastructure & Life Support
            </h3>
            <p className="text-xs text-slate-500">Operational status of key life-saving utilities</p>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            {/* Oxygen */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">
                    PSA Medical Oxygen Generation Plant
                  </span>
                  <span className="text-[11px] text-slate-500">
                    500 LPM output · Purity 94.2% · Piped to all ICU/HDU beds
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleEquipmentStatus("oxygen")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  facilityStatus.oxygenPlantOperational
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                {facilityStatus.oxygenPlantOperational ? "Operational" : "Offline / Fault"}
              </button>
            </div>

            {/* CT Scan */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">
                    128-Slice Digital CT Scanner
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Trauma & acute stroke imaging ready
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleEquipmentStatus("ct")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  facilityStatus.ctScanOperational
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                {facilityStatus.ctScanOperational ? "Operational" : "Calibrating"}
              </button>
            </div>

            {/* Digital X-Ray */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">
                    Fixed Digital X-Ray (500mA)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Orthopedic & trauma unit online
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleEquipmentStatus("xray")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  facilityStatus.xrayOperational
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                {facilityStatus.xrayOperational ? "Operational" : "Offline"}
              </button>
            </div>
          </div>
        </div>

        {/* Blood Bank & Pharmacy */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-extrabold text-slate-900">
                Blood Storage Center & Emergency Stock
              </h3>
              <p className="text-xs text-slate-500">
                Blood component units ready for emergency obstetric & trauma transfers
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-center">
                <span className="text-[10px] uppercase font-bold text-red-700 block">
                  O Positive (O+) PRBC
                </span>
                <span className="text-2xl font-black text-red-950">
                  {facilityStatus.bloodBankUnitsOpos} Units
                </span>
                <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                  ✓ Safe Reserve
                </span>
              </div>

              <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-center">
                <span className="text-[10px] uppercase font-bold text-red-700 block">
                  O Negative (O-) Universal
                </span>
                <span className="text-2xl font-black text-red-950">
                  {facilityStatus.bloodBankUnitsOneg} Units
                </span>
                <span className="text-[10px] text-amber-700 font-bold block mt-0.5">
                  ⚠ Low Reserve
                </span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs">
              <span className="font-bold text-blue-950 block mb-1">
                Hospital Pharmacy Status
              </span>
              <p className="text-slate-700 leading-relaxed">
                Emergency antivenom (35 vials), IV fluids (250 bottles), Obstetric magnesium sulfate, and blood transfusion sets are fully stocked for 24/7 casualty intake.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
