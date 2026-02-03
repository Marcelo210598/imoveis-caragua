import { getDealBgColor, getDealLabel } from '@/lib/utils';

interface DealBadgeProps {
  score: number;
  className?: string;
}

export default function DealBadge({ score, className = '' }: DealBadgeProps) {
  if (score < 60) return null;

  const label = getDealLabel(score);
  const colorClasses = getDealBgColor(score);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClasses} ${className}`}
    >
      🔥 {label}
    </span>
  );
}
