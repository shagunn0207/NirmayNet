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
    setCurrentRole,
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
      <div className="bg-slate-900 text-slate-300 text-[11px] font-medium px-4 py-1 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Government of Maharashtra · Public Health Department · SIH 2026 PS SIH26133</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-400">
          <span>District: <strong className="text-slate-200">Nandurbar</strong></span>
          <span>·</span>
          <span>Care Continuity & Referral Transit Protocol v2.4</span>
        </div>
      </div>

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
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
            {roleLinks.map((role) => {
              const Icon = role.icon;
              const isActive = pathname.startsWith(role.href);
              return (
                <Link
                  key={role.id}
                  href={role.href}
                  onClick={() => setCurrentRole(role.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? role.activeColor
                      : "text-slate-700 hover:text-slate-900 hover:bg-white/80"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <div className="text-left">
                    <div className="leading-tight">{role.name}</div>
                    <div className={`text-[10px] font-normal leading-none ${isActive ? "text-slate-200" : "text-slate-500"}`}>
                      {role.sub}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

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
            <div className="hidden xl:flex items-center gap-2.5 pl-3 border-l border-slate-200 text-xs">
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700">
                👨‍⚕️
              </div>
              <div>
                <p className="font-bold text-slate-800 leading-tight">
                  {pathname.startsWith("/phc-doctor")
                    ? "Dr. Sanjay Mehta (MO)"
                    : pathname.startsWith("/district-hospital")
                    ? "Dr. R. Deshmukh (Casualty)"
                    : "Dr. Arvind Patil (DHO)"}
                </p>
                <p className="text-[10px] text-slate-500">
                  {pathname.startsWith("/phc-doctor")
                    ? "PHC Dhadgaon, Akrani"
                    : pathname.startsWith("/district-hospital")
                    ? "District Civil Hospital"
                    : "Civil Surgeon Office"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sub-Role Bar */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-2 gap-1 overflow-x-auto">
          {roleLinks.map((role) => {
            const Icon = role.icon;
            const isActive = pathname.startsWith(role.href);
            return (
              <Link
                key={role.id}
                href={role.href}
                onClick={() => setCurrentRole(role.id as any)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold shrink-0 ${
                  isActive
                    ? role.activeColor
                    : "text-slate-600 bg-slate-100 hover:bg-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{role.name.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};
