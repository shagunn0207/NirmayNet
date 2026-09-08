"use client";

import React, { useState } from "react";
import { Check, Clock } from "lucide-react";

interface ConfirmArrivalButtonProps {
  referralId: string;
  onConfirmed?: () => void;
}

export const ConfirmArrivalButton: React.FC<ConfirmArrivalButtonProps> = ({
  referralId,
  onConfirmed,
}) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleClick = () => {
    setConfirmed(true);
    if (onConfirmed) onConfirmed();
  };

  if (confirmed) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
        <Check className="w-3.5 h-3.5" />
        <span>Arrival Logged</span>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-colors shadow-xs"
    >
      <Clock className="w-3.5 h-3.5" />
      <span>Confirm Arrival</span>
    </button>
  );
};
