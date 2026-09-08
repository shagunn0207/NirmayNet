"use client";

import React, { useState } from "react";
import { PortalLayout, NavTabItem } from "@/components/layout/PortalLayout";
import { useHealthcare } from "@/context/HealthcareContext";
import { HospitalDashboardView } from "@/components/hospital/HospitalDashboardView";
import { HospitalReferralsView } from "@/components/hospital/HospitalReferralsView";
import { HospitalQueueView } from "@/components/hospital/HospitalQueueView";
import { HospitalPatientsView } from "@/components/hospital/HospitalPatientsView";
import { HospitalSpecialistsView } from "@/components/hospital/HospitalSpecialistsView";
import { HospitalFacilityStatusView } from "@/components/hospital/HospitalFacilityStatusView";
import { HospitalEmergencyView } from "@/components/hospital/HospitalEmergencyView";
import {
  LayoutDashboard,
  Send,
  Users,
  UserCheck,
  Bed,
  FileText,
  Ambulance,
  AlertOctagon,
} from "lucide-react";

export default function DistrictHospitalPage() {
  const { hospitalReferrals, specialists, facilityStatus } = useHealthcare();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedReferralId, setSelectedReferralId] = useState<string | null>(null);

  const incomingCount = hospitalReferrals.filter(
    (r) => r.status === "SENT" || r.status === "RECEIVED"
  ).length;

  const emergencyCount = hospitalReferrals.filter(
    (r) => r.priority === "EMERGENCY" && r.status !== "COMPLETED"
  ).length;

  const availableBeds =
    facilityStatus.icuBedsAvailable +
    facilityStatus.maternityBedsAvailable +
    facilityStatus.emergencyBedsAvailable +
    facilityStatus.generalBedsAvailable;

  const tabs: NavTabItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "emergency",
      label: "Emergency Casualty",
      icon: AlertOctagon,
      badge: emergencyCount > 0 ? `${emergencyCount} Critical` : undefined,
      badgeColor: "bg-red-100 text-red-800",
      urgent: emergencyCount > 0,
    },
    {
      id: "referrals",
      label: "Incoming Referrals",
      icon: Send,
      badge: incomingCount > 0 ? `${incomingCount} New` : undefined,
      badgeColor: "bg-blue-100 text-blue-800",
      urgent: emergencyCount > 0,
    },
    {
      id: "queue",
      label: "Admissions Queue",
      icon: Users,
      badge: hospitalReferrals.filter((r) => r.status !== "COMPLETED").length,
      badgeColor: "bg-blue-100 text-blue-800",
    },
    {
      id: "patients",
      label: "Patient Records",
      icon: FileText,
    },
    {
      id: "specialists",
      label: "Specialist Roster",
      icon: UserCheck,
      badge: `${specialists.filter((s) => s.status === "Available").length} Ready`,
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      id: "facility",
      label: "Facility & Beds",
      icon: Bed,
      badge: `${availableBeds} Free`,
      badgeColor: "bg-teal-100 text-teal-800",
    },
  ];

  const handleSelectReferral = (refId: string) => {
    setSelectedReferralId(refId);
    setActiveTab("referrals");
  };

  return (
    <PortalLayout
      roleTitle="District Hospital Portal"
      facilityName="District Civil Hospital, Nandurbar"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId)}
      headerAction={
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl font-black text-slate-900">
              {tabs.find((t) => t.id === activeTab)?.label || "Hospital Staff Portal"}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Casualty Coordinator: Dr. R. Deshmukh · 24/7 Emergency Admissions Wing
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("emergency")}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <AlertOctagon className="w-4 h-4 text-white animate-pulse" />
              <span>{emergencyCount} Emergency Transits</span>
            </button>
          </div>
        </div>
      }
    >
      {activeTab === "dashboard" && (
        <HospitalDashboardView
          onNavigateTab={(tab) => setActiveTab(tab)}
          onSelectReferral={handleSelectReferral}
        />
      )}

      {activeTab === "emergency" && <HospitalEmergencyView />}

      {activeTab === "referrals" && (
        <HospitalReferralsView selectedReferralId={selectedReferralId} />
      )}

      {activeTab === "queue" && <HospitalQueueView />}

      {activeTab === "patients" && <HospitalPatientsView />}

      {activeTab === "specialists" && <HospitalSpecialistsView />}

      {activeTab === "facility" && <HospitalFacilityStatusView />}
    </PortalLayout>
  );
}
