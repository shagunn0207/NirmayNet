"use client";

import React from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import {
  Bed,
  Activity,
  Zap,
  Droplet,
  Minus,
  Plus,
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
      color: "bg-red-50/50 border-red-100",
      accent: "text-red-700",
      bar: "bg-red-500",
    },
    {
      id: "maternity" as const,
      name: "Maternity & Labor (SNCU)",
      available: facilityStatus.maternityBedsAvailable,
      total: facilityStatus.maternityTotal,
      color: "bg-purple-50/50 border-purple-100",
      accent: "text-purple-700",
      bar: "bg-purple-500",
    },
    {
      id: "emergency" as const,
      name: "Emergency Casualty / HDU",
      available: facilityStatus.emergencyBedsAvailable,
      total: facilityStatus.emergencyTotal,
      color: "bg-amber-50/50 border-amber-100",
      accent: "text-amber-700",
      bar: "bg-amber-500",
    },
    {
      id: "general" as const,
      name: "General Inpatient Wards",
      available: facilityStatus.generalBedsAvailable,
      total: facilityStatus.generalTotal,
      color: "bg-teal-50/50 border-teal-100",
      accent: "text-teal-700",
      bar: "bg-teal-500",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Bed Capacity Management */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Bed className="w-5 h-5 text-blue-600" />
              Bed Capacity Management
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Real-time occupancy and bed availability tracking
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Ward / Department</th>
                <th className="px-6 py-4">Occupancy Status</th>
                <th className="px-6 py-4 text-center">Available Beds</th>
                <th className="px-6 py-4 text-right">Manage Free Beds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bedCards.map((bed) => {
                const occupancyPercent = Math.round(((bed.total - bed.available) / bed.total) * 100);
                
                return (
                  <tr key={bed.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Ward Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-8 rounded-full ${bed.bar}`} />
                        <span className="text-sm font-extrabold text-slate-900">{bed.name}</span>
                      </div>
                    </td>

                    {/* Occupancy Bar */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 w-48">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500">
                          <span>{occupancyPercent}% Occupied</span>
                          <span>{bed.total - bed.available} / {bed.total}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${occupancyPercent > 85 ? "bg-red-500" : bed.bar}`}
                            style={{ width: `${occupancyPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Available Beds */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center min-w-[3rem] h-8 px-3 rounded-lg border text-sm font-black ${bed.color} ${bed.accent}`}>
                        {bed.available}
                      </span>
                    </td>

                    {/* Manage Controls */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => updateBedAvailability(bed.id, -1)}
                          disabled={bed.available <= 0}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <select
                          value={bed.available}
                          onChange={(e) => {
                            const newAvailable = parseInt(e.target.value, 10);
                            const difference = newAvailable - bed.available;
                            updateBedAvailability(bed.id, difference);
                          }}
                          className="h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                          {Array.from({ length: bed.total + 1 }, (_, i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => updateBedAvailability(bed.id, 1)}
                          disabled={bed.available >= bed.total}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unified Resources Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Hospital Resources & Critical Infrastructure
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Operational status of life-saving utilities and blood bank reserves
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Resource / Equipment</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4 text-right">System Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* Oxygen */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-extrabold text-slate-900">PSA Oxygen Plant</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-slate-500">500 LPM output · Purity 94.2% · Piped to ICU</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <label className="relative inline-flex items-center justify-end cursor-pointer">
                    <span className="mr-3 text-xs font-bold text-slate-700 w-16 text-right">
                      {facilityStatus.oxygenPlantOperational ? "Online" : "Offline"}
                    </span>
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={facilityStatus.oxygenPlantOperational}
                      onChange={() => toggleEquipmentStatus("oxygen")}
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </td>
              </tr>

              {/* CT Scan */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                      <Activity className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-extrabold text-slate-900">128-Slice Digital CT</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-slate-500">Trauma & acute stroke imaging ready</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <label className="relative inline-flex items-center justify-end cursor-pointer">
                    <span className="mr-3 text-xs font-bold text-slate-700 w-16 text-right">
                      {facilityStatus.ctScanOperational ? "Online" : "Offline"}
                    </span>
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={facilityStatus.ctScanOperational}
                      onChange={() => toggleEquipmentStatus("ct")}
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </td>
              </tr>

              {/* Digital X-Ray */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
                      <Activity className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-extrabold text-slate-900">Digital X-Ray (500mA)</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-slate-500">Orthopedic & trauma unit</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <label className="relative inline-flex items-center justify-end cursor-pointer">
                    <span className="mr-3 text-xs font-bold text-slate-700 w-16 text-right">
                      {facilityStatus.xrayOperational ? "Online" : "Offline"}
                    </span>
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={facilityStatus.xrayOperational}
                      onChange={() => toggleEquipmentStatus("xray")}
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </td>
              </tr>

              {/* Blood Bank O+ */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center">
                      <Droplet className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-extrabold text-slate-900">O Positive (O+) PRBC</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-slate-500">Ready for emergency obstetric & trauma transfers</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center justify-center h-8 px-3 rounded-lg border bg-slate-50 text-slate-800 border-slate-200 text-sm font-black">
                    {facilityStatus.bloodBankUnitsOpos} Units
                  </span>
                </td>
              </tr>

              {/* Blood Bank O- */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center">
                      <Droplet className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-extrabold text-slate-900">O Negative (O-) Universal</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-slate-500">Universal donor reserve</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center justify-center h-8 px-3 rounded-lg border bg-amber-50 text-amber-800 border-amber-200 text-sm font-black">
                    {facilityStatus.bloodBankUnitsOneg} Units
                  </span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
