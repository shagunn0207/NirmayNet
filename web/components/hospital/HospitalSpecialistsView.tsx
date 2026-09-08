"use client";

import React from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UserCheck, Phone, Stethoscope, Activity, Check, Clock, X } from "lucide-react";

export const HospitalSpecialistsView: React.FC = () => {
  const { specialists, updateSpecialistStatus } = useHealthcare();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">
            District Hospital Specialist Duty Roster
          </h2>
          <p className="text-xs text-slate-500">
            Real-time specialist on-call availability across surgical, maternal, and casualty wings
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="flex items-center gap-1 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Available ({specialists.filter((s) => s.status === "Available").length})</span>
          </span>
          <span className="flex items-center gap-1 text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Busy in OT/Ward ({specialists.filter((s) => s.status === "Busy").length})</span>
          </span>
        </div>
      </div>

      {/* Specialist Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialists.map((spec) => {
          const isAvailable = spec.status === "Available";
          const isBusy = spec.status === "Busy";

          return (
            <div
              key={spec.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-all ${
                isAvailable
                  ? "border-emerald-200 bg-emerald-50/20"
                  : isBusy
                  ? "border-amber-200 bg-amber-50/20"
                  : "border-slate-200 bg-slate-50/60"
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 font-bold text-sm flex items-center justify-center shrink-0">
                      👨‍⚕️
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                        {spec.name}
                      </h3>
                      <p className="text-xs font-bold text-blue-800 mt-0.5">
                        {spec.specialty}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isAvailable
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : isBusy
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {spec.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 mt-3 pt-2 border-t border-slate-100">
                  <p>Facility: <strong className="text-slate-800">{spec.facility}</strong></p>
                  <p>Current Active Cases: <strong className="text-slate-800">{spec.activePatients} patients</strong></p>
                  <p className="flex items-center gap-1 text-slate-500">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>Contact: <strong>{spec.contact}</strong></span>
                  </p>
                </div>
              </div>

              {/* Status Toggle Buttons */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">
                  Update Duty Status:
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => updateSpecialistStatus(spec.id, "Available")}
                    className={`py-1.5 rounded-lg font-bold transition-colors ${
                      isAvailable
                        ? "bg-emerald-700 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Available
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSpecialistStatus(spec.id, "Busy")}
                    className={`py-1.5 rounded-lg font-bold transition-colors ${
                      isBusy
                        ? "bg-amber-700 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    In OT / Ward
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSpecialistStatus(spec.id, "Unavailable")}
                    className={`py-1.5 rounded-lg font-bold transition-colors ${
                      spec.status === "Unavailable"
                        ? "bg-slate-800 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Off Duty
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
