"use client";

import React from "react";
import Link from "next/link";
const queuePatients: any[] = [];

export default function PatientsDashboardPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Patient Directory</h1>
          <p className="text-xs text-slate-500">Registered rural patients under active care</p>
        </div>
        <Link href="/dashboard" className="text-xs font-bold text-teal-700 hover:underline">
          ← Back to Overview
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {queuePatients.map((p) => (
          <div key={p.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex justify-between items-center mb-2">
              <span className="font-extrabold text-slate-900 text-sm">{p.name}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {p.triage}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              {p.age}y · {p.sex} · Village: {p.village}
            </p>
            <p className="text-xs font-bold text-teal-700 mt-1">Risk: {p.risk}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
