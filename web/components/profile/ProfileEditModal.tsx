import React, { useState, useEffect } from "react";
import { UserAccount } from "@/context/HealthcareContext";
import { X, Save, User, Phone, Building2, LogOut } from "lucide-react";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onSave: (updates: Partial<UserAccount>) => Promise<void>;
  onLogout: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSave,
  onLogout,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser && isOpen) {
      setName(currentUser.name || "");
      setPhone((currentUser as any).phone || "");
      setFacilityName((currentUser as any).facility_name || "");
      setError("");
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    const nameRegex = /^[A-Za-z\s.\-]+$/;
    if (!nameRegex.test(name)) {
      setError("Name must contain only letters, spaces, dots or hyphens.");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (phone && !phoneRegex.test(phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        name,
        phone,
        facility_name: facilityName,
      } as any);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                placeholder="Dr. John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="h-5 w-5" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  if (val.length <= 10) setPhone(val);
                }}
                className="pl-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                placeholder="10-digit number"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">Must be exactly 10 digits.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Facility Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Building2 className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                className="pl-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-800 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                placeholder="Primary Health Centre"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
