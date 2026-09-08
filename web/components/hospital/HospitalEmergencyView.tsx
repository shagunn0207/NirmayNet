"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge, ReferralStatusBadge } from "@/components/common/Badge";
import { ReferralStatus } from "@/lib/healthcareData";
import {
  Ambulance,
  AlertOctagon,
  HeartPulse,
  Clock,
  Bed,
  UserCheck,
  Building2,
  CheckCircle2,
  Phone,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export const HospitalEmergencyView: React.FC = () => {
  const {
    hospitalReferrals,
    updateHospitalReferralStatus,
    facilityStatus,
    specialists,
    showToast,
  } = useHealthcare();

  const [selectedSpecialist, setSelectedSpecialist] = useState(
    specialists[0]?.name || "Dr. Neelam Joshi"
  );

  // All emergency referrals
  const emergencyReferrals = hospitalReferrals.filter(
    (r) => r.priority === "EMERGENCY"
  );

  // In-transit ambulance transfers
  const activeTransits = emergencyReferrals.filter(
    (r) => r.ambulanceRequested && r.status !== "COMPLETED"
  );

  const handleConfirmArrival = (id: string) => {
    updateHospitalReferralStatus(
      id,
      "PATIENT ARRIVED",
      "Casualty arrival confirmed by triage nurse. Patient wheeled into Emergency Bay.",
      selectedSpecialist
    );
    showToast(
      "Casualty Arrival Confirmed",
      `Referral #${id} checked in at Nandurbar DH Casualty. Specialist alerted.`,
      "success"
    );
  };

  const handleAdmitHDU = (id: string) => {
    updateHospitalReferralStatus(
      id,
      "ASSIGNED",
      "Admitted directly into Emergency HDU/ICU. Protocol active.",
      selectedSpecialist
    );
    showToast(
      "Admitted to HDU / ICU",
      `Patient fast-tracked to High Dependency Unit under ${selectedSpecialist}.`,
      "info"
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* High-Impact Casualty Header */}
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-slate-900 text-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0">
            <AlertOctagon className="w-7 h-7 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-red-900/60 border border-red-400/40 text-red-200 text-[10px] font-black uppercase tracking-wider">
                DISTRICT CASUALTY COMMAND
              </span>
              <span className="text-red-200 text-xs font-semibold">24/7 Red Alert Desk</span>
            </div>
            <h2 className="text-xl font-black mt-0.5">
              District Hospital Emergency & Critical Intake
            </h2>
            <p className="text-xs text-red-100 mt-0.5">
              Rapid intake coordination for rural PHC 108 transfers, casualty triage, and ICU bed allocations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3.5 py-2 bg-white/10 rounded-xl border border-white/20 text-center">
            <span className="text-[10px] uppercase font-bold text-red-200 block">Emergency HDU Free</span>
            <span className="text-base font-black text-white">{facilityStatus.emergencyBedsAvailable} Beds</span>
          </div>
          <div className="px-3.5 py-2 bg-white/10 rounded-xl border border-white/20 text-center">
            <span className="text-[10px] uppercase font-bold text-red-200 block">ICU Free</span>
            <span className="text-base font-black text-white">{facilityStatus.icuBedsAvailable} Beds</span>
          </div>
        </div>
      </div>

      {/* Live Incoming 108 Transits Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Ambulance className="w-5 h-5 text-red-600 animate-bounce" />
            <h3 className="text-base font-extrabold text-slate-900">
              Live Inbound 108 Emergency Ambulance Transits
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-100 text-red-800">
            {activeTransits.length} Vehicles In Transit
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeTransits.map((ref) => (
            <div
              key={ref.id}
              className="p-4 rounded-xl border-2 border-red-200 bg-red-50/30 flex flex-col justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-black text-sm text-slate-900">
                    {ref.patientName} ({ref.age}y, {ref.sex})
                  </span>
                  <UrgencyBadge priority="EMERGENCY" size="sm" />
                </div>

                <p className="font-extrabold text-red-950 mb-1">
                  {ref.reason}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-red-100">
                  <span>Origin: <strong>{ref.referringFacility}</strong></span>
                  <span>Target: <strong>{ref.department}</strong></span>
                </div>

                <div className="mt-2.5 p-2.5 bg-white rounded-lg border border-red-200 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-slate-800 block">
                      108 Vehicle: {ref.vehicleNumber || "MH-39-AM-1081"}
                    </span>
                    <span className="text-slate-500">
                      Driver: {ref.driverContact || "Santosh Gavit"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-red-700 block">ETA</span>
                    <span className="font-black text-red-700 text-sm">{ref.ambulanceEta || "15 mins"}</span>
                  </div>
                </div>
              </div>

              {/* Fast-Track Actions */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <ReferralStatusBadge status={ref.status} size="sm" />

                {ref.status !== "PATIENT ARRIVED" && ref.status !== "ASSIGNED" && (
                  <button
                    type="button"
                    onClick={() => handleConfirmArrival(ref.id)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Casualty Arrival</span>
                  </button>
                )}

                {ref.status === "PATIENT ARRIVED" && (
                  <button
                    type="button"
                    onClick={() => handleAdmitHDU(ref.id)}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                  >
                    <Bed className="w-3.5 h-3.5" />
                    <span>Admit to HDU</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Registry Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Emergency Case Directory & Bed Allocation
            </h3>
            <p className="text-xs text-slate-500">
              All red priority admissions categorized by clinical specialty and specialist duty assignments
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-600">Assign On-Call Specialist:</span>
            <select
              value={selectedSpecialist}
              onChange={(e) => setSelectedSpecialist(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 font-bold text-slate-800 bg-slate-50 text-xs"
            >
              {specialists.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.department}) - {s.status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Referral ID</th>
                <th className="py-3 px-4">Emergency Patient</th>
                <th className="py-3 px-4">Origin Facility</th>
                <th className="py-3 px-4">Required Department</th>
                <th className="py-3 px-4">Assigned Specialist</th>
                <th className="py-3 px-4">Current Vitals</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Casualty Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {emergencyReferrals.map((r) => (
                <tr key={r.id} className="hover:bg-red-50/30 transition-colors">
                  <td className="py-3.5 px-4 font-black text-slate-900">{r.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900 text-sm">{r.patientName}</div>
                    <div className="text-slate-500 text-[11px]">
                      {r.age} yrs · {r.sex}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{r.referringFacility}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-semibold">{r.department}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {r.assignedDoctor || selectedSpecialist}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-slate-700">
                    <div>BP: <strong className="text-red-700">{r.vitals.bp}</strong></div>
                    <div>PR: {r.vitals.pulse} · SpO2: {r.vitals.spo2}%</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <ReferralStatusBadge status={r.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {r.status === "SENT" || r.status === "RECEIVED" ? (
                      <button
                        type="button"
                        onClick={() => handleConfirmArrival(r.id)}
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs transition-colors"
                      >
                        Confirm Arrival
                      </button>
                    ) : r.status === "PATIENT ARRIVED" ? (
                      <button
                        type="button"
                        onClick={() => handleAdmitHDU(r.id)}
                        className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold text-xs transition-colors"
                      >
                        Admit HDU
                      </button>
                    ) : (
                      <span className="text-slate-400 font-medium">In Care</span>
                    )}
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
