"use client";

import React, { useState } from "react";
import { PortalLayout, NavTabItem } from "@/components/layout/PortalLayout";
import { useHealthcare } from "@/context/HealthcareContext";
import { DHOOverviewView } from "@/components/dho/DHOOverviewView";
import { DHOPHCPerformanceView } from "@/components/dho/DHOPHCPerformanceView";
import { DHOHospitalPerformanceView } from "@/components/dho/DHOHospitalPerformanceView";
import { DHOReferralAnalyticsView } from "@/components/dho/DHOReferralAnalyticsView";
import { DHOMedicineMonitoringView } from "@/components/dho/DHOMedicineMonitoringView";
import { DHODiagnosticMonitoringView } from "@/components/dho/DHODiagnosticMonitoringView";
import { DHOHighRiskMonitoringView } from "@/components/dho/DHOHighRiskMonitoringView";
import { DHOQualityAccessView } from "@/components/dho/DHOQualityAccessView";
import {
  BarChart3,
  Building2,
  Send,
  Pill,
  FlaskConical,
  ShieldAlert,
  Download,
  Printer,
  Award,
} from "lucide-react";

export default function DHOPage() {
  const { phcMetrics, medicines, followups, currentUser } = useHealthcare();
  const [activeTab, setActiveTab] = useState<string>("overview");

  const criticalPhcCount = phcMetrics.filter((p) => p.status === "Critical" || p.status === "Alert").length;
  const lowStockMeds = medicines.filter((m) => m.status !== "In Stock").length;
  const missedFollowups = followups.filter((f) => f.status === "Missed").length;

  const tabs: NavTabItem[] = [
    {
      id: "overview",
      label: "District Overview",
      icon: BarChart3,
    },
    {
      id: "phc-performance",
      label: "PHC Performance",
      icon: Building2,
      badge: criticalPhcCount > 0 ? `${criticalPhcCount} Attention` : undefined,
      badgeColor: "bg-amber-100 text-amber-800",
      urgent: criticalPhcCount > 0,
    },
    {
      id: "hospital-performance",
      label: "Hospital Operations",
      icon: Building2,
    },
    {
      id: "referral-analytics",
      label: "Referral Analytics",
      icon: Send,
    },
    {
      id: "medicine-monitoring",
      label: "Medicine Stock (EDL)",
      icon: Pill,
      badge: lowStockMeds > 0 ? `${lowStockMeds} Deficit` : undefined,
      badgeColor: "bg-red-100 text-red-800",
      urgent: lowStockMeds > 0,
    },
    {
      id: "diagnostic-monitoring",
      label: "Diagnostic Networks",
      icon: FlaskConical,
    },
    {
      id: "high-risk-monitoring",
      label: "High-Risk Surveillance",
      icon: ShieldAlert,
      badge: missedFollowups > 0 ? `${missedFollowups} Overdue` : undefined,
      badgeColor: "bg-rose-100 text-rose-800",
      urgent: missedFollowups > 0,
    },
    {
      id: "quality-access",
      label: "Quality & Access Index",
      icon: Award,
    },
  ];

  return (
    <PortalLayout
      roleTitle={currentUser?.name || "District Health Officer"}
      facilityName={(currentUser as any)?.facility_name || "District Health Office (DHO), Nandurbar"}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId)}
      headerAction={
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl font-black text-slate-900">
              {tabs.find((t) => t.id === activeTab)?.label || "District Health Administration"}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              District Health Officer: Dr. Arvind Patil, MD · Nandurbar District, Maharashtra
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("quality-access")}
              className="px-3 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-900 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              <span>NHM Scorecard</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>
      }
    >
      {activeTab === "overview" && (
        <DHOOverviewView onNavigateTab={(tab) => setActiveTab(tab)} />
      )}

      {activeTab === "phc-performance" && <DHOPHCPerformanceView />}

      {activeTab === "hospital-performance" && <DHOHospitalPerformanceView />}

      {activeTab === "referral-analytics" && <DHOReferralAnalyticsView />}

      {activeTab === "medicine-monitoring" && <DHOMedicineMonitoringView />}

      {activeTab === "diagnostic-monitoring" && <DHODiagnosticMonitoringView />}

      {activeTab === "high-risk-monitoring" && <DHOHighRiskMonitoringView />}

      {activeTab === "quality-access" && <DHOQualityAccessView />}
    </PortalLayout>
  );
}
