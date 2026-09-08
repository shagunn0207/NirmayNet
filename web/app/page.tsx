"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import {
  Stethoscope,
  Building2,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Activity,
  Ambulance,
  HeartPulse,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function RootHomePage() {
  const roles = [
    {
      id: "phc-doctor",
      title: "PHC Doctor Portal",
      location: "Dhadgaon Primary Health Centre · Akrani Block",
      officer: "Dr. Sanjay Mehta, Medical Officer",
      href: "/phc-doctor",
      icon: Stethoscope,
      bgGradient: "from-teal-800 to-teal-950",
      accent: "bg-teal-500",
      features: [
        "Live OPD patient queue with priority triage",
        "ASHA field referral review & teleconsultation",
        "Clinical examination, vitals, and e-prescription",
        "108 Emergency referral dispatch to District Hospital",
        "In-house diagnostic tests & EDL pharmacy stock",
      ],
      btnText: "Enter PHC Doctor Portal",
      btnColor: "bg-teal-600 hover:bg-teal-700 text-white",
    },
    {
      id: "district-hospital",
      title: "District Hospital Staff Portal",
      location: "District Civil Hospital, Nandurbar",
      officer: "Dr. R. Deshmukh, Casualty Coordinator",
      href: "/district-hospital",
      icon: Building2,
      bgGradient: "from-blue-900 to-slate-950",
      accent: "bg-blue-500",
      features: [
        "Incoming rural PHC referral triage workbench",
        "Full workflow: Received → Accepted → Arrived → Completed",
        "Live 108 ambulance transit tracking with vehicle ETA",
        "ICU, Maternity, and Emergency HDU bed management",
        "Specialist doctor on-call availability roster",
      ],
      btnText: "Enter District Hospital Portal",
      btnColor: "bg-blue-700 hover:bg-blue-800 text-white",
    },
    {
      id: "dho",
      title: "District Health Officer (DHO) Portal",
      location: "District Health Office · Nandurbar District",
      officer: "Dr. Arvind Patil, District Health Officer",
      href: "/dho",
      icon: BarChart3,
      bgGradient: "from-indigo-950 to-slate-950",
      accent: "bg-indigo-500",
      features: [
        "Executive oversight across 18 rural PHCs and 2 DH/SDH",
        "PHC operational scorecard (Wait times, Stockouts, Referrals)",
        "District drug inventory monitoring & indent approvals",
        "Biomedical diagnostic equipment SLA breakdown tickets",
        "High-risk maternal & SAM child cohort surveillance",
      ],
      btnText: "Enter DHO Monitoring Portal",
      btnColor: "bg-indigo-700 hover:bg-indigo-800 text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-12 sm:py-16 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-teal-900/60 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-bold text-teal-300 mb-4">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>SIH 2026 PS SIH26133 · Government of Maharashtra Public Health</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Rural Care Continuity &amp; Facility Operations Platform
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
              Unifying rural ASHA workers, Primary Health Centre doctors, First Referral Unit specialists, and the District Health Administration under one real-time clinical continuum.
            </p>
          </div>
        </div>
      </section>

      {/* Role Selection Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12 relative z-20 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 text-teal-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                      Role Access
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-slate-900 leading-tight">
                    {role.title}
                  </h2>
                  <p className="text-xs font-bold text-teal-800 mt-1">
                    {role.officer}
                  </p>
                  <p className="text-[11px] text-slate-500 mb-4">
                    {role.location}
                  </p>

                  <div className="border-t border-slate-100 pt-4 mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                      Core Responsibilities &amp; Workflows:
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {role.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  href={role.href}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-black text-center flex items-center justify-center gap-2 transition-all shadow-xs ${role.btnColor}`}
                >
                  <span>{role.btnText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Existing Prototype Links */}
        <div className="mt-8 p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-slate-500" />
            <div>
              <span className="font-bold text-slate-900 block">
                Additional Views &amp; Legacy Dashboards
              </span>
              <span className="text-slate-500">
                You can also access the standalone single-facility overview dashboard.
              </span>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-colors"
          >
            Open Standalone Dashboard →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>NiramayNet — First Rural Care Continuity Platform · Government of Maharashtra · Smart India Hackathon 2026</p>
      </footer>
    </div>
  );
}
