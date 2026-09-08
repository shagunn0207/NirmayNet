"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { Modal } from "@/components/common/Modal";
import { UrgencyLevel } from "@/lib/healthcareData";
import { Send, Ambulance, AlertOctagon, Building2 } from "lucide-react";

interface CreateReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPatientId?: string;
}

export const CreateReferralModal: React.FC<CreateReferralModalProps> = ({
  isOpen,
  onClose,
  defaultPatientId,
}) => {
  const { patients, createHospitalReferral } = useHealthcare();

  const [patientId, setPatientId] = useState(
    defaultPatientId || patients[0]?.id || ""
  );
  const [destinationFacility, setDestinationFacility] = useState(
    "District Civil Hospital, Nandurbar"
  );
  const [department, setDepartment] = useState(
    "Obstetrics & Gynecology (SNCU / HDU)"
  );
  const [priority, setPriority] = useState<UrgencyLevel>("EMERGENCY");
  const [reason, setReason] = useState(
    "Critical maternal pre-eclampsia with acute blood pressure elevation"
  );
  const [clinicalSummary, setClinicalSummary] = useState(
    "Patient stabilized at Dhadgaon PHC with loading dose Magnesium Sulfate and Labetalol. Needs urgent specialist obstetrician intervention and ICU standby."
  );
  const [requestAmbulance, setRequestAmbulance] = useState(true);

  const selectedPatient = patients.find((p) => p.id === patientId) || patients[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    createHospitalReferral({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      age: selectedPatient.age,
      sex: selectedPatient.sex,
      referringFacility: "PHC Dhadgaon",
      referringDoctor: "Dr. Sanjay Mehta",
      destinationFacility,
      department,
      reason,
      clinicalSummary,
      priority,
      vitals: selectedPatient.vitals,
      ambulanceRequested: requestAmbulance,
      ambulanceStatus: requestAmbulance ? "Dispatched" : "Not Required",
      ambulanceEta: requestAmbulance ? "20-25 mins" : undefined,
      driverContact: requestAmbulance ? "Santosh Gavit (9823450912)" : undefined,
      vehicleNumber: requestAmbulance ? "MH-39-AM-1081" : undefined,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create District Hospital Referral"
      subtitle="Escalate patient to secondary/tertiary hospital with 108 transit coordination"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
        {/* Patient Selector */}
        <div>
          <label className="font-bold text-slate-700 block mb-1">Select Patient *</label>
          <select
            value={patientId}
            onChange={(e) => {
              setPatientId(e.target.value);
              const p = patients.find((pt) => pt.id === e.target.value);
              if (p) {
                setPriority(p.triagePriority);
                setReason(p.visitReason);
              }
            }}
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.age}y, {p.sex}) — {p.village} [{p.triagePriority}]
              </option>
            ))}
          </select>
        </div>

        {/* Destination Facility & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Destination Facility *
            </label>
            <select
              value={destinationFacility}
              onChange={(e) => setDestinationFacility(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
            >
              <option value="District Civil Hospital, Nandurbar">
                District Civil Hospital, Nandurbar (34 km)
              </option>
              <option value="Sub-District Hospital, Shahada">
                Sub-District Hospital, Shahada (28 km)
              </option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Specialty Department *
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
            >
              <option value="Obstetrics & Gynecology (SNCU / HDU)">
                Obstetrics & Gynecology (SNCU / HDU)
              </option>
              <option value="Cardiology / Emergency Medicine">
                Cardiology / Emergency Medicine
              </option>
              <option value="Pediatrics & Neonatology">
                Pediatrics & Neonatology
              </option>
              <option value="Orthopedics & Trauma">
                Orthopedics & Trauma
              </option>
              <option value="General Medicine / ICU">
                General Medicine / ICU
              </option>
            </select>
          </div>
        </div>

        {/* Priority Selector */}
        <div>
          <label className="font-bold text-slate-700 block mb-1">
            Referral Priority / Urgency *
          </label>
          <div className="flex gap-2">
            {(["EMERGENCY", "URGENT", "ROUTINE"] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setPriority(lvl)}
                className={`flex-1 py-2 rounded-xl font-bold border transition-colors ${
                  priority === lvl
                    ? lvl === "EMERGENCY"
                      ? "bg-red-700 text-white border-red-700"
                      : lvl === "URGENT"
                      ? "bg-amber-700 text-white border-amber-700"
                      : "bg-emerald-700 text-white border-emerald-700"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Referral Reason */}
        <div>
          <label className="font-bold text-slate-700 block mb-1">Referral Reason *</label>
          <input
            type="text"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Primary clinical diagnosis requiring transfer..."
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
          />
        </div>

        {/* Clinical Summary */}
        <div>
          <label className="font-bold text-slate-700 block mb-1">
            Clinical Summary & Pre-Transit Treatment Given
          </label>
          <textarea
            rows={3}
            value={clinicalSummary}
            onChange={(e) => setClinicalSummary(e.target.value)}
            placeholder="Details of stabilization, medications administered at PHC, reason higher facility is needed..."
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
          />
        </div>

        {/* 108 Ambulance Dispatch Toggle */}
        <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Ambulance className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <span className="font-bold text-red-950 block">Request 108 Emergency Ambulance</span>
              <span className="text-[11px] text-red-800">
                Immediately notifies Nandurbar 108 emergency dispatch center
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={requestAmbulance}
            onChange={(e) => setRequestAmbulance(e.target.checked)}
            className="w-4 h-4 text-red-600 rounded"
          />
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 mt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch Referral to District Hospital</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
