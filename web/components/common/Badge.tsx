"use client";

import React from "react";
import { UrgencyLevel, ReferralStatus } from "@/lib/healthcareData";

interface UrgencyBadgeProps {
  priority: UrgencyLevel;
  size?: "sm" | "md";
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({
  priority,
  size = "md",
}) => {
  const isEmergency = priority === "EMERGENCY";
  const isUrgent = priority === "URGENT";

  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  if (isEmergency) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md font-extrabold tracking-wide uppercase bg-red-100 text-red-700 border border-red-300 ${sizeClasses}`}
      >
        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
        <span>Emergency</span>
      </span>
    );
  }

  if (isUrgent) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-md font-bold tracking-wide uppercase bg-amber-100 text-amber-800 border border-amber-300 ${sizeClasses}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
        <span>Urgent</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-bold tracking-wide uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
      <span>Routine</span>
    </span>
  );
};

interface ReferralStatusBadgeProps {
  status: ReferralStatus;
  size?: "sm" | "md";
}

export const ReferralStatusBadge: React.FC<ReferralStatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  const statusConfig: Record<
    ReferralStatus,
    { bg: string; text: string; border: string; label: string }
  > = {
    SENT: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      label: "SENT → Dispatched",
    },
    RECEIVED: {
      bg: "bg-sky-50",
      text: "text-sky-800",
      border: "border-sky-300",
      label: "RECEIVED at DH",
    },
    IN_TRANSIT: {
      bg: "bg-violet-50",
      text: "text-violet-800",
      border: "border-violet-300",
      label: "IN TRANSIT",
    },
    "PATIENT ARRIVED": {
      bg: "bg-purple-50",
      text: "text-purple-800",
      border: "border-purple-300",
      label: "PATIENT ARRIVED",
    },
    CONSULTED: {
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-300",
      label: "CONSULTED in Hospital",
    },
    COMPLETED: {
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-300",
      label: "COMPLETED / Discharge",
    },
    CANCELLED: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-300",
      label: "CANCELLED",
    },
    Accepted: {
      bg: "bg-teal-50",
      text: "text-teal-800",
      border: "border-teal-300",
      label: "Accepted",
    },
    Pending: {
      bg: "bg-orange-50",
      text: "text-orange-800",
      border: "border-orange-300",
      label: "Pending",
    },
  };

  const cfg = statusConfig[status] || {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-300",
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center rounded-md font-bold uppercase tracking-wider border ${cfg.bg} ${cfg.text} ${cfg.border} ${sizeClasses}`}
    >
      {cfg.label}
    </span>
  );
};
