import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface NumberPickerProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export const NumberPicker: React.FC<NumberPickerProps> = ({
  value,
  onChange,
  min = 0,
  max = 120,
  label,
}) => {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-base font-bold text-slate-900">{label}</label>}
      <div className="flex items-center gap-3 bg-white p-2 rounded-xl border-2 border-slate-300 shadow-sm">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="tap-target w-14 h-14 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-2xl flex items-center justify-center disabled:opacity-30 border border-slate-300"
          style={{ minWidth: '56px', minHeight: '56px' }}
        >
          <Minus className="w-8 h-8" />
        </button>

        <div className="flex-1 text-center">
          <span className="text-3xl font-black text-slate-900">{value}</span>
          <span className="text-sm font-semibold text-slate-600 block">वर्षे / Years</span>
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="tap-target w-14 h-14 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-2xl flex items-center justify-center disabled:opacity-30 shadow"
          style={{ minWidth: '56px', minHeight: '56px' }}
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};
