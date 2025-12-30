import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileLayout from '@/components/layout/MobileLayout';

const CallerCallSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hostName, duration, cost, callType } = location.state || {
    hostName: 'Host',
    duration: 0,
    cost: 0,
    callType: 'audio',
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-full p-6 animate-fade-in">
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          {/* Success Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-success rounded-full blur-xl opacity-30 animate-pulse" />
            <div className="relative bg-success/20 p-6 rounded-full">
              <CheckCircle className="text-success" size={48} />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Call Ended</h1>
            <p className="text-muted-foreground">Your {callType} call with {hostName} has ended</p>
          </div>

          {/* Summary Card */}
          <div className="w-full glass-card p-6 space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-muted-foreground" />
                <span className="text-muted-foreground">Duration</span>
              </div>
              <span className="font-semibold text-foreground">{formatDuration(duration)}</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">Amount Deducted</span>
              <span className="text-xl font-bold text-gradient">₹{cost}</span>
            </div>
          </div>

          {/* Rate Host */}
          <div className="w-full glass-card p-6 space-y-4">
            <p className="text-center text-muted-foreground">Rate your experience</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="p-2 hover:scale-110 transition-transform"
                >
                  <Star
                    size={32}
                    className="text-accent hover:fill-current"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 mt-8">
          <Button 
            variant="gradient" 
            size="lg" 
            className="w-full"
            onClick={() => navigate('/caller')}
          >
            Back to Home
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default CallerCallSummary;
