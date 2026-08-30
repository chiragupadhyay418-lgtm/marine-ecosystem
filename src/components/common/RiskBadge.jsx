import React from 'react';
import { AlertOctagon, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export function getRiskConfig(level) {
  const normalized = (level || '').toUpperCase();
  switch (normalized) {
    case 'CRITICAL':
      return {
        label: 'CRITICAL',
        badgeBg: 'bg-red-500/15 text-red-400 border-red-500/30',
        cardBorder: 'border-red-500/50',
        textAccent: 'text-red-400',
        progressBg: 'bg-red-500',
        glow: 'shadow-red-500/10',
        Icon: AlertOctagon,
      };
    case 'HIGH':
      return {
        label: 'HIGH',
        badgeBg: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
        cardBorder: 'border-orange-500/50',
        textAccent: 'text-orange-400',
        progressBg: 'bg-orange-500',
        glow: 'shadow-orange-500/10',
        Icon: AlertTriangle,
      };
    case 'MODERATE':
      return {
        label: 'MODERATE',
        badgeBg: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
        cardBorder: 'border-yellow-500/50',
        textAccent: 'text-yellow-400',
        progressBg: 'bg-yellow-500',
        glow: 'shadow-yellow-500/10',
        Icon: Info,
      };
    case 'LOW':
    default:
      return {
        label: 'LOW',
        badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        cardBorder: 'border-emerald-500/50',
        textAccent: 'text-emerald-400',
        progressBg: 'bg-emerald-500',
        glow: 'shadow-emerald-500/10',
        Icon: CheckCircle2,
      };
  }
}

export default function RiskBadge({ level = 'LOW', score = null, size = 'md', className = '' }) {
  const config = getRiskConfig(level);
  const Icon = config.Icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2 font-bold',
  }[size] || 'px-2.5 py-1 text-xs gap-1.5';

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  }[size] || 'h-3.5 w-3.5';

  return (
    <span
      className={`inline-flex items-center rounded-md border font-semibold uppercase tracking-wider ${config.badgeBg} ${sizeClasses} ${className}`}
    >
      <Icon className={iconSizes} />
      <span>{config.label}</span>
      {score !== null && score !== undefined && (
        <span className="ml-1 pl-1 border-l border-current/30 font-black">
          {score}
        </span>
      )}
    </span>
  );
}
