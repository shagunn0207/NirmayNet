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

  // Filters for patient selection
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.village.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = genderFilter === "All" || p.sex === genderFilter;
    let matchesAge = true;
    if (ageFilter !== "All") {
      const age = p.age;
      if (ageFilter === "0-18") matchesAge = age <= 18;
      else if (ageFilter === "19-40") matchesAge = age > 18 && age <= 40;
      else if (ageFilter === "41-60") matchesAge = age > 40 && age <= 60;
      else if (ageFilter === "60+") matchesAge = age > 60;
    }
    return matchesSearch && matchesGender && matchesAge;
  });

  const selectedPatient = patients.find((p) => p.id === patientId) || patients[0];
  const hubLocation = destinationFacility.includes("Shahada") ? "Shahada" : "Nandurbar";

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
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-8 text-sm">
        <div className="flex flex-col gap-8">
          {/* Section 1: Patient Selection */}
          <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-4">
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs">1</span>
              Patient Selection
            </h3>
            {/* Patient Selector with Filters */}
            <div className="flex flex-col gap-2">
              <label className="font-bold text-slate-700">Select Patient *</label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search name/village..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white font-medium"
                />
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="p-2 rounded-lg border border-slate-200 bg-white font-medium w-24 shrink-0"
                >
                  <option value="All">All Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <select
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                  className="p-2 rounded-lg border border-slate-200 bg-white font-medium w-24 shrink-0"
                >
                  <option value="All">All Age</option>
                  <option value="0-18">0-18</option>
                  <option value="19-40">19-40</option>
                  <option value="41-60">41-60</option>
                  <option value="60+">60+</option>
                </select>
              </div>

              {filteredPatients.length > 0 ? (
                <select
                  value={patientId}
                  onChange={(e) => {
                    setPatientId(e.target.value);
                    const p = patients.find((pt) => pt.id === e.target.value);
                    if (p) {
                      setPriority(p.triagePriority);
                      setReason(p.visitReason || "");
                    }
                  }}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                >
                  {filteredPatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.age}y, {p.sex}) — {p.village} [{p.triagePriority}]
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 text-red-600 text-sm font-bold bg-red-50 rounded-xl border border-red-200">
                  No patient found matching "{searchQuery}" in the database.
                </div>
              )}
            </div>
          </div>

          {/* Middle Row: Routing and Clinical */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
            
            {/* Section 2: Routing */}
            <div className="flex flex-col gap-5">
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs">2</span>
                Routing & Priority
              </h3>

              {/* Destination Facility */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Destination Facility *
                </label>
                <select
                  value={destinationFacility}
                  onChange={(e) => setDestinationFacility(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                >
                  <option value="District Civil Hospital, Nandurbar">
                    District Civil Hospital, Nandurbar (34 km)
                  </option>
                  <option value="Sub-District Hospital, Shahada">
                    Sub-District Hospital, Shahada (28 km)
                  </option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Specialty Department *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:outline-hidden focus:ring-2 focus:ring-teal-500"
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

              {/* Priority Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  Referral Priority / Urgency *
                </label>
                <div className="flex gap-2">
                  {(["EMERGENCY", "URGENT", "ROUTINE"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setPriority(lvl)}
                      className={`flex-1 py-2.5 rounded-xl font-bold border transition-colors ${
                        priority === lvl
                          ? lvl === "EMERGENCY"
                            ? "bg-red-700 text-white border-red-700 shadow-sm"
                            : lvl === "URGENT"
                            ? "bg-amber-700 text-white border-amber-700 shadow-sm"
                            : "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Clinical Handover */}
            <div className="flex flex-col gap-5">
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs">3</span>
                Clinical Handover
              </h3>

              {/* Referral Reason */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Referral Reason *</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Primary clinical diagnosis requiring transfer..."
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-semibold focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Clinical Summary */}
              <div className="flex-1 flex flex-col">
                <label className="font-bold text-slate-700 block mb-1.5">
                  Clinical Summary & Pre-Transit Treatment Given
                </label>
                <textarea
                  value={clinicalSummary}
                  onChange={(e) => setClinicalSummary(e.target.value)}
                  placeholder="Details of stabilization, medications administered at PHC, reason higher facility is needed..."
                  className="w-full flex-1 p-3 rounded-xl border border-slate-200 bg-slate-50 min-h-[120px] resize-none focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Dispatch */}
          <div className="p-5 bg-red-50/50 border border-red-100 rounded-3xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Ambulance className="w-4 h-4" />
              </div>
              <div>
                <span className="font-black text-red-950 block text-base">Dispatch 108 Ambulance</span>
                <span className="text-xs text-red-800 font-medium">
                  Auto-alerts {hubLocation} Emergency Hub
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={requestAmbulance}
              onChange={(e) => setRequestAmbulance(e.target.checked)}
              className="w-5 h-5 text-red-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5"
          >
            <Send className="w-4 h-4" />
            <span>Dispatch Emergency Referral</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
