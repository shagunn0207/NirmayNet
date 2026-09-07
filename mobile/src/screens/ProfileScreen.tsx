import React from 'react';
import { UserCheck, MapPin, Phone, ShieldCheck, Globe, LogOut, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';

export const ProfileScreen: React.FC = () => {
  const { t, language, setLanguage, logout } = useApp();

  return (
    <div className="flex flex-col gap-4 py-1">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-5 rounded-3xl border-2 border-blue-800 shadow-lg flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white text-blue-900 flex items-center justify-center font-black text-3xl shadow-inner border-2 border-blue-400">
          👩‍⚕️
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
            आशा सेविका (ASHA Worker)
          </span>
          <h2 className="text-2xl font-black">सावित्रीबाई पाटील</h2>
          <p className="text-xs text-blue-200">ID: ASHA-NND-8842</p>
        </div>
      </div>

      {/* Sub-Centre Details */}
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-300 shadow-sm flex flex-col gap-2.5 font-bold text-sm text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="text-slate-600 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            <span>उपकेंद्र (Sub-Centre):</span>
          </span>
          <span className="font-black text-slate-900">चिंचपाडा (Chinchpada)</span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="text-slate-600 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span>प्राथमिक आरोग्य केंद्र:</span>
          </span>
          <span className="font-black text-slate-900">धडगाव (Dhadgaon PHC)</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-600 flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-700" />
            <span>मोबाईल:</span>
          </span>
          <span className="font-black text-slate-900">९८२३०११२३४</span>
        </div>
      </div>

      {/* Language Switcher Section */}
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-300 shadow-sm flex flex-col gap-3">
        <label className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-700" />
          <span>{t.selectLanguage}</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: 'mr', label: 'मराठी' },
            { key: 'hi', label: 'हिंदी' },
            { key: 'en', label: 'English' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setLanguage(item.key as Language)}
              className={`tap-target py-3 rounded-xl font-extrabold text-base border-2 transition-all ${
                language === item.key
                  ? 'bg-[#1565C0] text-white border-blue-900 shadow-md scale-102'
                  : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
              }`}
              style={{ minHeight: '48px' }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <button
        type="button"
        onClick={logout}
        className="tap-target w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-lg shadow-md border-2 border-red-900 flex items-center justify-center gap-2 mt-4"
        style={{ minHeight: '52px' }}
      >
        <LogOut className="w-6 h-6" />
        <span>लॉगआउट (Logout)</span>
      </button>
    </div>
  );
};
