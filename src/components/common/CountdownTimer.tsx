import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface CountdownTimerProps {
  deadline: string;
  className?: string;
  showIcon?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  deadline,
  className = '',
  showIcon = true,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(deadline).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, isPast: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (timeLeft.isPast) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse ${className}`}>
        {showIcon && <AlertTriangle className="w-3.5 h-3.5" />}
        SLA Breached
      </span>
    );
  }

  const isUrgent = timeLeft.hours === 0 && timeLeft.minutes < 60;
  const isCritical = timeLeft.hours === 0 && timeLeft.minutes < 30;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold tracking-tight transition-colors ${
        isCritical
          ? 'bg-red-500 text-white animate-pulse shadow-sm shadow-red-200'
          : isUrgent
          ? 'bg-amber-100 text-amber-900 border border-amber-300'
          : 'bg-slate-100 text-slate-700 border border-slate-200'
      } ${className}`}
      title="Time until courier pickup cutoff"
    >
      {showIcon && <Clock className="w-3.5 h-3.5" />}
      {timeLeft.hours > 0 && `${timeLeft.hours}h `}
      {`${timeLeft.minutes}m `}
      <span className="text-[10px] opacity-75">{timeLeft.seconds}s</span>
    </span>
  );
};
