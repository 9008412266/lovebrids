import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  showHeader?: boolean;
  headerContent?: ReactNode;
}

const MobileLayout = ({ children, className, showHeader = false, headerContent }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className={cn(
        "mobile-container w-full bg-background border border-border/50 rounded-3xl shadow-2xl overflow-hidden",
        "max-w-[430px] min-h-[800px] max-h-[900px]",
        className
      )}>
        {showHeader && headerContent && (
          <div className="px-6 pt-6">
            {headerContent}
          </div>
        )}
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
