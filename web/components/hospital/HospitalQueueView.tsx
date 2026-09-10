"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import { UrgencyBadge, ReferralStatusBadge } from "@/components/common/Badge";
import { Search, Filter, Clock, MapPin, Building2, User, Check, CheckCircle } from "lucide-react";

export const HospitalQueueView: React.FC = () => {
  const { hospitalReferrals, specialists, updateHospitalReferralStatus } = useHealthcare();
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");

  const departments = [
    "ALL",
    "Obstetrics & Gynecology (SNCU / HDU)",
    "Cardiology / Emergency Medicine",
    "Pediatrics",
    "Orthopedics",
    "General Medicine",
  ];

  const filteredQueue = hospitalReferrals.filter((r) => {
    const matchesSearch =
      r.patientName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.referringFacility.toLowerCase().includes(search.toLowerCase());

    const matchesDept =
      selectedDept === "ALL" || r.department.includes(selectedDept) || selectedDept.includes(r.department);

    return matchesSearch && matchesDept;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">
            District Hospital Casualty & Specialty Admissions Queue
          </h2>
          <p className="text-xs text-slate-500">
            Live patient intake across departments at District Civil Hospital Nandurbar
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, referral ID, facility..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Department Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-bold text-slate-500 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Department:
        </span>
        {departments.map((dept) => (
          <button
            key={dept}
            type="button"
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 rounded-xl font-bold border transition-colors shrink-0 ${
              selectedDept === dept
                ? "bg-blue-800 text-white border-blue-800 shadow-xs"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            {dept === "ALL" ? "All Departments" : dept.split("/")[0]}
          </button>
        ))}
      </div>

      {/* Queue Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Ref ID</th>
              <th className="py-3 px-4">Patient Name</th>
              <th className="py-3 px-4">Urgency</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Assigned Specialist</th>
              <th className="py-3 px-4">Referring PHC</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Ambulance Transit</th>
              <th className="py-3 px-4">Queue Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredQueue.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  No hospital queue records found under the selected filters.
                </td>
              </tr>
            ) : (
              filteredQueue.map((item) => {
                const isEmergency = item.priority === "EMERGENCY";
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isEmergency ? "bg-red-50/30" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4 font-black text-slate-900 whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900 text-sm">{item.patientName}</div>
                      <div className="text-slate-500 text-[11px]">
                        {item.age}y · {item.sex}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <UrgencyBadge priority={item.priority} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {item.department}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="font-semibold text-blue-900">
                        {item.assignedDoctor || "Triage Officer (Casualty)"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {item.referringFacility}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <ReferralStatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {item.ambulanceRequested ? (
                        <span className="font-bold text-red-700 text-[11px] block">
                          108: {item.ambulanceStatus || "In Transit"}
                          {item.ambulanceEta ? ` (${item.ambulanceEta})` : ""}
                        </span>
                      ) : (
                        <span className="text-slate-400">Self Transport</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.status === "SENT" || item.status === "IN_TRANSIT" ? (
                        <button
                          type="button"
                          onClick={() => updateHospitalReferralStatus(item.id, "PATIENT ARRIVED")}
                          className="px-2.5 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Confirm Arrival</span>
                        </button>
                      ) : item.status === "PATIENT ARRIVED" || item.status === "Accepted" ? (
                        <button
                          type="button"
                          onClick={() => updateHospitalReferralStatus(item.id, "CONSULTED")}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Start Consult</span>
                        </button>
                      ) : item.status === "CONSULTED" ? (
                        <button
                          type="button"
                          onClick={() => updateHospitalReferralStatus(item.id, "COMPLETED")}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 font-semibold text-xs">Completed</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
