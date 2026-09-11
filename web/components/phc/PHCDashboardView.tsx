"use client";

import React from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge } from "@/components/common/Badge";
import {
  AlertOctagon,
  HeartPulse,
  Send,
  Pill,
  Clock,
  ArrowRight,
  Stethoscope,
} from "lucide-react";

interface PHCDashboardViewProps {
  onNavigateTab: (tabId: string) => void;
  onOpenConsultation: (patientId: string) => void;
  onOpenReferralModal: (patientId?: string) => void;
}

export const PHCDashboardView: React.FC<PHCDashboardViewProps> = ({
  onNavigateTab,
  onOpenConsultation,
  onOpenReferralModal,
}) => {
  const { patients, ashaReferrals } = useHealthcare();

  const waitingPatients = patients.filter((p) => p.currentStatus === "Waiting");
  const emergencyCases = patients.filter(
    (p) => (p.triagePriority === "EMERGENCY" || p.triagePriority === "URGENT") && p.currentStatus !== "Completed"
  );
  const pendingAsha = ashaReferrals.filter((r) => r.status === "Pending Review");

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900 rounded-3xl p-4 sm:px-6 sm:py-4 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold">Ready for Consultations</h2>
            <p className="text-xs text-slate-400">Currently serving the OPD Queue</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
          <button
            onClick={() => onNavigateTab("inventory")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            <Pill className="w-4 h-4 text-slate-300" />
            <span>Drug Indent</span>
          </button>
          <button
            onClick={() => onOpenReferralModal()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded-xl transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Refer to DH</span>
          </button>
        </div>
      </div>

      {/* Critical Alerts (Only shows if there are alerts) */}
      {(emergencyCases.length > 0 || pendingAsha.length > 0) && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Critical Alerts</h3>
          <div className="flex flex-col gap-3">
            {emergencyCases.map((patient) => {
              const isUrgent = patient.triagePriority === "URGENT";
              return (
              <div key={patient.id} className={`${isUrgent ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'} border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isUrgent ? 'bg-amber-100' : 'bg-red-100'}`}>
                    <AlertOctagon className={`w-6 h-6 ${isUrgent ? 'text-amber-600' : 'text-red-600 animate-pulse'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{patient.name}</span>
                      <UrgencyBadge priority={patient.triagePriority} />
                    </div>
                    <p className={`text-xs font-medium mt-0.5 ${isUrgent ? 'text-amber-900' : 'text-red-900'}`}>{patient.visitReason}</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab("emergency")}
                  className={`px-4 py-2 bg-white border hover:bg-opacity-50 rounded-xl text-xs font-bold transition-colors whitespace-nowrap self-stretch sm:self-auto ${isUrgent ? 'text-amber-700 border-amber-200 hover:bg-amber-50' : 'text-red-700 border-red-200 hover:bg-red-50'}`}
                >
                  View in Emergency Bay
                </button>
              </div>
            )})}

            {pendingAsha.map((referral) => (
              <div key={referral.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <HeartPulse className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{referral.patientName}</span>
                      <span className="px-2 py-0.5 bg-amber-200/50 text-amber-800 text-[10px] font-bold rounded-md">ASHA Field Alert</span>
                    </div>
                    <p className="text-xs text-amber-900 font-medium mt-0.5">{referral.referralReason || referral.symptoms.join(", ")} (Referred by {referral.ashaName})</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigateTab("asha-inbox")}
                  className="px-4 py-2 bg-white text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-xl text-xs font-bold transition-colors whitespace-nowrap self-stretch sm:self-auto"
                >
                  Review Alert
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Table Area: Live OPD Queue */}
      <div className="bg-white rounded-3xl overflow-hidden pt-2 flex flex-col flex-1 min-h-0 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        {/* Toolbar */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">Live OPD Queue</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{waitingPatients.length} patients currently waiting</p>
          </div>
          <button
            onClick={() => onNavigateTab("queue")}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <span>View Full Queue Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto flex-1 px-2 sm:px-6 pb-6">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold capitalize">
                <th className="px-6 py-4 w-10">Token</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Visit Reason</th>
                <th className="px-6 py-4">Wait Time</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {waitingPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No patients waiting in queue.
                  </td>
                </tr>
              ) : (
                waitingPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-slate-700 font-black text-sm bg-slate-100 px-2 py-1 rounded-lg">
                        {patient.token}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          {patient.name}
                          {patient.triagePriority === "URGENT" && (
                            <UrgencyBadge priority="URGENT" />
                          )}
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5">
                          {patient.age} yrs · {patient.sex} · ABHA: {patient.abhaId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-700 truncate max-w-[250px] inline-block">
                        {patient.visitReason}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{patient.waitTimeMinutes} mins</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenConsultation(patient.id)}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>Examine</span>
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
