"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge, ReferralStatusBadge } from "@/components/common/Badge";
import { ReferralStatus } from "@/lib/healthcareData";
import {
  Send,
  Building2,
  Ambulance,
  CheckCircle,
  Clock,
  UserCheck,
  AlertCircle,
  FileText,
  HelpCircle,
  CheckCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface HospitalReferralsViewProps {
  selectedReferralId?: string | null;
}

type TabFilter = "ALL" | "ACTIVE" | "EMERGENCY" | "IN_TRANSIT" | "COMPLETED";

export const HospitalReferralsView: React.FC<HospitalReferralsViewProps> = ({
  selectedReferralId,
}) => {
  const {
    hospitalReferrals,
    updateHospitalReferralStatus,
    requestMoreReferralInfo,
    specialists,
  } = useHealthcare();

  const [expandedRefId, setExpandedRefId] = useState<string | null>(
    selectedReferralId || null
  );
  const [filter, setFilter] = useState<TabFilter>("ACTIVE");

  // State for clarification notes modal/input
  const [clarificationNote, setClarificationNote] = useState("");
  const [selectedSpecialist, setSelectedSpecialist] = useState(
    specialists[0]?.name || "Dr. Neelam Joshi"
  );
  const [statusNote, setStatusNote] = useState("");

  const filteredReferrals = hospitalReferrals.filter((r) => {
    if (filter === "ALL") return true;
    if (filter === "EMERGENCY") return r.priority === "EMERGENCY";
    if (filter === "ACTIVE") return r.status !== "COMPLETED";
    if (filter === "IN_TRANSIT") return r.ambulanceStatus === "In Transit" || r.ambulanceRequested;
    if (filter === "COMPLETED") return r.status === "COMPLETED";
    return true;
  });

  const handleStatusTransition = (refId: string, newStatus: ReferralStatus) => {
    const referral = hospitalReferrals.find(r => r.id === refId);
    if (!referral) return;
    updateHospitalReferralStatus(
      refId,
      newStatus,
      statusNote ? statusNote : referral.hospitalNotes,
      selectedSpecialist
    );
    setStatusNote("");
    if (newStatus === "COMPLETED") {
      setExpandedRefId(null);
    }
  };

  const handleSendClarification = (refId: string) => {
    if (!clarificationNote.trim()) return;
    requestMoreReferralInfo(refId, clarificationNote.trim());
    setClarificationNote("");
  };

  const toggleExpand = (id: string) => {
    if (expandedRefId === id) {
      setExpandedRefId(null);
    } else {
      setExpandedRefId(id);
    }
  };

  const tabs: { id: TabFilter; label: string; icon: React.ReactNode }[] = [
    { id: "ACTIVE", label: "Active", icon: <FileText className="w-4 h-4" /> },
    { id: "IN_TRANSIT", label: "In Transit", icon: <Ambulance className="w-4 h-4" /> },
    { id: "EMERGENCY", label: "Emergency", icon: <AlertCircle className="w-4 h-4" /> },
    { id: "COMPLETED", label: "Completed", icon: <CheckCheck className="w-4 h-4" /> },
    { id: "ALL", label: "All Referrals", icon: <Building2 className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header & Navigation */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900">
                Incoming PHC Referrals
              </h2>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-900">
                {hospitalReferrals.filter((r) => r.status !== "COMPLETED").length} Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Triage, assign specialists, and confirm arrivals for rural transfers
            </p>
          </div>
        </div>

        {/* Segmented Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filter === tab.id
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-3xl overflow-hidden pt-2 flex flex-col flex-1 min-h-0 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100">
        <div className="overflow-x-auto overflow-y-auto flex-1 px-2 sm:px-4 pb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                <th className="px-4 py-4 w-10"></th>
                <th className="px-4 py-4">Patient</th>
                <th className="px-4 py-4">Department & Reason</th>
                <th className="px-4 py-4">Origin</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReferrals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500 text-sm">
                    No referrals found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredReferrals.map((ref) => {
                  const isExpanded = expandedRefId === ref.id;
                  
                  return (
                    <React.Fragment key={ref.id}>
                      {/* Main Row */}
                      <tr 
                        className={`transition-colors cursor-pointer group ${isExpanded ? 'bg-slate-50/80' : 'hover:bg-slate-50/50'}`}
                        onClick={() => toggleExpand(ref.id)}
                      >
                        <td className="px-4 py-4 text-slate-400 group-hover:text-slate-600 transition-colors">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              {ref.patientName}
                              <UrgencyBadge priority={ref.priority} size="sm" />
                            </span>
                            <span className="text-xs text-slate-500 mt-0.5">
                              {ref.age} yrs · {ref.sex}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col min-w-[200px]">
                            <span className="text-xs font-bold text-slate-800">{ref.department}</span>
                            <span className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[300px]">{ref.reason}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700">{ref.referringFacility}</span>
                            <span className="text-[11px] text-slate-400 mt-0.5">{ref.timestamp}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <ReferralStatusBadge status={ref.status} />
                        </td>
                        <td className="px-4 py-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(ref.id);
                            }}
                            className={`px-4 py-2 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5 ${
                              isExpanded 
                                ? "bg-slate-200 text-slate-700"
                                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                            }`}
                          >
                            <span>{isExpanded ? "Close" : "Review & Action"}</span>
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Details Panel */}
                      {isExpanded && (
                        <tr className="bg-slate-50/80 border-b-2 border-slate-200">
                          <td colSpan={6} className="px-4 py-0">
                            <div className="py-6 px-4 md:px-10 flex flex-col xl:flex-row gap-6 animate-in slide-in-from-top-2 duration-200">
                              
                              {/* Clinical Details Column */}
                              <div className="flex-1 flex flex-col gap-4">
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-2">
                                  Clinical Summary
                                </h4>
                                
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                                  <div className="flex items-start justify-between gap-4 mb-3">
                                    <div>
                                      <p className="font-bold text-slate-900 text-sm">{ref.reason}</p>
                                      <p className="text-[11px] text-slate-500 mt-1">Referred by: {ref.referringDoctor}</p>
                                    </div>
                                    <span className="font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 text-[10px] uppercase tracking-wider shrink-0">
                                      Target: {ref.department}
                                    </span>
                                  </div>
                                  
                                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    {ref.clinicalSummary}
                                  </p>

                                  {/* Vitals Grid */}
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-center">
                                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                                      <span className="text-[10px] uppercase text-slate-400 block font-bold">BP</span>
                                      <span className="font-black text-slate-800 text-sm">{ref.vitals.bp}</span>
                                    </div>
                                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                                      <span className="text-[10px] uppercase text-slate-400 block font-bold">Pulse</span>
                                      <span className="font-black text-slate-800 text-sm">{ref.vitals.pulse} bpm</span>
                                    </div>
                                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                                      <span className="text-[10px] uppercase text-slate-400 block font-bold">SpO2</span>
                                      <span className="font-black text-slate-800 text-sm">{ref.vitals.spo2}%</span>
                                    </div>
                                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                                      <span className="text-[10px] uppercase text-slate-400 block font-bold">Temp</span>
                                      <span className="font-black text-slate-800 text-sm">{ref.vitals.temp}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Ambulance Info */}
                                {ref.ambulanceRequested && ref.status !== "COMPLETED" && (
                                  <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                        <Ambulance className="w-5 h-5 text-red-600" />
                                      </div>
                                      <div>
                                        <span className="font-bold text-red-950 text-sm block">108 Emergency Transit</span>
                                        <span className="text-xs text-red-800">
                                          Vehicle: <strong>{ref.vehicleNumber || "MH-39-AM-1081"}</strong> · Driver: {ref.driverContact || "Santosh"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-[10px] uppercase font-bold text-red-700 block">ETA</span>
                                      <span className="font-black text-red-900 text-lg">
                                        {ref.ambulanceEta || "20 mins"}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Action Panel Column */}
                              <div className="w-full xl:w-[350px] flex flex-col gap-4">
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-2">
                                  Process Referral
                                </h4>
                                
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
                                  {/* Action Setup */}
                                  <div className="flex flex-col gap-3">
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                        Assign Specialist
                                      </label>
                                      <select
                                        value={selectedSpecialist}
                                        onChange={(e) => setSelectedSpecialist(e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 bg-slate-50 text-xs focus:outline-hidden focus:ring-2 focus:ring-slate-200"
                                      >
                                        {specialists.map((s) => (
                                          <option key={s.id} value={s.name}>
                                            {s.name} ({s.specialty})
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                        Action Note (Optional)
                                      </label>
                                      <input
                                        type="text"
                                        placeholder="e.g. Bed 14 reserved in General Ward"
                                        value={statusNote}
                                        onChange={(e) => setStatusNote(e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-slate-200 bg-slate-50"
                                      />
                                    </div>
                                  </div>

                                  {/* Primary Actions */}
                                  <div className="grid grid-cols-2 gap-2 mt-1">
                                    <button
                                      type="button"
                                      onClick={() => handleStatusTransition(ref.id, "Accepted")}
                                      className="py-2.5 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      <span>Accept</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleStatusTransition(ref.id, "PATIENT ARRIVED")}
                                      className="py-2.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                                    >
                                      <Building2 className="w-4 h-4" />
                                      <span>Arrived</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleStatusTransition(ref.id, "IN_TRANSIT")}
                                      className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                                    >
                                      <UserCheck className="w-4 h-4" />
                                      <span>Admit</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleStatusTransition(ref.id, "COMPLETED")}
                                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                                    >
                                      <CheckCheck className="w-4 h-4" />
                                      <span>Complete</span>
                                    </button>
                                  </div>
                                </div>
                                
                                {/* Request Clarification block */}
                                {ref.status !== "COMPLETED" && (
                                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 shadow-xs flex flex-col gap-2.5">
                                    <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider flex items-center gap-1">
                                      <HelpCircle className="w-3 h-3" />
                                      Request Info from PHC
                                    </span>
                                    <textarea
                                      placeholder="e.g. Please upload latest ECG strip"
                                      value={clarificationNote}
                                      onChange={(e) => setClarificationNote(e.target.value)}
                                      className="w-full p-2.5 rounded-xl border border-orange-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-300 bg-white min-h-[60px] resize-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleSendClarification(ref.id)}
                                      className="py-2 w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                                    >
                                      <Send className="w-3.5 h-3.5" />
                                      <span>Send Message</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
