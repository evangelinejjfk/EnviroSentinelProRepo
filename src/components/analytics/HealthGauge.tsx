import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface HealthGaugeProps {
  value: number;
  trend: number;
}

export function HealthGauge({ value, trend }: HealthGaugeProps) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const duration = 1800;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimated(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const radius = 85;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const arc = circumference * 0.75;
  const offset = arc - (animated / 100) * arc;

  const getColor = (v: number) => {
    if (v >= 70) return '#10b981';
    if (v >= 50) return '#eab308';
    if (v >= 30) return '#f97316';
    return '#ef4444';
  };

  const getLabel = (v: number) => {
    if (v >= 80) return 'Excellent';
    if (v >= 60) return 'Good';
    if (v >= 40) return 'Moderate';
    if (v >= 20) return 'Concerning';
    return 'Critical';
  };

  const color = getColor(animated);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-52 h-52">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-[135deg]">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${arc} ${circumference}`}
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke + 2}
            strokeLinecap="round"
            strokeDasharray={`${arc} ${circumference}`}
            strokeDashoffset={offset}
            className="transition-all duration-300 drop-shadow-lg"
            style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-extrabold text-slate-900 tabular-nums">{animated}</span>
          <span className="text-sm font-semibold mt-1" style={{ color }}>{getLabel(animated)}</span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <h3 className="text-base font-bold text-slate-800">Environmental Health Index</h3>
        <div className="flex items-center justify-center space-x-1.5 mt-1">
          {trend >= 0 ? (
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm font-semibold ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
          <span className="text-xs text-slate-400">vs last week</span>
        </div>
      </div>
    </div>
  );
}
