"use client";

import React from "react";
import Link from "next/link";
import { ReferralCard } from "@/components/ReferralCard";

export default function ReferralsDashboardPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Referrals Dispatch</h1>
          <p className="text-xs text-slate-500">Active inter-facility patient transfers</p>
        </div>
        <Link href="/dashboard" className="text-xs font-bold text-teal-700 hover:underline">
          ← Back to Overview
        </Link>
      </div>

      <ReferralCard />
    </div>
  );
}
