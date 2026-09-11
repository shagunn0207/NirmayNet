"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UserCheck, Phone, Stethoscope, Activity, Check, Clock, X, BellRing, ChevronDown } from "lucide-react";

export const HospitalSpecialistsView: React.FC = () => {
  const { specialists, updateSpecialistStatus } = useHealthcare();

  const handlePageSpecialist = (name: string) => {
    alert(`Urgent page sent to Dr. ${name}.`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            Specialist Roster
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time specialist on-call availability and duty status
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {specialists.filter((s) => s.status === "Available").length} Ready
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {specialists.filter((s) => s.status === "Busy").length} In OT/Ward
          </span>
        </div>
      </div>

      {/* Table Structure */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Specialist Details</th>
              <th className="px-6 py-4">Facility & Contact</th>
              <th className="px-6 py-4 text-center">Active Cases</th>
              <th className="px-6 py-4 text-center">Duty Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {specialists.map((spec) => {
              const isAvailable = spec.status === "Available";
              const isBusy = spec.status === "Busy";
              const isOffDuty = spec.status === "Unavailable";

              return (
                <tr key={spec.id} className="hover:bg-slate-50/50 transition-colors group">
                  {/* Name & Specialty */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                        isAvailable ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
                        isBusy ? "bg-amber-50 border-amber-100 text-amber-700" :
                        "bg-slate-50 border-slate-200 text-slate-500"
                      }`}>
                        👨‍⚕️
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                          {spec.name}
                        </h3>
                        <p className="text-xs font-bold text-blue-600 mt-0.5">
                          {spec.specialty}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="font-semibold text-slate-800">{spec.hospital}</span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {spec.contact}
                      </span>
                    </div>
                  </td>

                  {/* Active Cases */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 bg-slate-100 text-slate-700 text-xs font-black rounded-md border border-slate-200">
                      {spec.activePatients}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <div className="relative group/dropdown">
                        <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider border transition-colors ${
                          isAvailable
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : isBusy
                            ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : isBusy ? "bg-amber-500" : "bg-slate-400"}`} />
                          {spec.status === "Unavailable" ? "Off Duty" : spec.status}
                          <ChevronDown className="w-3 h-3 opacity-50" />
                        </button>
                        
                        {/* Hover Dropdown Menu */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-32 bg-white rounded-xl border border-slate-200 shadow-xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-20 overflow-hidden">
                          <div className="p-1 flex flex-col gap-0.5">
                            <button
                              onClick={() => updateSpecialistStatus(spec.id, "Available")}
                              className="px-3 py-1.5 text-left text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg"
                            >
                              Available
                            </button>
                            <button
                              onClick={() => updateSpecialistStatus(spec.id, "Busy")}
                              className="px-3 py-1.5 text-left text-xs font-bold text-amber-700 hover:bg-amber-50 rounded-lg"
                            >
                              In OT / Ward
                            </button>
                            <button
                              onClick={() => updateSpecialistStatus(spec.id, "Unavailable")}
                              className="px-3 py-1.5 text-left text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                              Off Duty
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handlePageSpecialist(spec.name)}
                      className={`inline-flex items-center justify-center p-2 rounded-xl border transition-colors ${
                        isAvailable 
                          ? "text-blue-600 border-blue-200 hover:bg-blue-50 bg-blue-50/50" 
                          : "text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-slate-600"
                      }`}
                      title="Send Urgent Page"
                    >
                      <BellRing className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {specialists.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No Specialists Found</h3>
            <p className="text-xs text-slate-500 mt-1">Roster is currently empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};
