"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge, ReferralStatusBadge } from "@/components/common/Badge";
import { 
  Ambulance,
  AlertOctagon, 
  Clock,
  Activity, 
  Stethoscope, 
  Bed, 
  HeartPulse, 
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

type EmergencyStep = "INBOUND" | "TRIAGE" | "ADMITTED";

export const HospitalEmergencyView: React.FC = () => {
  const {
    hospitalReferrals,
    updateHospitalReferralStatus,
    facilityStatus,
    specialists,
    showToast,
  } = useHealthcare();

  const [activeStep, setActiveStep] = useState<EmergencyStep>("INBOUND");
  const [selectedSpecialist, setSelectedSpecialist] = useState(
    specialists[0]?.name || "Dr. Neelam Joshi"
  );

  // All emergency referrals
  const emergencyReferrals = hospitalReferrals.filter(
    (r) => r.priority === "EMERGENCY"
  );

  const inboundTransits = emergencyReferrals.filter(
    (r) => r.status === "SENT" || r.status === "RECEIVED" || r.status === "IN_TRANSIT"
  );

  const triagePatients = emergencyReferrals.filter(
    (r) => r.status === "PATIENT ARRIVED"
  );

  const admittedPatients = emergencyReferrals.filter(
    (r) => r.status === "IN_TRANSIT" || r.status === "Accepted"
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
      `Referral #${id} checked in at District Casualty. Specialist alerted.`,
      "success"
    );
  };

  const handleAdmitToIntensiveCare = (id: string) => {
    updateHospitalReferralStatus(
      id,
      "IN_TRANSIT",
      "Admitted directly into Intensive Care Unit. Protocol active.",
      selectedSpecialist
    );
    showToast(
      "Admitted to Intensive Care",
      `Patient fast-tracked to Intensive Care Unit under ${selectedSpecialist}.`,
      "info"
    );
    // Optionally auto-switch to ADMITTED step after action
    setActiveStep("ADMITTED");
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* High-Impact Casualty Header */}
      <div className="bg-red-950 text-white rounded-3xl p-4 sm:px-6 sm:py-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-900 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-black">District Casualty Command</h2>
            <p className="text-xs text-red-300">24/7 Red Alert Desk for Emergency Intake</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none px-4 py-2 bg-red-900/50 rounded-xl border border-red-800 text-center">
            <span className="text-[10px] uppercase font-bold text-red-300 block">High Dependency Beds</span>
            <span className="text-sm font-black text-white">{facilityStatus.emergencyBedsAvailable} Free</span>
          </div>
          <div className="flex-1 sm:flex-none px-4 py-2 bg-red-900/50 rounded-xl border border-red-800 text-center">
            <span className="text-[10px] uppercase font-bold text-red-300 block">Intensive Care Beds</span>
            <span className="text-sm font-black text-white">{facilityStatus.icuBedsAvailable} Free</span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Navigation */}
      <div className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-2xl shadow-xs border border-slate-200">
        <button
          onClick={() => setActiveStep("INBOUND")}
          className={`flex-1 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
            activeStep === "INBOUND"
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Ambulance className={`w-5 h-5 ${activeStep === "INBOUND" ? "text-red-400 animate-pulse" : ""}`} />
          <span>Step 1: Inbound Ambulances</span>
          {inboundTransits.length > 0 && (
            <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${activeStep === "INBOUND" ? "bg-red-500 text-white" : "bg-slate-200 text-slate-700"}`}>
              {inboundTransits.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveStep("TRIAGE")}
          className={`flex-1 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
            activeStep === "TRIAGE"
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Stethoscope className="w-5 h-5" />
          <span>Step 2: Casualty Triage</span>
          {triagePatients.length > 0 && (
            <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${activeStep === "TRIAGE" ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-700"}`}>
              {triagePatients.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveStep("ADMITTED")}
          className={`flex-1 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
            activeStep === "ADMITTED"
              ? "bg-slate-900 text-white shadow-md"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <Activity className="w-5 h-5" />
          <span>Step 3: Intensive Care</span>
          {admittedPatients.length > 0 && (
            <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${activeStep === "ADMITTED" ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-700"}`}>
              {admittedPatients.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Content Area: Tab Views */}
      <div className="bg-white rounded-3xl overflow-hidden pt-2 flex flex-col flex-1 min-h-0 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        
        {/* Step 1: Inbound Transits */}
        {activeStep === "INBOUND" && (
          <div className="flex flex-col h-full">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Inbound Ambulances</h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Prepare casualty bays for arriving patients</p>
              </div>
            </div>
            <div className="overflow-x-auto overflow-y-auto flex-1 px-2 sm:px-6 pb-6">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Patient & Demographics</th>
                    <th className="px-6 py-4">Clinical Reason</th>
                    <th className="px-6 py-4">Origin & Transit Info</th>
                    <th className="px-6 py-4">ETA</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inboundTransits.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                        No inbound ambulances currently in transit.
                      </td>
                    </tr>
                  ) : (
                    inboundTransits.map((ref) => (
                      <tr key={ref.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              {ref.patientName}
                              <UrgencyBadge priority="EMERGENCY" size="sm" />
                            </span>
                            <span className="text-xs text-slate-500 mt-0.5">
                              {ref.age} yrs · {ref.sex}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-red-900 max-w-[250px] block truncate">{ref.reason}</span>
                          <span className="text-[11px] text-slate-500">{ref.department}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700">{ref.referringFacility}</span>
                            <span className="text-[11px] text-slate-500 mt-0.5">Vehicle: {ref.vehicleNumber || "MH-39-AM-1081"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs font-black text-red-600">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{ref.ambulanceEta || "15 mins"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleConfirmArrival(ref.id)}
                            className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Confirm Arrival</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Step 2: Casualty Triage */}
        {activeStep === "TRIAGE" && (
          <div className="flex flex-col h-full">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Casualty Triage</h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Assess arrived patients and allocate beds</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-600">Assign On-Call Specialist:</span>
                <select
                  value={selectedSpecialist}
                  onChange={(e) => setSelectedSpecialist(e.target.value)}
                  className="p-2 rounded-xl border border-slate-200 font-bold text-slate-800 bg-slate-50 text-xs focus:outline-hidden focus:ring-2 focus:ring-slate-200"
                >
                  {specialists.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.specialty})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto overflow-y-auto flex-1 px-2 sm:px-6 pb-6">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Clinical Diagnosis</th>
                    <th className="px-6 py-4">Required Department</th>
                    <th className="px-6 py-4">Current Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {triagePatients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                        No patients currently awaiting triage.
                      </td>
                    </tr>
                  ) : (
                    triagePatients.map((ref) => (
                      <tr key={ref.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              {ref.patientName}
                            </span>
                            <span className="text-xs text-slate-500 mt-0.5">
                              {ref.age} yrs · {ref.sex}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-800">{ref.reason}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-slate-700 font-bold">{ref.department}</span>
                        </td>
                        <td className="px-6 py-4">
                          <ReferralStatusBadge status={ref.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleAdmitToIntensiveCare(ref.id)}
                            className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5"
                          >
                            <Bed className="w-4 h-4" />
                            <span>Admit to Intensive Care</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Step 3: Intensive Care */}
        {activeStep === "ADMITTED" && (
          <div className="flex flex-col h-full">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Intensive Care Unit (ICU / HDU)</h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Currently admitted critical patients</p>
              </div>
            </div>
            <div className="overflow-x-auto overflow-y-auto flex-1 px-2 sm:px-6 pb-6">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Patient</th>
                    <th className="px-6 py-4">Diagnosis</th>
                    <th className="px-6 py-4">Assigned Specialist</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {admittedPatients.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500 text-sm">
                        No critical patients currently admitted.
                      </td>
                    </tr>
                  ) : (
                    admittedPatients.map((ref) => (
                      <tr key={ref.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              {ref.patientName}
                            </span>
                            <span className="text-xs text-slate-500 mt-0.5">
                              {ref.age} yrs · {ref.sex}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-800">{ref.reason}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                            {ref.assignedDoctor || "Unassigned"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                            Admitted to ICU
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
