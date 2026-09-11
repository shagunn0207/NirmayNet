"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge } from "@/components/common/Badge";
import { PatientRecordModal } from "./PatientRecordModal";
import {
  Search,
  Filter,
  MoreHorizontal,
  ChevronDown,
  Download,
  Users,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface PHCPatientsViewProps {
  onOpenConsultation: (patientId: string) => void;
  onOpenReferralModal: (patientId: string) => void;
}

export const PHCPatientsView: React.FC<PHCPatientsViewProps> = ({
  onOpenConsultation,
  onOpenReferralModal,
}) => {
  const { patients } = useHealthcare();

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("All Status");
  const [genderFilter, setGenderFilter] = useState<string>("All Gender");
  const [ageFilter, setAgeFilter] = useState<string>("All Ages");
  
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const filteredPatients = patients.filter((p) => {
    // Text search
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.village.toLowerCase().includes(search.toLowerCase()) ||
      p.abhaId.includes(search) ||
      (p.token && p.token.toLowerCase().includes(search.toLowerCase()));

    // Priority filter
    const matchesPriority =
      priorityFilter === "All Status" ||
      (priorityFilter === "Emergency" && p.triagePriority === "EMERGENCY") ||
      (priorityFilter === "Urgent" && p.triagePriority === "URGENT") ||
      (priorityFilter === "Routine" && p.triagePriority === "ROUTINE");

    // Gender filter
    const matchesGender =
      genderFilter === "All Gender" || p.sex === genderFilter;

    // Age filter
    let matchesAge = true;
    if (ageFilter === "0-18") matchesAge = p.age <= 18;
    else if (ageFilter === "19-40") matchesAge = p.age > 18 && p.age <= 40;
    else if (ageFilter === "41-60") matchesAge = p.age > 40 && p.age <= 60;
    else if (ageFilter === "60+") matchesAge = p.age > 60;

    return matchesSearch && matchesPriority && matchesGender && matchesAge;
  });

  const handleViewRecord = (id: string) => {
    setSelectedPatientId(id);
    setIsRecordModalOpen(true);
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || null;

  // Metrics
  const totalCount = patients.length;
  const routineCount = patients.filter(p => p.triagePriority === "ROUTINE").length;
  const urgentCount = patients.filter(p => p.triagePriority === "URGENT").length;
  const emergencyCount = patients.filter(p => p.triagePriority === "EMERGENCY").length;

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total */}
        <div className="bg-white rounded-3xl p-6 flex items-center justify-between">
          <div>
            <div className="text-4xl font-black text-slate-900">{totalCount}</div>
            <div className="text-sm text-slate-500 font-medium mt-1">Total patients</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
        {/* Routine */}
        <div className="bg-white rounded-3xl p-6 flex items-center justify-between">
          <div>
            <div className="text-4xl font-black text-slate-900">{routineCount}</div>
            <div className="text-sm text-slate-500 font-medium mt-1">Routine patients</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-slate-50 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        {/* Urgent */}
        <div className="bg-white rounded-3xl p-6 flex items-center justify-between">
          <div>
            <div className="text-4xl font-black text-slate-900">{urgentCount}</div>
            <div className="text-sm text-slate-500 font-medium mt-1">Urgent patients</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-slate-50 text-amber-500 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>
        {/* Emergency */}
        <div className="bg-white rounded-3xl p-6 flex items-center justify-between">
          <div>
            <div className="text-4xl font-black text-slate-900">{emergencyCount}</div>
            <div className="text-sm text-slate-500 font-medium mt-1">Emergency patients</div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-slate-50 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-3xl overflow-hidden pt-2 flex flex-col flex-1 min-h-0 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        {/* Toolbar */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm rounded-full bg-slate-50 focus:outline-hidden focus:bg-slate-100 font-medium transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-bold">Filter</span>
              </div>
              
              {/* Gender Filter */}
              <div className="relative">
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="appearance-none bg-slate-50 hover:bg-slate-100 rounded-full pl-4 pr-9 py-2 text-sm font-bold text-slate-700 cursor-pointer focus:outline-hidden transition-colors"
                >
                  <option value="All Gender">All Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Age Filter */}
              <div className="relative">
                <select
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                  className="appearance-none bg-slate-50 hover:bg-slate-100 rounded-full pl-4 pr-9 py-2 text-sm font-bold text-slate-700 cursor-pointer focus:outline-hidden transition-colors"
                >
                  <option value="All Ages">All Ages</option>
                  <option value="0-18">0-18</option>
                  <option value="19-40">19-40</option>
                  <option value="41-60">41-60</option>
                  <option value="60+">60+</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Status/Priority Filter */}
              <div className="relative">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="appearance-none bg-slate-50 hover:bg-slate-100 rounded-full pl-4 pr-9 py-2 text-sm font-bold text-slate-700 cursor-pointer focus:outline-hidden transition-colors"
                >
                  <option value="All Status">All Status</option>
                  <option value="Routine">Routine</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Emergency">Emergency</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto flex-1 px-2 sm:px-6 pb-6">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold capitalize">
                <th className="px-6 py-4 w-10">
                  <input type="checkbox" className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 border-slate-300" />
                </th>
                <th className="px-4 py-4">Name</th>
                <th className="px-4 py-4">Last Visit</th>
                <th className="px-4 py-4">Age</th>
                <th className="px-4 py-4">Village</th>
                <th className="px-4 py-4">Gender</th>
                <th className="px-4 py-4">Diagnosis / Reason</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No patients match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => {
                  return (
                    <tr 
                      key={p.id} 
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer border-b border-slate-50 last:border-0"
                      onClick={() => handleViewRecord(p.id)}
                    >
                      <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                        <div className="w-5 h-5 rounded border border-slate-200 flex items-center justify-center bg-slate-50 group-hover:border-teal-400 transition-colors"></div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-lg shrink-0">
                            {p.sex === "Female" ? "👩" : "👨"}
                          </div>
                          <span className="font-extrabold text-slate-800">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-5 font-bold text-slate-500">
                        {p.consultationHistory[0]?.date || "10-04-2025"}
                      </td>
                      <td className="px-4 py-5 font-bold text-slate-500">{p.age}</td>
                      <td className="px-4 py-5 font-bold text-slate-500">{p.village}</td>
                      <td className="px-4 py-5 font-bold text-slate-500">{p.sex}</td>
                      <td className="px-4 py-5 font-bold text-slate-700 truncate max-w-[200px]">
                        {p.visitReason}
                      </td>
                      <td className="px-4 py-5">
                        <UrgencyBadge priority={p.triagePriority} size="sm" />
                      </td>
                      <td className="px-4 py-5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block group/menu">
                          <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                          {/* Dropdown Menu */}
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 overflow-hidden text-left p-1">
                            <button
                              onClick={() => {
                                setIsRecordModalOpen(false);
                                onOpenConsultation(p.id);
                              }}
                              className="w-full px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl text-left transition-colors"
                            >
                              Start Consultation
                            </button>
                            <button
                              onClick={() => handleViewRecord(p.id)}
                              className="w-full px-4 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl text-left transition-colors mt-0.5"
                            >
                              View Record
                            </button>
                            <button
                              onClick={() => {
                                setIsRecordModalOpen(false);
                                onOpenReferralModal(p.id);
                              }}
                              className="w-full px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl text-left transition-colors mt-0.5"
                            >
                              Refer to Hospital
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PatientRecordModal 
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        patient={selectedPatient}
        onOpenConsultation={onOpenConsultation}
        onOpenReferralModal={onOpenReferralModal}
      />
    </div>
  );
};
