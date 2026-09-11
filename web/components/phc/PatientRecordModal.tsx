import React from "react";
import { X, MapPin, Stethoscope, Send } from "lucide-react";
import { Patient } from "@/context/HealthcareContext";
import { UrgencyBadge } from "@/components/common/Badge";

interface PatientRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onOpenConsultation: (patientId: string) => void;
  onOpenReferralModal: (patientId: string) => void;
}

export const PatientRecordModal: React.FC<PatientRecordModalProps> = ({
  isOpen,
  onClose,
  patient,
  onOpenConsultation,
  onOpenReferralModal,
}) => {
  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white/95 backdrop-blur-3xl border border-white/20 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-transparent">
          <h2 className="text-lg font-black text-slate-900">Comprehensive Health Record</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 text-xs">
          
          {/* Patient Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-900 font-black text-2xl flex items-center justify-center shrink-0">
                {patient.sex === "Female" ? "👩" : "👨"}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-xl font-black text-slate-900">
                    {patient.name}
                  </h3>
                  <UrgencyBadge priority={patient.triagePriority} />
                  {patient.riskCategory && (
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-900 text-[10px] font-bold">
                      {patient.riskCategory} High-Risk
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap font-medium">
                  <span>{patient.age} yrs · {patient.sex}</span>
                  <span>·</span>
                  <span>Blood: <strong className="text-slate-700">{patient.bloodGroup}</strong></span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {patient.village}
                  </span>
                  <span>·</span>
                  <span>ABHA ID: <strong className="text-slate-700">{patient.abhaId}</strong></span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenConsultation(patient.id);
                }}
                className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Consult</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenReferralModal(patient.id);
                }}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Refer DH</span>
              </button>
            </div>
          </div>

          {/* Current Vitals Card */}
          <div className="bg-slate-50/50 p-6 rounded-3xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-3">
              Recorded Vitals (Current Visit)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] uppercase text-slate-400 block font-bold mb-0.5">BP</span>
                <span className="font-black text-slate-900 text-sm">
                  {patient.vitals.bp}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] uppercase text-slate-400 block font-bold mb-0.5">Pulse</span>
                <span className="font-black text-slate-900 text-sm">
                  {patient.vitals.pulse} bpm
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] uppercase text-slate-400 block font-bold mb-0.5">SpO2</span>
                <span className="font-black text-slate-900 text-sm">
                  {patient.vitals.spo2}%
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] uppercase text-slate-400 block font-bold mb-0.5">Temp</span>
                <span className="font-black text-slate-900 text-sm">
                  {patient.vitals.temp}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] uppercase text-slate-400 block font-bold mb-0.5">Weight / Hb</span>
                <span className="font-black text-slate-900 text-sm">
                  {patient.vitals.weight}kg {patient.vitals.hb ? `/ ${patient.vitals.hb}` : ""}
                </span>
              </div>
            </div>
          </div>

          {/* ASHA Field Intake Notes */}
          {patient.ashaNotes && (
            <div className="bg-amber-50/50 p-6 rounded-3xl">
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-900 block mb-2">
                ASHA Field Health Worker Notes
              </span>
              <p className="text-amber-950 italic leading-relaxed text-sm">
                "{patient.ashaNotes}"
              </p>
            </div>
          )}

          {/* Medical History & Chronic Conditions */}
          <div className="bg-slate-50/50 p-6 rounded-3xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-3">
              Medical History & Allergies
            </span>
            <ul className="space-y-2">
              {patient.medicalHistory.map((h, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-slate-700 text-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Consultation History */}
          <div className="bg-slate-50/50 p-6 rounded-3xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-3">
              Past PHC Consultations & Prescriptions ({patient.consultationHistory.length})
            </span>
            {patient.consultationHistory.length === 0 ? (
              <p className="text-slate-400 italic text-sm">No previous consultations on record.</p>
            ) : (
              <div className="space-y-4">
                {patient.consultationHistory.map((c, idx) => (
                  <div key={idx} className="p-5 bg-white rounded-2xl shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 text-[11px] mb-2 font-medium">
                      <span className="font-bold text-slate-800 text-xs">{c.date}</span>
                      <span>{c.doctor} · {c.facility}</span>
                    </div>
                    <p className="font-black text-slate-900 text-sm mb-1">{c.assessment}</p>
                    <p className="text-slate-600 mb-3 text-sm">{c.notes}</p>
                    <div className="flex flex-wrap gap-2">
                      {c.prescription.map((rx, rIdx) => (
                        <span
                          key={rIdx}
                          className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 font-bold text-[11px] shadow-sm"
                        >
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
      </div>
    </div>
  );
};
