"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge, ReferralStatusBadge } from "@/components/common/Badge";
import {
  Send,
  Building2,
  Ambulance,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  MapPin,
} from "lucide-react";

interface PHCReferralsViewProps {
  onOpenCreateReferral: () => void;
}

export const PHCReferralsView: React.FC<PHCReferralsViewProps> = ({
  onOpenCreateReferral,
}) => {
  const { hospitalReferrals } = useHealthcare();
  const [filter, setFilter] = useState<string>("ALL");

  const myReferrals = hospitalReferrals.filter(
    (r) => r.referringFacility === "PHC Dhadgaon" || filter === "ALL"
  );

  const displayedReferrals = myReferrals.filter((r) => {
    if (filter === "ALL") return true;
    if (filter === "ACTIVE") return r.status !== "COMPLETED";
    if (filter === "COMPLETED") return r.status === "COMPLETED";
    if (filter === "EMERGENCY") return r.priority === "EMERGENCY";
    return true;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900">
              District Referral Management & Transit Tracker
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-900">
              {myReferrals.filter((r) => r.status !== "COMPLETED").length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status tracking for patients transferred to Nandurbar Civil Hospital & Shahada SDH
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateReferral}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Emergency Referral</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 text-xs">
        {(["ALL", "ACTIVE", "EMERGENCY", "COMPLETED"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              filter === tab
                ? "bg-teal-700 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Referral Workflow Pathway Breadcrumb Description */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between overflow-x-auto gap-3 text-slate-600 font-semibold">
        <span className="shrink-0 text-slate-800 font-bold">Workflow Chain:</span>
        <span className="shrink-0 text-blue-700 font-bold">1. SENT</span>
        <span>→</span>
        <span className="shrink-0 text-sky-700 font-bold">2. RECEIVED</span>
        <span>→</span>
        <span className="shrink-0 text-teal-700 font-bold">3. ACCEPTED</span>
        <span>→</span>
        <span className="shrink-0 text-purple-700 font-bold">4. PATIENT ARRIVED</span>
        <span>→</span>
        <span className="shrink-0 text-indigo-700 font-bold">5. ASSIGNED / CONSULTED</span>
        <span>→</span>
        <span className="shrink-0 text-emerald-700 font-bold">6. COMPLETED</span>
      </div>

      {/* Referral Cards */}
      <div className="flex flex-col gap-4">
        {displayedReferrals.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No referral records found under the current filter.
          </div>
        ) : (
          displayedReferrals.map((ref) => {
            const isEmergency = ref.priority === "EMERGENCY";
            return (
              <div
                key={ref.id}
                className={`rounded-2xl border p-5 flex flex-col gap-4 transition-all ${
                  isEmergency
                    ? "border-red-300 bg-red-50/30 shadow-xs"
                    : "border-slate-200 bg-white"
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 font-black text-xs flex items-center justify-center shrink-0">
                      {ref.id.split("-")[2] || "REF"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-extrabold text-slate-900">
                          {ref.patientName}
                        </h3>
                        <span className="text-xs text-slate-500 font-semibold">
                          ({ref.age}y, {ref.sex})
                        </span>
                        <UrgencyBadge priority={ref.priority} size="sm" />
                        <ReferralStatusBadge status={ref.status} size="sm" />
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Referral ID: <strong className="text-slate-700">{ref.id}</strong> · Dispatched: {ref.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    <div className="text-xs">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Destination</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 justify-end">
                        <Building2 className="w-3.5 h-3.5 text-blue-700" />
                        {ref.destinationFacility}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Column 1: Clinical Reason */}
                  <div className="md:col-span-2">
                    <h4 className="font-bold text-slate-700 uppercase text-[10px] tracking-wider mb-1">
                      Department & Referral Reason
                    </h4>
                    <p className="font-extrabold text-slate-900 text-sm mb-1.5">
                      {ref.department} — {ref.reason}
                    </p>
                    <p className="text-slate-600 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                      {ref.clinicalSummary}
                    </p>
                  </div>

                  {/* Column 2: Ambulance Transit & Hospital Feedback */}
                  <div className="flex flex-col gap-2.5">
                    {/* Ambulance Card */}
                    {ref.ambulanceRequested && (
                      <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                          <span className="flex items-center gap-1 text-red-700">
                            <Ambulance className="w-4 h-4 text-red-600" />
                            108 Ambulance Status
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-800">
                            {ref.ambulanceStatus || "In Transit"}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 space-y-0.5 mt-1">
                          <p>Vehicle: <strong>{ref.vehicleNumber || "MH-39-AM-1081"}</strong></p>
                          <p>Driver: <strong>{ref.driverContact || "Santosh Gavit"}</strong></p>
                          <p className="text-red-700 font-extrabold">Estimated ETA: {ref.ambulanceEta || "25 mins"}</p>
                        </div>
                      </div>
                    )}

                    {/* Hospital Feedback Note */}
                    {ref.hospitalNotes && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                        <span className="font-bold block text-[10px] uppercase text-blue-700 mb-0.5">
                          District Hospital Notes:
                        </span>
                        <p className="leading-relaxed">{ref.hospitalNotes}</p>
                        {ref.assignedDoctor && (
                          <p className="mt-1 text-[11px] font-bold text-blue-950">
                            Attending Specialist: {ref.assignedDoctor}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
