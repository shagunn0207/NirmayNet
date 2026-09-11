import React, { useState } from "react";
import { X, UserPlus, Heart, Hash, MapPin, Phone, Building2 } from "lucide-react";
import { useHealthcare } from "@/context/HealthcareContext";
import { PatientRecord } from "@/lib/healthcareData";

interface RegisterPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterPatientModal({ isOpen, onClose }: RegisterPatientModalProps) {
  const { addPatient } = useHealthcare();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    sex: "Male" as "Male" | "Female" | "Other",
    bloodGroup: "O+",
    phone: "",
    village: "",
    abhaId: "",
    reason: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addPatient({
      name: formData.name,
      age: parseInt(formData.age, 10) || 0,
      sex: formData.sex,
      phone: formData.phone,
      village: formData.village,
      abhaId: formData.abhaId,
      bloodGroup: formData.bloodGroup,
      registrationDate: new Date().toISOString().split("T")[0],
      triagePriority: "LOW",
      vitals: {
        bp: "120/80",
        hr: 75,
        temp: 98.6,
        spO2: 98
      },
      medicalHistory: [],
      consultationHistory: [],
      allergies: "None",
      ashaNotes: `Walk-in registration. Reason: ${formData.reason}`,
      visitReason: formData.reason,
      symptoms: [formData.reason],
      currentStatus: "Waiting"
    } as any);

    onClose();
    // Reset form
    setFormData({
      name: "",
      age: "",
      sex: "Male",
      bloodGroup: "O+",
      phone: "",
      village: "",
      abhaId: "",
      reason: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden mt-10 md:mt-0 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Register Walk-in Patient</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">District Hospital Outpatient Department</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto shrink">
          <form id="register-patient-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Personal Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                  <input
                    required
                    type="text"
                    pattern="^[A-Za-z\s\-\.]+$"
                    title="Name should only contain letters, spaces, hyphens, and periods"
                    minLength={2}
                    maxLength={50}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter patient's full name"
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Age *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="Years"
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Sex *</label>
                  <select
                    value={formData.sex}
                    onChange={(e) => setFormData({...formData, sex: e.target.value as any})}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Medical Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Medical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Heart className="w-3 h-3 text-red-500" /> Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Hash className="w-3 h-3 text-blue-500" /> ABHA ID
                  </label>
                  <input
                    type="text"
                    pattern="^\d{2}-\d{4}-\d{4}-\d{4}$"
                    title="Format must be XX-XXXX-XXXX-XXXX (14 digits)"
                    value={formData.abhaId}
                    onChange={(e) => {
                      // Auto-format ABHA ID: XX-XXXX-XXXX-XXXX
                      let val = e.target.value.replace(/\D/g, '').substring(0, 14);
                      let formatted = val;
                      if (val.length > 2) formatted = val.slice(0, 2) + '-' + val.slice(2);
                      if (val.length > 6) formatted = formatted.slice(0, 7) + '-' + val.slice(6);
                      if (val.length > 10) formatted = formatted.slice(0, 12) + '-' + val.slice(10);
                      setFormData({...formData, abhaId: formatted});
                    }}
                    placeholder="XX-XXXX-XXXX-XXXX"
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Contact & Location */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Contact & Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-green-500" /> Phone Number *
                  </label>
                  <input
                    required
                    type="tel"
                    pattern="^[6-9]\d{9}$"
                    title="Enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').substring(0, 10);
                      setFormData({...formData, phone: val});
                    }}
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-amber-500" /> Village / Address *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({...formData, village: e.target.value})}
                    placeholder="Village Name"
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Visit Reason */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Visit Details</h3>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Reason for Visit *</label>
                <textarea
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  rows={2}
                  placeholder="Primary symptoms or clinical reason for walk-in..."
                  className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 resize-none"
                />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="register-patient-form"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Register Patient
          </button>
        </div>
      </div>
    </div>
  );
}
