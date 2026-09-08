"use client";

import React from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { Building2, Bed, AlertOctagon, CheckCircle2, Clock, Users, Zap } from "lucide-react";

export const DHOHospitalPerformanceView: React.FC = () => {
  const { hospitalReferrals, facilityStatus } = useHealthcare();

  const hospitalData = [
    {
      id: "DH-01",
      name: "District Civil Hospital, Nandurbar",
      type: "District Hospital (Secondary & Tertiary Referral)",
      patientsToday: 342,
      emergencyCases: hospitalReferrals.filter(
        (r) => r.destinationFacility.includes("Nandurbar") && r.priority === "EMERGENCY"
      ).length,
      referralsReceived: hospitalReferrals.filter((r) =>
        r.destinationFacility.includes("Nandurbar")
      ).length,
      referralsCompleted: hospitalReferrals.filter(
        (r) => r.destinationFacility.includes("Nandurbar") && r.status === "COMPLETED"
      ).length,
      avgWaitTime: "24 mins",
      capacityUtilization: 82,
      bedsAvailable: facilityStatus.icuBedsAvailable + facilityStatus.maternityBedsAvailable + facilityStatus.emergencyBedsAvailable + facilityStatus.generalBedsAvailable,
      bedsTotal: 126,
      icuFree: facilityStatus.icuBedsAvailable,
      oxygenPlant: facilityStatus.oxygenPlantOperational,
    },
    {
      id: "SDH-02",
      name: "Sub-District Hospital, Shahada",
      type: "Sub-District Hospital (100 Bedded First Referral Unit)",
      patientsToday: 218,
      emergencyCases: 2,
      referralsReceived: hospitalReferrals.filter((r) =>
        r.destinationFacility.includes("Shahada")
      ).length,
      referralsCompleted: 1,
      avgWaitTime: "19 mins",
      capacityUtilization: 68,
      bedsAvailable: 34,
      bedsTotal: 100,
      icuFree: 2,
      oxygenPlant: true,
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div className="pb-4 border-b border-slate-100">
        <h2 className="text-lg font-extrabold text-slate-900">
          Secondary & Tertiary District Hospital Operations
        </h2>
        <p className="text-xs text-slate-500">
          Monitoring capacity, casualty absorption, and specialist care delivery at First Referral Units (FRUs)
        </p>
      </div>

      {/* Hospital Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {hospitalData.map((h) => (
          <div
            key={h.id}
            className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-800 text-white flex items-center justify-center font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                      {h.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{h.type}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900">
                  FRU Active
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Patients Today
                  </span>
                  <span className="text-xl font-black text-slate-900">
                    {h.patientsToday}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-red-600 block">
                    Emergency Cases
                  </span>
                  <span className="text-xl font-black text-red-700">
                    {h.emergencyCases}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Referrals Received
                  </span>
                  <span className="text-xl font-black text-blue-900">
                    {h.referralsReceived}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                    Completed Discharges
                  </span>
                  <span className="text-xl font-black text-emerald-800">
                    {h.referralsCompleted}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Casualty Avg Wait
                  </span>
                  <span className="text-xl font-black text-slate-800">
                    {h.avgWaitTime}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Free ICU Beds
                  </span>
                  <span className="text-xl font-black text-purple-900">
                    {h.icuFree}
                  </span>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                  <span>Bed Utilization: {h.capacityUtilization}%</span>
                  <span className="text-slate-500">
                    {h.bedsAvailable} available / {h.bedsTotal} total
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-700 h-full rounded-full"
                    style={{ width: `${h.capacityUtilization}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <Zap className="w-3.5 h-3.5" />
                <span>Oxygen Generation Plant: {h.oxygenPlant ? "Operational" : "Fault"}</span>
              </span>
              <span>24/7 OT & Labor Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
