"use client";

import React from "react";

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  label?: string;
  step?: number;
}

function Slider({
  min,
  max,
  value,
  onChange,
  unit = "",
  label,
  step = 1,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-navy/70 font-arabic-body">{label}</span>
          <span className="text-lg font-arabic-display font-semibold text-navy">
            {value}
            {unit && (
              <span className="text-sm text-navy/50 font-normal ms-1">
                {unit}
              </span>
            )}
          </span>
        </div>
      )}
      <div className="relative w-full h-10 flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 appearance-none bg-transparent cursor-pointer slider-input"
          style={{
            background: `linear-gradient(to right, #C9A84C 0%, #C9A84C ${percentage}%, #E8E0D0 ${percentage}%, #E8E0D0 100%)`,
            borderRadius: "9999px",
          }}
        />
      </div>
      <style jsx>{`
        .slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #1A1A2E;
          border: 3px solid #C9A84C;
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .slider-input::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .slider-input::-webkit-slider-thumb:active {
          transform: scale(1.05);
        }
        .slider-input::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #1A1A2E;
          border: 3px solid #C9A84C;
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .slider-input::-moz-range-thumb:hover {
          transform: scale(1.15);
        }
        .slider-input::-moz-range-track {
          height: 8px;
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
}

export { Slider };
export type { SliderProps };
