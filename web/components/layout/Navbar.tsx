"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHealthcare } from "@/context/HealthcareContext";
import {
  Stethoscope,
  Building2,
  BarChart3,
  AlertTriangle,
  Menu,
  X,
  Bell,
  Activity,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const pathname = usePathname();
  const {
    hospitalReferrals,
    ashaReferrals,
    currentRole,
    isLoggedIn,
    setCurrentRole,
    logout,
  } = useHealthcare();

  const emergencyCount = hospitalReferrals.filter(
    (r) => r.priority === "EMERGENCY" && r.status !== "COMPLETED"
  ).length;

  const pendingAshaCount = ashaReferrals.filter(
    (r) => r.status === "Pending Review"
  ).length;

  const roleLinks = [
    {
      id: "phc-doctor",
      name: "PHC Doctor",
      sub: "Dhadgaon PHC",
      href: "/phc-doctor",
      icon: Stethoscope,
      activeColor: "bg-teal-700 text-white shadow-sm border-teal-800",
    },
    {
      id: "district-hospital",
      name: "District Hospital Staff",
      sub: "Nandurbar DH",
      href: "/district-hospital",
      icon: Building2,
      activeColor: "bg-blue-800 text-white shadow-sm border-blue-900",
    },
    {
      id: "dho",
      name: "District Health Officer",
      sub: "DHO Nandurbar",
      href: "/dho",
      icon: BarChart3,
      activeColor: "bg-indigo-900 text-white shadow-sm border-indigo-950",
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Govt Bar */}
      

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
                aria-label="Toggle navigation menu"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:bg-teal-700 transition-colors">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900">
                    Niramay<span className="text-teal-600">Net</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-teal-50 text-teal-700 border border-teal-200 px-1.5 py-0.5 rounded">
                    Rural Care
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5 hidden sm:block">
                  Integrated Clinical & Referral Operations
                </p>
              </div>
            </Link>
          </div>

          {/* Role Navigation Switcher Pills */}
          

          {/* Right Actions & Emergency Badge */}
          <div className="flex items-center gap-3">
            {/* Emergency Alert Tag */}
            {emergencyCount > 0 && (
              <div className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1.5 rounded-lg text-xs font-bold animate-pulse">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>{emergencyCount} Emergency</span>
              </div>
            )}

            {/* ASHA Alert Pill */}
            {pendingAshaCount > 0 && (
              <div className="hidden sm:flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded-lg text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{pendingAshaCount} ASHA Referral</span>
              </div>
            )}

            {/* Quick Profile Pill */}
            {isLoggedIn && (
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200 text-xs">
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700">
                👨‍⚕️
              </div>
              <div className="hidden sm:block">
                <p className="font-bold text-slate-800 leading-tight">
                  {currentRole === 'phc-doctor' ? 'PHC Doctor' : currentRole === 'district-hospital' ? 'District Hospital' : 'DHO'}
                </p>
              </div>
              <button
                onClick={logout}
                className="ml-2 text-rose-600 hover:text-rose-700 font-bold bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
            )}
          </div>
        </div>

        {/* Mobile Sub-Role Bar */}
        
      </div>
    </header>
  );
};
