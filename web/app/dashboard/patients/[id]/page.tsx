"use client";

import React from "react";
import Link from "next/link";
const queuePatients: any[] = [];

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = queuePatients.find((p) => p.id === params.id) || queuePatients[0];
  if (!patient) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-900">Patient Detail</h1>
          <Link href="/dashboard/patients" className="text-xs font-bold text-teal-700 hover:underline">
            ← Back to Patients
          </Link>
        </div>
        <p className="text-xs text-slate-500">No patient details available.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900">{patient.name}</h1>
        <Link href="/dashboard/patients" className="text-xs font-bold text-teal-700 hover:underline">
          ← Back to Patients
        </Link>
      </div>
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs">
        <p><strong>ID:</strong> {patient.id}</p>
        <p><strong>Age:</strong> {patient.age} yrs · {patient.sex}</p>
        <p><strong>Village:</strong> {patient.village}</p>
        <p><strong>Phone:</strong> {patient.phone}</p>
        <p><strong>Triage Priority:</strong> {patient.triage}</p>
        <p><strong>Clinical Risk:</strong> {patient.risk}</p>
      </div>
    </div>
  );
}
