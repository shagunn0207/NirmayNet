"use client";

import React from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge, ReferralStatusBadge } from "@/components/common/Badge";
import {
  Building2,
  Users,
  AlertOctagon,
  Send,
  Bed,
  UserCheck,
  Clock,
  CheckCircle2,
  ChevronRight,
  Ambulance,
  Activity,
  HeartPulse,
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
  const acceptedReferrals = hospitalReferrals.filter((r) => r.status === "Accepted");
  const inTransitAmbulances = hospitalReferrals.filter(
    (r) => r.ambulanceRequested && (r.ambulanceStatus === "In Transit" || r.ambulanceStatus === "Dispatched")
  );
  const completedReferrals = hospitalReferrals.filter((r) => r.status === "COMPLETED");

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

  const kpis = [
    {
      title: "Hospital Patients Today",
      value: "342",
      sub: "+8% vs yesterday",
      icon: Users,
      color: "border-blue-200 bg-blue-50/50 text-blue-900",
      accent: "text-blue-700",
    },
    {
      title: "Emergency Casualty Cases",
      value: emergencyReferrals.length.toString(),
      sub: "Urgent stabilization",
      icon: AlertOctagon,
      color: "border-red-200 bg-red-50 text-red-900",
      accent: "text-red-700 font-black",
      urgent: emergencyReferrals.length > 0,
      onClick: () => onNavigateTab("referrals"),
    },
    {
      title: "Incoming PHC Referrals",
      value: incomingPhcReferrals.length.toString(),
      sub: "Awaiting hospital review",
      icon: Send,
      color: "border-amber-200 bg-amber-50 text-amber-900",
      accent: "text-amber-800 font-bold",
      onClick: () => onNavigateTab("referrals"),
    },
    {
      title: "108 Ambulances in Transit",
      value: inTransitAmbulances.length.toString(),
      sub: "En route to Casualty",
      icon: Ambulance,
      color: "border-rose-200 bg-rose-50 text-rose-900",
      accent: "text-rose-700 font-bold",
      onClick: () => onNavigateTab("referrals"),
    },
    {
      title: "Available Hospital Beds",
      value: `${availableBeds} / ${totalBeds}`,
      sub: `ICU: ${facilityStatus.icuBedsAvailable}, Mat: ${facilityStatus.maternityBedsAvailable}`,
      icon: Bed,
      color: "border-teal-200 bg-teal-50/50 text-teal-900",
      accent: "text-teal-700",
      onClick: () => onNavigateTab("facility"),
    },
    {
      title: "Specialists on Duty",
      value: `${availableSpecialistsCount} / ${specialists.length}`,
      sub: "OBGY, Card, Peds active",
      icon: UserCheck,
      color: "border-indigo-200 bg-indigo-50/50 text-indigo-900",
      accent: "text-indigo-700",
      onClick: () => onNavigateTab("specialists"),
    },
    {
      title: "In-Progress Admissions",
      value: acceptedReferrals.length.toString(),
      sub: "Assigned to wards",
      icon: Activity,
      color: "border-purple-200 bg-purple-50/50 text-purple-900",
      accent: "text-purple-700",
      onClick: () => onNavigateTab("queue"),
    },
    {
      title: "Completed Referrals",
      value: completedReferrals.length.toString(),
      sub: "Discharged / Stabilized",
      icon: CheckCircle2,
      color: "border-emerald-200 bg-emerald-50/50 text-emerald-900",
      accent: "text-emerald-700",
      onClick: () => onNavigateTab("referrals"),
    },
  ];

  const primaryEmergency = emergencyReferrals[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Prominent Emergency Transit Alert Banner */}
      {primaryEmergency && (
        <div className="bg-red-50 border-2 border-red-400 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse-subtle">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Ambulance className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider bg-red-600 text-white px-2.5 py-0.5 rounded-md">
                  Inbound Emergency Patient
                </span>
                <span className="text-sm font-black text-red-950">
                  {primaryEmergency.patientName} ({primaryEmergency.age}y, {primaryEmergency.sex})
                </span>
                <span className="text-xs font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded">
                  Ref: {primaryEmergency.id}
                </span>
              </div>
              <p className="text-xs text-red-900 mt-1 font-medium leading-relaxed">
                <strong>Transfer from:</strong> {primaryEmergency.referringFacility} ({primaryEmergency.referringDoctor}) →{" "}
                <strong>Department:</strong> {primaryEmergency.department} |{" "}
                <strong>Diagnosis:</strong> {primaryEmergency.reason}
              </p>
              <div className="flex items-center gap-4 text-xs font-bold text-red-800 mt-1">
                <span>Vehicle: {primaryEmergency.vehicleNumber || "MH-39-AM-1081"}</span>
                <span>·</span>
                <span className="text-red-700 font-black">
                  Ambulance ETA: {primaryEmergency.ambulanceEta || "20 mins"} ({primaryEmergency.ambulanceStatus})
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectReferral(primaryEmergency.id)}
            className="w-full sm:w-auto px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <span>Prepare Casualty & Triage</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-8 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={kpi.onClick}
              className={`border rounded-2xl p-3.5 sm:p-4 transition-all ${kpi.color} ${
                kpi.onClick ? "cursor-pointer hover:shadow-md hover:scale-[1.01]" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold truncate opacity-85">{kpi.title}</span>
                <Icon className="w-4 h-4 shrink-0 opacity-75" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black">{kpi.value}</span>
                <span className={`text-[11px] truncate ${kpi.accent}`}>{kpi.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two-Column Quick Views */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Critical Inbound Referrals */}
        <div className="xl:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Incoming PHC Referral Admissions
              </h3>
              <p className="text-xs text-slate-500">
                Patients transferred from rural Primary Health Centres
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab("referrals")}
              className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1"
            >
              <span>Manage All ({hospitalReferrals.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {hospitalReferrals.slice(0, 4).map((ref) => (
              <div
                key={ref.id}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-slate-900">
                      {ref.patientName}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      ({ref.age}y, {ref.sex})
                    </span>
                    <UrgencyBadge priority={ref.priority} size="sm" />
                    <ReferralStatusBadge status={ref.status} size="sm" />
                  </div>
                  <p className="text-slate-700 font-medium mt-1 truncate">
                    {ref.department} — {ref.reason}
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Referring: <strong>{ref.referringFacility}</strong> · {ref.timestamp}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectReferral(ref.id)}
                  className="px-3.5 py-2 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl text-xs shrink-0 self-end sm:self-center transition-colors"
                >
                  Process Referral
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Facility Status & Resources */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* Specialists Roster Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  On-Duty Specialists Roster
                </h3>
                <p className="text-xs text-slate-500">Casualty and consultant coverage</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab("specialists")}
                className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1"
              >
                <span>Full Roster</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              {specialists.slice(0, 4).map((spec) => (
                <div
                  key={spec.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50"
                >
                  <div>
                    <span className="font-extrabold text-slate-900 block">{spec.name}</span>
                    <span className="text-[11px] text-slate-500">{spec.specialty} · Active: {spec.activePatients}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      spec.status === "Available"
                        ? "bg-emerald-100 text-emerald-800"
                        : spec.status === "Busy"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {spec.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Bed Status Widget */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <span className="text-xs font-black uppercase tracking-wider text-blue-300">
                Facility Critical Capacity
              </span>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Oxygen Plant Operational
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                <span className="text-[10px] text-blue-200 uppercase font-bold block">ICU Beds Free</span>
                <span className="text-2xl font-black text-white">
                  {facilityStatus.icuBedsAvailable} <span className="text-xs font-normal text-blue-300">/ {facilityStatus.icuTotal}</span>
                </span>
              </div>
              <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                <span className="text-[10px] text-blue-200 uppercase font-bold block">Maternity Beds Free</span>
                <span className="text-2xl font-black text-white">
                  {facilityStatus.maternityBedsAvailable} <span className="text-xs font-normal text-blue-300">/ {facilityStatus.maternityTotal}</span>
                </span>
              </div>
              <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                <span className="text-[10px] text-blue-200 uppercase font-bold block">Emergency HDU Free</span>
                <span className="text-2xl font-black text-white">
                  {facilityStatus.emergencyBedsAvailable} <span className="text-xs font-normal text-blue-300">/ {facilityStatus.emergencyTotal}</span>
                </span>
              </div>
              <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                <span className="text-[10px] text-blue-200 uppercase font-bold block">Blood Bank (O+ / O-)</span>
                <span className="text-2xl font-black text-white">
                  {facilityStatus.bloodBankUnitsOpos} <span className="text-xs font-normal text-blue-300">/ {facilityStatus.bloodBankUnitsOneg}u</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
