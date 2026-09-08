"use client";

import React, { useState } from "react";
import { useHealthcare } from "@/context/HealthcareContext";
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  User,
  Plus,
} from "lucide-react";

export const PHCFollowupsView: React.FC = () => {
  const { followups, toggleFollowupStatus, addFollowupTask, patients } =
    useHealthcare();
  const [filter, setFilter] = useState<string>("ALL");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPatientId, setNewPatientId] = useState(patients[0]?.id || "");
  const [newDueDate, setNewDueDate] = useState("In 7 Days");
  const [newReason, setNewReason] = useState("");
  const [newAsha, setNewAsha] = useState("Savitribai Patil");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const p = patients.find((pt) => pt.id === newPatientId);
    if (!p || !newReason.trim()) return;

    addFollowupTask({
      patientId: p.id,
      patientName: p.name,
      phone: p.phone,
      category: p.riskCategory || "Other",
      dueDate: newDueDate,
      reason: newReason,
      ashaAssigned: newAsha,
    });

    setIsAddModalOpen(false);
    setNewReason("");
  };

  const filteredFollowups = followups.filter((f) => {
    if (filter === "ALL") return true;
    return f.status === filter;
  });

  const upcomingCount = followups.filter((f) => f.status === "Upcoming").length;
  const missedCount = followups.filter((f) => f.status === "Missed").length;
  const completedCount = followups.filter((f) => f.status === "Completed").length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">
            Care Continuity & Post-Discharge Follow-ups
          </h2>
          <p className="text-xs text-slate-500">
            ASHA home visits, maternal checks, and chronic disease adherence tracking
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      {/* Filter Tabs & Counters */}
      <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1">
        {[
          { id: "ALL", label: "All Follow-ups", count: followups.length },
          {
            id: "Upcoming",
            label: "Upcoming Due",
            count: upcomingCount,
            color: "text-blue-700",
          },
          {
            id: "Missed",
            label: "Missed / Overdue",
            count: missedCount,
            color: "text-red-700 font-black",
            urgent: missedCount > 0,
          },
          {
            id: "Completed",
            label: "Completed Visits",
            count: completedCount,
            color: "text-emerald-700",
          },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold border transition-colors shrink-0 ${
              filter === tab.id
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                filter === tab.id
                  ? "bg-slate-700 text-white"
                  : tab.urgent
                  ? "bg-red-100 text-red-800 animate-pulse"
                  : "bg-slate-200 text-slate-800"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Follow-ups List */}
      <div className="flex flex-col gap-3">
        {filteredFollowups.map((item) => {
          const isMissed = item.status === "Missed";
          const isCompleted = item.status === "Completed";
          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all text-xs ${
                isMissed
                  ? "border-red-300 bg-red-50/40"
                  : isCompleted
                  ? "border-slate-200 bg-slate-50/70 opacity-80"
                  : "border-slate-200 bg-white shadow-2xs"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  type="button"
                  onClick={() => toggleFollowupStatus(item.id)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isCompleted
                      ? "bg-emerald-600 border-emerald-700 text-white"
                      : "border-slate-300 hover:border-teal-600 bg-white"
                  }`}
                  title={isCompleted ? "Mark incomplete" : "Mark visit completed"}
                >
                  {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-extrabold text-sm ${isCompleted ? "line-through text-slate-500" : "text-slate-900"}`}>
                      {item.patientName}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold text-[10px]">
                      {item.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isMissed
                          ? "bg-red-100 text-red-800"
                          : isCompleted
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-slate-700 font-medium mt-1">
                    {item.reason}
                  </p>

                  <div className="flex items-center gap-4 text-slate-500 text-[11px] mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Due: <strong>{item.dueDate}</strong>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Assigned ASHA: <strong>{item.ashaAssigned}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <a
                  href={`tel:${item.phone}`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Phone className="w-3 h-3 text-teal-700" />
                  <span>Call ({item.phone})</span>
                </a>

                <button
                  type="button"
                  onClick={() => toggleFollowupStatus(item.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    isCompleted
                      ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      : "bg-emerald-700 hover:bg-emerald-800 text-white"
                  }`}
                >
                  {isCompleted ? "Re-open" : "Mark Visited"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Follow-up Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-xs">
            <h3 className="text-base font-extrabold text-slate-900 mb-1">
              Schedule New ASHA Follow-up
            </h3>
            <p className="text-slate-500 mb-4">
              Assign a post-consultation home visit check to an ASHA worker
            </p>

            <form onSubmit={handleCreate} className="flex flex-col gap-3.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Patient</label>
                <select
                  value={newPatientId}
                  onChange={(e) => setNewPatientId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.village})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Due Date</label>
                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  placeholder="E.g., In 3 Days / Tomorrow"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Follow-up Reason & Goals</label>
                <textarea
                  rows={2}
                  required
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="E.g., Check BP compliance and infant latching..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned ASHA</label>
                <select
                  value={newAsha}
                  onChange={(e) => setNewAsha(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  <option value="Savitribai Patil">Savitribai Patil (Chinchpada)</option>
                  <option value="Anita Shinde">Anita Shinde (Dhadgaon)</option>
                  <option value="Sunita Valvi">Sunita Valvi (Toranmal)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold"
                >
                  Assign Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
