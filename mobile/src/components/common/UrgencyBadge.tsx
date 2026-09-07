import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { UrgencyLevel } from '../../types';
import { useApp } from '../../context/AppContext';

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({
  urgency,
  size = 'md',
  showLabel = true,
}) => {
  const { t } = useApp();

  let bgClass = 'bg-[#388E3C] text-white';
  let label = t.routine;
  let Icon = CheckCircle2;

  if (urgency === 'EMERGENCY') {
    bgClass = 'bg-[#D32F2F] text-white';
    label = t.emergency;
    Icon = AlertCircle;
  } else if (urgency === 'URGENT') {
    bgClass = 'bg-[#F57C00] text-white';
    label = t.urgent;
    Icon = AlertTriangle;
  }

  const paddingClass =
    size === 'lg' ? 'px-4 py-2.5 text-lg font-black' : size === 'sm' ? 'px-2 py-1 text-xs font-bold' : 'px-3 py-1.5 text-sm font-bold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full shadow-sm tracking-wide ${bgClass} ${paddingClass}`}
    >
      <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
      <Icon className={size === 'lg' ? 'w-6 h-6' : size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      {showLabel && <span>{label}</span>}
    </span>
  );
};
