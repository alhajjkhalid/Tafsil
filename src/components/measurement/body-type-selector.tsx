'use client';

import { cn } from '@/lib/utils/cn';

type BodyType = 'slim' | 'regular' | 'broad';

interface BodyTypeSelectorProps {
  value: BodyType;
  onChange: (value: BodyType) => void;
  labels: {
    slim: string;
    regular: string;
    broad: string;
  };
}

function SlimSilhouette({ selected }: { selected: boolean }) {
  return (
    <svg width="60" height="100" viewBox="0 0 60 100" fill="none">
      <ellipse cx="30" cy="12" rx="8" ry="10" fill={selected ? '#C9A84C' : '#E8E0D0'} />
      <rect x="22" y="22" width="16" height="40" rx="4" fill={selected ? '#C9A84C' : '#E8E0D0'} />
      <rect x="22" y="62" width="7" height="30" rx="3" fill={selected ? '#C9A84C' : '#E8E0D0'} />
      <rect x="31" y="62" width="7" height="30" rx="3" fill={selected ? '#C9A84C' : '#E8E0D0'} />
      <rect x="10" y="24" width="12" height="6" rx="3" fill={selected ? '#C9A84C' : '#E8E0D0'} />
      <rect x="38" y="24" width="12" height="6" rx="3" fill={selected ? '#C9A84C' : '#E8E0D0'} />
    </svg>
  );
}

function RegularSilhouette({ selected }: { selected: boolean }) {
  return (
    <svg width="60" height="100" viewBox="0 0 60 100" fill="none">
      <ellipse cx="30" cy="12" rx="9" ry="10" fill={selected ? '#C9A84C' : '#E8E0D0'} />
      <rect x="18" y="22" width="24" height="40" rx="5" fill={selected ? '#C9A84C' : '#E8E0D0'} />
      <rect x="18" y="62" width="10" height="30" rx="4" fill={selected ? '#C9A84C' : '#E8E0D0'} />
      <rect x="32" y="62" width="10" height="30" rx="4" fill={selected ? '#C9A84C' : '#E8E0D0'} />
      <rect x="6" y="24" width="12" height="7" rx="3" fill={selected ? '#C9A84C' : '#E8E0D0'} />
      <rect x="42" y="24" width="12" height="7" rx="3" fill={selected ? '#C9A84C' : '#E8E0D0'} />
    </svg>
  );
}

function BroadSilhouette({ selected }: { selected: boolean }) {
  return (
    <svg width="60" height="100" viewBox="0 0 60 100" fill="none">
      <ellipse cx="30" cy="12" rx="10" ry="10" fill={selected ? '#C9A84C' : '#E8E0D0'} />
      <rect x="13" y="22" width="34" height="40" rx="6" fill={selected ? '#C9A84C' : '#E8E0D0'} />
      <rect x="15" y="62" width="12" height="30" rx="5" fill={selected ? '#C9A84C' : '#E8E0D0'} />
      <rect x="33" y="62" width="12" height="30" rx="5" fill={selected ? '#C9A84C' : '#E8E0D0'} />
      <rect x="2" y="24" width="11" height="8" rx="3" fill={selected ? '#C9A84C' : '#E8E0D0'} />
      <rect x="47" y="24" width="11" height="8" rx="3" fill={selected ? '#C9A84C' : '#E8E0D0'} />
    </svg>
  );
}

const bodyTypes: { value: BodyType; Icon: React.ComponentType<{ selected: boolean }> }[] = [
  { value: 'slim', Icon: SlimSilhouette },
  { value: 'regular', Icon: RegularSilhouette },
  { value: 'broad', Icon: BroadSilhouette },
];

export function BodyTypeSelector({ value, onChange, labels }: BodyTypeSelectorProps) {
  return (
    <div className="flex gap-4">
      {bodyTypes.map(({ value: type, Icon }) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={cn(
            'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200',
            value === type
              ? 'border-gold bg-gold/5'
              : 'border-cream-dark bg-white hover:border-gold/50'
          )}
        >
          <Icon selected={value === type} />
          <span
            className={cn(
              'text-sm font-arabic-body',
              value === type ? 'text-gold font-medium' : 'text-navy/60'
            )}
          >
            {labels[type]}
          </span>
        </button>
      ))}
    </div>
  );
}

export type { BodyType };
