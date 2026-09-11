"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge } from "@/components/common/Badge";
import {
  User,
  HeartPulse,
  FileText,
  Stethoscope,
  Send,
  Plus,
  Trash2,
  Calendar,
  Save,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Pill,
} from "lucide-react";

interface PHCConsultationViewProps {
  patientId: string;
  onOpenReferralModal: (patientId: string) => void;
  onFinishConsultation?: () => void;
}

export const PHCConsultationView: React.FC<PHCConsultationViewProps> = ({
  patientId,
  onOpenReferralModal,
  onFinishConsultation,
}) => {
  const { patients, updatePatientConsultation, medicines, orderDiagnosticTest } =
    useHealthcare();

  const patient = patients.find((p) => p.id === patientId) || patients[0];

  const [assessment, setAssessment] = useState(
    patient?.triagePriority === "EMERGENCY"
      ? "Acute Severe Pre-eclampsia with impending eclampsia symptoms. Elevated BP 160/105 with organ stress."
      : "Clinical evaluation for ongoing symptoms."
  );
  const [clinicalNotes, setClinicalNotes] = useState(
    patient?.triagePriority === "EMERGENCY"
      ? "Patient administered initial oral Labetalol 100mg. Reflexes hyperactive. Urgently stabilized for transit to District Hospital Nandurbar."
      : "Patient examined in general OPD. Vitals stable. Advised diet and hydration."
  );

  // Dynamic Prescription List
  const [prescriptions, setPrescriptions] = useState<string[]>([
    "Tab Labetalol 100mg - 1 Tab BD x 5 days",
    "Tab Calcium carbonate 500mg - 1 Tab OD x 30 days",
    "Tab Iron Folic Acid - 1 Tab OD x 30 days",
  ]);
  const [newMed, setNewMed] = useState("");

  const [nextFollowUpDate, setNextFollowUpDate] = useState("In 7 Days");

  const handleAddMed = () => {
    if (newMed.trim()) {
      setPrescriptions((prev) => [...prev, newMed.trim()]);
      setNewMed("");
    }
  };

  const handleRemoveMed = (index: number) => {
    setPrescriptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatientConsultation(patient.id, {
      assessment,
      prescription: prescriptions,
      notes: clinicalNotes,
      nextFollowUpDate,
    });
    if (onFinishConsultation) onFinishConsultation();
  };

  if (!patient) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400 bg-white rounded-3xl min-h-[50vh]">
        Select a patient to begin consultation.
      </div>
    );
  }

  const isEmergency = patient?.triagePriority === "EMERGENCY";

  return (
    <div className="flex flex-col gap-6">
      {/* Patient Header Card */}
      <div className="bg-white  rounded-3xl p-5 ">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-3xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-black text-2xl shrink-0">
              {patient.sex === "Female" ? "👩" : "👨"}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-black text-slate-900">{patient.name}</h1>
                <UrgencyBadge priority={patient.triagePriority} />
                {patient.riskCategory && (
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-xs font-bold">
                    {patient.riskCategory} High-Risk
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap font-medium">
                <span>Age: <strong>{patient.age} yrs</strong></span>
                <span>·</span>
                <span>Sex: <strong>{patient.sex}</strong></span>
                <span>·</span>
                <span>Blood: <strong>{patient.bloodGroup}</strong></span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {patient.village}
                </span>
                <span>·</span>
                <span>ABHA ID: <strong>{patient.abhaId}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenReferralModal(patient.id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold  transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Refer to District Hospital</span>
            </button>
          </div>
        </div>

        {/* Live Vitals Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Pressure</span>
            <span className={`text-sm font-black ${isEmergency ? "text-red-700 font-extrabold" : "text-slate-800"}`}>
              {patient.vitals.bp} mmHg
            </span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pulse Rate</span>
            <span className="text-sm font-black text-slate-800">{patient.vitals.pulse} bpm</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Oxygen (SpO2)</span>
            <span className="text-sm font-black text-slate-800">{patient.vitals.spo2}%</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Temperature</span>
            <span className="text-sm font-black text-slate-800">{patient.vitals.temp}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Weight / Hb</span>
            <span className="text-sm font-black text-slate-800">
              {patient.vitals.weight} kg {patient.vitals.hb ? `/ ${patient.vitals.hb}` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Clinical History & ASHA Notes */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* ASHA Field Intake */}
          {patient.ashaNotes && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-4 ">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-black uppercase text-amber-900 tracking-wide">
                  ASHA Field Health Worker Notes
                </span>
              </div>
              <p className="text-xs text-amber-950 italic leading-relaxed">
                &quot;{patient.ashaNotes}&quot;
              </p>
            </div>
          )}

          {/* Medical History */}
          <div className="bg-white  rounded-3xl p-5 ">
            <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-700" />
              <span>Medical History & Chronic Conditions</span>
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-slate-700">
              {patient.medicalHistory.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Previous Consultations History */}
          <div className="bg-white  rounded-3xl p-5  flex-1">
            <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-700" />
              <span>Previous Consultations</span>
            </h3>
            {patient.consultationHistory.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No previous consultations recorded at this PHC.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {patient.consultationHistory.map((c, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                      <span className="font-bold text-slate-700">{c.date}</span>
                      <span>{c.doctor} · {c.facility}</span>
                    </div>
                    <p className="font-bold text-slate-900 mb-1">{c.assessment}</p>
                    <p className="text-slate-600 mb-2">{c.notes}</p>
                    <div className="flex flex-wrap gap-1">
                      {c.prescription.map((rx, rIdx) => (
                        <span key={rIdx} className="px-2 py-0.5 bg-white  rounded text-[11px] text-slate-700">
                          {rx}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Consultation & Prescription Form */}
        <div className="lg:col-span-7 bg-white  rounded-3xl p-5 ">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Current Visit Consultation</h2>
              <p className="text-xs text-slate-500">Record assessment, prescription, and follow-up plan</p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
              Dr. Sanjay Mehta (Medical Officer)
            </span>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-4 text-xs">
            {/* Symptoms Reported */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Active Symptoms / Complaints</label>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {patient.symptoms?.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 font-bold"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Clinical Assessment */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Clinical Assessment / Diagnosis *
              </label>
              <textarea
                rows={2}
                required
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                placeholder="E.g., Severe Pre-Eclampsia at 32 weeks with imminent eclampsia..."
                className="w-full p-2.5 rounded-xl  focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-slate-50 text-slate-900 font-medium"
              />
            </div>

            {/* Doctor Clinical Notes */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Doctor Examination & Clinical Notes
              </label>
              <textarea
                rows={3}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Examination findings, response to initial management, stabilization protocol..."
                className="w-full p-2.5 rounded-xl  focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-slate-50 text-slate-900"
              />
            </div>

            {/* Prescription Builder */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-teal-700" />
                  <span>Prescription & Medicines</span>
                </label>
                <span className="text-[11px] text-slate-500">PHC Pharmacy stock checked</span>
              </div>

              <div className="flex flex-col gap-2 mb-2">
                {prescriptions.map((rx, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl  gap-2"
                  >
                    <span className="font-semibold text-slate-800 truncate">{rx}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMed(idx)}
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Medicine input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter medicine, dosage, and duration (e.g., Tab Paracetamol 500mg TDS x 3d)..."
                  value={newMed}
                  onChange={(e) => setNewMed(e.target.value)}
                  className="flex-1 p-2 rounded-xl  text-xs bg-slate-50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddMed();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddMed}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Diagnostic Tests Quick Order */}
            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200">
              <span className="font-bold text-purple-900 block mb-1">
                Order Diagnostic Tests at PHC Laboratory:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Hemoglobin (Hemocue)",
                  "Random Blood Sugar",
                  "Urine Protein Dipstick",
                  "Rapid Malaria Antigen",
                ].map((testName) => (
                  <button
                    key={testName}
                    type="button"
                    onClick={() => orderDiagnosticTest(patient.id, testName)}
                    className="px-2.5 py-1 bg-white hover:bg-purple-100 border border-purple-300 text-purple-800 font-bold rounded-lg transition-colors text-[11px]"
                  >
                    + {testName}
                  </button>
                ))}
              </div>
            </div>

            {/* Next Follow-Up Date */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Next Follow-Up Schedule (ASHA Home Visit)
              </label>
              <div className="flex gap-2">
                {[
                  "Tomorrow (Day 1)",
                  "In 3 Days",
                  "In 7 Days",
                  "In 14 Days",
                  "After DH Discharge",
                ].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setNextFollowUpDate(d)}
                    className={`px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                      nextFollowUpDate === d
                        ? "bg-teal-700 text-white border-teal-700"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Footer Buttons */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-2">
              <button
                type="button"
                onClick={() => onOpenReferralModal(patient.id)}
                className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4 text-red-600" />
                <span>Escalate & Refer to DH</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-sm  flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Consultation & Complete Visit</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
