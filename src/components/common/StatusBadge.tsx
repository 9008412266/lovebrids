import { cn } from '@/lib/utils';
import { HostStatus } from '@/types';

interface StatusBadgeProps {
  status: HostStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const StatusBadge = ({ status, size = 'md', showLabel = true }: StatusBadgeProps) => {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const statusConfig = {
    available: {
      color: 'bg-success',
      label: 'Available',
      glow: 'shadow-[0_0_8px_hsl(158,64%,52%)]',
    },
    busy: {
      color: 'bg-accent',
      label: 'In Session',
      glow: 'shadow-[0_0_8px_hsl(38,92%,50%)]',
    },
    offline: {
      color: 'bg-muted-foreground',
      label: 'Offline',
      glow: '',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div className={cn('rounded-full animate-pulse', sizes[size], config.color, config.glow)} />
      {showLabel && (
        <span className="text-sm text-muted-foreground">{config.label}</span>
      )}
    </div>
  );
};

export default StatusBadge;
