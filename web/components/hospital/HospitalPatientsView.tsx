"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge } from "@/components/common/Badge";
import {
  Search,
  User,
  MapPin,
  Phone,
  FileText,
  Clock,
  HeartPulse,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const HospitalPatientsView: React.FC = () => {
  const { patients } = useHealthcare();
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);

  const filtered = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.village.toLowerCase().includes(search.toLowerCase()) ||
      p.abhaId.includes(search);
    
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

  const toggleExpand = (id: string) => {
    if (expandedPatientId === id) {
      setExpandedPatientId(null);
    } else {
      setExpandedPatientId(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">
            District Master Patient Health Directory
          </h2>
          <p className="text-xs text-slate-500">
            Unified Longitudinal Health Records connecting ASHA field notes, PHC visits, and Hospital charts
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full md:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, ABHA ID, village..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
          </div>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium shrink-0"
          >
            <option value="All">All Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium shrink-0"
          >
            <option value="All">All Age</option>
            <option value="0-18">0-18</option>
            <option value="19-40">19-40</option>
            <option value="41-60">41-60</option>
            <option value="60+">60+</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl overflow-hidden flex flex-col flex-1 min-h-0 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100">
        <div className="overflow-x-auto overflow-y-auto flex-1 px-2 sm:px-4 pb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                <th className="px-4 py-4 w-10"></th>
                <th className="px-4 py-4">Patient Name & Demographics</th>
                <th className="px-4 py-4">ABHA ID</th>
                <th className="px-4 py-4">Origin / Village</th>
                <th className="px-4 py-4">Priority / Risk</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500 text-sm">
                    No patient records found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isExpanded = expandedPatientId === p.id;
                  
                  return (
                    <React.Fragment key={p.id}>
                      {/* Main Row */}
                      <tr 
                        className={`transition-colors cursor-pointer group ${isExpanded ? 'bg-slate-50/80' : 'hover:bg-slate-50/50'}`}
                        onClick={() => toggleExpand(p.id)}
                      >
                        <td className="px-4 py-4 text-slate-400 group-hover:text-slate-600 transition-colors">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 font-black text-lg flex items-center justify-center shrink-0 border border-blue-100">
                              {p.sex === "Female" ? "👩" : "👨"}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                              <span className="text-xs text-slate-500 mt-0.5">
                                {p.age} yrs · {p.sex}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-1 rounded-md border border-teal-100">
                            {p.abhaId}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700">{p.village}</span>
                            <span className="text-[10px] text-slate-400 mt-0.5">Contact: {p.phone}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <UrgencyBadge priority={p.triagePriority} size="sm" />
                            {p.riskCategory && (
                              <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">
                                {p.riskCategory} High-Risk
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(p.id);
                            }}
                            className={`px-4 py-2 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5 ${
                              isExpanded 
                                ? "bg-slate-200 text-slate-700"
                                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                            }`}
                          >
                            <span>{isExpanded ? "Close" : "View Record"}</span>
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Record Panel */}
                      {isExpanded && (
                        <tr className="bg-slate-50/80 border-b-2 border-slate-200">
                          <td colSpan={6} className="px-4 py-0">
                            <div className="py-6 px-4 md:px-10 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-200">
                              
                              {/* Vitals Summary */}
                              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">
                                  Current Clinical Vitals
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">BP</span>
                                    <span className="text-sm font-black text-slate-900">{p.vitals.bp}</span>
                                  </div>
                                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Pulse</span>
                                    <span className="text-sm font-black text-slate-900">{p.vitals.pulse} bpm</span>
                                  </div>
                                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">SpO2</span>
                                    <span className="text-sm font-black text-slate-900">{p.vitals.spo2}%</span>
                                  </div>
                                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Temp</span>
                                    <span className="text-sm font-black text-slate-900">{p.vitals.temp}</span>
                                  </div>
                                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Weight / Hb</span>
                                    <span className="text-sm font-black text-slate-900">
                                      {p.vitals.weight}kg {p.vitals.hb ? `/ ${p.vitals.hb}` : ""}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* ASHA Notes */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {p.ashaNotes && (
                                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 col-span-1 md:col-span-2">
                                    <span className="font-bold text-amber-900 text-[10px] uppercase block mb-2 tracking-wider">
                                      ASHA Field Notes
                                    </span>
                                    <p className="text-xs text-amber-900/80 leading-relaxed font-medium">
                                      "{p.ashaNotes}"
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Medical History & Consultations */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                                  <span className="font-bold text-slate-800 text-[10px] uppercase block mb-3 tracking-wider">
                                    Medical History & Allergies
                                  </span>
                                  <div className="flex flex-col gap-2">
                                    {p.medicalHistory && p.medicalHistory.length > 0 ? (
                                      <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                                        {p.medicalHistory.map((item, idx) => (
                                          <li key={idx}>{item}</li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <span className="text-xs text-slate-400">No known medical history.</span>
                                    )}
                                    {p.allergies && (
                                      <div className="mt-2 text-xs">
                                        <span className="font-bold text-red-700">Allergies: </span>
                                        <span className="text-slate-600">{p.allergies}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                                  <span className="font-bold text-slate-800 text-[10px] uppercase block mb-3 tracking-wider">
                                    Past Consultations
                                  </span>
                                  <div className="flex flex-col gap-3 max-h-32 overflow-y-auto pr-1">
                                    {p.consultationHistory && p.consultationHistory.length > 0 ? (
                                      p.consultationHistory.map((consult, idx) => (
                                        <div key={idx} className="flex flex-col gap-1 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                                          <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-900">{consult.doctor}</span>
                                            <span className="text-[10px] text-slate-400">{consult.date}</span>
                                          </div>
                                          <span className="text-xs text-slate-600 line-clamp-1">{consult.assessment}</span>
                                        </div>
                                      ))
                                    ) : (
                                      <span className="text-xs text-slate-400">No previous consultations.</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
