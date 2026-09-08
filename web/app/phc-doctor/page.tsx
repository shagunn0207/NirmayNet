"use client";

import React, { useState } from "react";
import { PortalLayout, NavTabItem } from "@/components/layout/PortalLayout";
import { useHealthcare } from "@/context/HealthcareContext";
import { PHCDashboardView } from "@/components/phc/PHCDashboardView";
import { PHCQueueView } from "@/components/phc/PHCQueueView";
import { PHCAshaInboxView } from "@/components/phc/PHCAshaInboxView";
import { PHCConsultationView } from "@/components/phc/PHCConsultationView";
import { PHCReferralsView } from "@/components/phc/PHCReferralsView";
import { PHCDiagnosticsView } from "@/components/phc/PHCDiagnosticsView";
import { PHCInventoryView } from "@/components/phc/PHCInventoryView";
import { PHCHighRiskView } from "@/components/phc/PHCHighRiskView";
import { PHCFollowupsView } from "@/components/phc/PHCFollowupsView";
import { CreateReferralModal } from "@/components/phc/CreateReferralModal";
import {
  LayoutDashboard,
  Users,
  HeartPulse,
  Stethoscope,
  Send,
  FlaskConical,
  Pill,
  ShieldAlert,
  Calendar,
  Ambulance,
} from "lucide-react";

export default function PHCDoctorPortalPage() {
  const {
    patients,
    ashaReferrals,
    hospitalReferrals,
    medicines,
    followups,
    selectedPatient,
    setSelectedPatient,
  } = useHealthcare();

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [activeConsultationPatientId, setActiveConsultationPatientId] = useState<string>(
    patients[0]?.id || "P-101"
  );
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [referralDefaultPatientId, setReferralDefaultPatientId] = useState<string | undefined>();

  const waitingCount = patients.filter((p) => p.currentStatus === "Waiting").length;
  const pendingAshaCount = ashaReferrals.filter((r) => r.status === "Pending Review").length;
  const activeReferralsCount = hospitalReferrals.filter((r) => r.status !== "COMPLETED").length;
  const lowStockCount = medicines.filter((m) => m.status !== "In Stock").length;
  const missedFollowups = followups.filter((f) => f.status === "Missed").length;

  const tabs: NavTabItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "queue",
      label: "Patient Queue",
      icon: Users,
      badge: waitingCount,
      badgeColor: "bg-teal-100 text-teal-800",
    },
    {
      id: "asha-inbox",
      label: "ASHA Referrals",
      icon: HeartPulse,
      badge: pendingAshaCount,
      badgeColor: "bg-amber-100 text-amber-800",
      urgent: pendingAshaCount > 0,
    },
    {
      id: "consultation",
      label: "Active Consultation",
      icon: Stethoscope,
    },
    {
      id: "referrals",
      label: "DH Referrals",
      icon: Send,
      badge: activeReferralsCount,
      badgeColor: "bg-blue-100 text-blue-800",
    },
    {
      id: "diagnostics",
      label: "Diagnostics & Lab",
      icon: FlaskConical,
    },
    {
      id: "inventory",
      label: "Medicine Stock",
      icon: Pill,
      badge: lowStockCount,
      badgeColor: "bg-orange-100 text-orange-800",
    },
    {
      id: "high-risk",
      label: "High-Risk Registry",
      icon: ShieldAlert,
    },
    {
      id: "followups",
      label: "Follow-ups Due",
      icon: Calendar,
      badge: missedFollowups > 0 ? `${missedFollowups} Missed` : undefined,
      badgeColor: "bg-red-100 text-red-800",
      urgent: missedFollowups > 0,
    },
  ];

  const handleOpenConsultation = (patientId: string) => {
    setActiveConsultationPatientId(patientId);
    const p = patients.find((pt) => pt.id === patientId);
    if (p) setSelectedPatient(p);
    setActiveTab("consultation");
  };

  const handleOpenReferralModal = (patientId?: string) => {
    setReferralDefaultPatientId(patientId || activeConsultationPatientId);
    setIsReferralModalOpen(true);
  };

  return (
    <PortalLayout
      roleTitle="PHC Doctor Portal"
      facilityName="Dhadgaon Primary Health Centre"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId)}
      headerAction={
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl font-black text-slate-900">
              {tabs.find((t) => t.id === activeTab)?.label || "PHC Doctor Dashboard"}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Medical Officer: Dr. Sanjay Mehta, MBBS, DCH · Akrani Block
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenReferralModal()}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Ambulance className="w-4 h-4" />
              <span className="hidden sm:inline">Emergency Referral</span>
            </button>
          </div>
        </div>
      }
    >
      {activeTab === "dashboard" && (
        <PHCDashboardView
          onNavigateTab={(tab) => setActiveTab(tab)}
          onOpenConsultation={handleOpenConsultation}
          onOpenReferralModal={handleOpenReferralModal}
        />
      )}

      {activeTab === "queue" && (
        <PHCQueueView
          onOpenConsultation={handleOpenConsultation}
          onOpenReferralModal={handleOpenReferralModal}
          onViewRecord={handleOpenConsultation}
        />
      )}

      {activeTab === "asha-inbox" && (
        <PHCAshaInboxView
          onOpenConsultation={handleOpenConsultation}
          onOpenReferralModal={handleOpenReferralModal}
        />
      )}

      {activeTab === "consultation" && (
        <PHCConsultationView
          patientId={activeConsultationPatientId}
          onOpenReferralModal={handleOpenReferralModal}
          onFinishConsultation={() => setActiveTab("queue")}
        />
      )}

      {activeTab === "referrals" && (
        <PHCReferralsView
          onOpenCreateReferral={() => handleOpenReferralModal()}
        />
      )}

      {activeTab === "diagnostics" && <PHCDiagnosticsView />}

      {activeTab === "inventory" && <PHCInventoryView />}

      {activeTab === "high-risk" && (
        <PHCHighRiskView
          onOpenConsultation={handleOpenConsultation}
          onOpenReferralModal={handleOpenReferralModal}
        />
      )}

      {activeTab === "followups" && <PHCFollowupsView />}

      {/* Create Referral Dialog */}
      <CreateReferralModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
        defaultPatientId={referralDefaultPatientId}
      />
    </PortalLayout>
  );
}
