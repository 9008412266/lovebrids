import { useLocation, useNavigate } from 'react-router-dom';
import { Gift, Clock, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileLayout from '@/components/layout/MobileLayout';

const HostSessionSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { callerName, duration, earnings } = location.state || {
    callerName: 'Caller',
    duration: 0,
    earnings: 0,
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
          {/* Success Animation */}
          <div className="relative">
            <div className="absolute inset-0 gradient-gold rounded-full blur-xl opacity-40 animate-pulse" />
            <div className="relative bg-accent/20 p-8 rounded-full">
              <Gift className="text-accent" size={64} />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Session Complete! 🎉</h1>
            <p className="text-muted-foreground">
              Great conversation with {callerName}
            </p>
          </div>

          {/* Earnings Card */}
          <div className="w-full glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 gradient-gold opacity-20 blur-3xl rounded-full" />
            <div className="relative text-center">
              <p className="text-muted-foreground mb-2">You Earned</p>
              <p className="text-5xl font-bold text-gradient-gold">₹{earnings}</p>
            </div>
          </div>

          {/* Session Details */}
          <div className="w-full glass-card p-4 space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-muted-foreground" />
                <span className="text-muted-foreground">Duration</span>
              </div>
              <span className="font-semibold text-foreground">{formatDuration(duration)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Star size={20} className="text-muted-foreground" />
                <span className="text-muted-foreground">Rating</span>
              </div>
              <div className="flex items-center gap-1 text-accent">
                <Star size={16} className="fill-current" />
                <span className="font-semibold">Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 mt-8">
          <Button 
            variant="gradient" 
            size="lg" 
            className="w-full"
            onClick={() => navigate('/host')}
          >
            Back to Home
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default HostSessionSummary;
