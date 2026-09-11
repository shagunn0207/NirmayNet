"use client";

import React from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge, ReferralStatusBadge } from "@/components/common/Badge";
import {
  Building2,
  AlertOctagon,
  Bed,
  UserCheck,
  Ambulance,
  ChevronRight,
} from "lucide-react";

interface HospitalDashboardViewProps {
  onNavigateTab: (tabId: string) => void;
  onSelectReferral: (referralId: string) => void;
}

export const HospitalDashboardView: React.FC<HospitalDashboardViewProps> = ({
  onNavigateTab,
  onSelectReferral,
}) => {
  const { hospitalReferrals, specialists, facilityStatus } = useHealthcare();

  const emergencyReferrals = hospitalReferrals.filter(
    (r) => r.priority === "EMERGENCY" && r.status !== "COMPLETED"
  );
  
  const incomingPhcReferrals = hospitalReferrals.filter(
    (r) => r.status === "SENT" || r.status === "RECEIVED"
  );
  
  const inTransitAmbulances = hospitalReferrals.filter(
    (r) => r.ambulanceRequested && (r.ambulanceStatus === "In Transit" || r.ambulanceStatus === "Dispatched")
  );

  const availableSpecialistsCount = specialists.filter(
    (s) => s.status === "Available"
  ).length;

  const totalBeds =
    facilityStatus.icuTotal +
    facilityStatus.maternityTotal +
    facilityStatus.emergencyTotal +
    facilityStatus.generalTotal;

  const availableBeds =
    facilityStatus.icuBedsAvailable +
    facilityStatus.maternityBedsAvailable +
    facilityStatus.emergencyBedsAvailable +
    facilityStatus.generalBedsAvailable;

  const primaryEmergency = emergencyReferrals[0];

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-950 rounded-3xl p-4 sm:px-6 sm:py-4 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold">Casualty Coordination Active</h2>
            <p className="text-xs text-blue-300">Receiving PHC referrals & 108 Ambulances</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
          <button
            onClick={() => onNavigateTab("facility")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-xs font-bold rounded-xl transition-colors"
          >
            <Bed className="w-4 h-4 text-blue-300" />
            <span>{availableBeds}/{totalBeds} Beds Free</span>
          </button>
          <button
            onClick={() => onNavigateTab("specialists")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-xs font-bold rounded-xl transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            <span>{availableSpecialistsCount} Specialists Duty</span>
          </button>
        </div>
      </div>

      {/* Critical Alerts (Only shows if there are alerts) */}
      {(primaryEmergency || inTransitAmbulances.length > 0) && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Inbound Emergencies</h3>
          <div className="flex flex-col gap-3">
            {primaryEmergency && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center shrink-0">
                    <Ambulance className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-red-950">{primaryEmergency.patientName}</span>
                      <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">Level 1 Trauma</span>
                    </div>
                    <p className="text-xs text-red-900 font-medium mt-0.5">
                      Incoming from {primaryEmergency.referringFacility} · ETA: {primaryEmergency.ambulanceEta || "20 mins"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onSelectReferral(primaryEmergency.id)}
                  className="px-4 py-2 bg-red-700 text-white border border-red-800 hover:bg-red-800 rounded-xl text-xs font-bold transition-colors whitespace-nowrap self-stretch sm:self-auto flex items-center gap-2"
                >
                  <span>Prepare Casualty</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Table Area: Incoming Referrals Queue */}
      <div className="bg-white rounded-3xl overflow-hidden pt-2 flex flex-col flex-1 min-h-0 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        {/* Toolbar */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">Incoming PHC Referral Admissions</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{incomingPhcReferrals.length} patients awaiting hospital review</p>
          </div>
          <button
            onClick={() => onNavigateTab("referrals")}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span>Manage All Transfers</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto flex-1 px-2 sm:px-6 pb-6">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold capitalize">
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Department & Reason</th>
                <th className="px-6 py-4">Referring PHC</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomingPhcReferrals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No incoming referrals at the moment.
                  </td>
                </tr>
              ) : (
                incomingPhcReferrals.map((ref) => (
                  <tr
                    key={ref.id}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          {ref.patientName}
                          <UrgencyBadge priority={ref.priority} />
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5">
                          {ref.age} yrs · {ref.sex}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[250px]">
                          {ref.department}
                        </span>
                        <span className="text-xs text-slate-500 truncate max-w-[250px] mt-0.5">
                          {ref.reason}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">
                          {ref.referringFacility}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          {ref.timestamp}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ReferralStatusBadge status={ref.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectReferral(ref.id)}
                        className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>Process</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
