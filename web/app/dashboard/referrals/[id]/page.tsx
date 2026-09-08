"use client";

import React from "react";
import Link from "next/link";
import { referralQueue } from "@/lib/mockData";

export default function ReferralDetailPage({ params }: { params: { id: string } }) {
  const refItem = referralQueue.find((r) => r.id === params.id) || referralQueue[0];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 text-xs">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900">Referral: {refItem.id}</h1>
        <Link href="/dashboard/referrals" className="text-xs font-bold text-teal-700 hover:underline">
          ← Back to Referrals
        </Link>
      </div>

      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <p><strong>Patient:</strong> {refItem.patient}</p>
        <p><strong>Destination:</strong> {refItem.facility}</p>
        <p><strong>Reason:</strong> {refItem.reason}</p>
        <p><strong>Urgency:</strong> {refItem.urgency}</p>
        <p><strong>Status:</strong> {refItem.status}</p>
        <p><strong>ETA:</strong> {refItem.eta}</p>
      </div>
    </div>
  );
}
