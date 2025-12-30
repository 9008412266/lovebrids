import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileLayout from '@/components/layout/MobileLayout';

const HostSession = () => {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const pricePerMinute = 15;

  // Mock caller data
  const caller = {
    name: 'Rahul Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration((d) => d + 1);
      // Add earnings every second (proportional)
      setEarnings((e) => e + (pricePerMinute / 60));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    navigate('/host/session-summary', {
      state: {
        callerName: caller.name,
        duration,
        earnings: Math.round(earnings),
      },
    });
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-full bg-gradient-to-b from-background via-background to-secondary/30 p-6 animate-fade-in">
        {/* Call Info */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          {/* Caller Avatar with Video */}
          <div className="relative w-full aspect-[3/4] max-w-xs rounded-3xl overflow-hidden bg-secondary">
            <img
              src={caller.avatar}
              alt={caller.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Self View */}
            <div className="absolute bottom-4 right-4 w-24 h-32 rounded-xl overflow-hidden border-2 border-primary shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                alt="You"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Caller Info */}
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">{caller.name}</h1>
            <p className="text-success text-sm">{formatDuration(duration)}</p>
          </div>

          {/* Live Earnings Counter */}
          <div className="glass-card px-8 py-4 animate-scale-in">
            <div className="flex items-center gap-3">
              <Gift className="text-accent" size={24} />
              <div>
                <p className="text-xs text-muted-foreground">Earning Live</p>
                <p className="text-2xl font-bold text-gradient-gold">
                  ₹{earnings.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="space-y-6 mb-8">
          <div className="flex justify-center gap-6">
            <Button
              variant={isMuted ? 'destructive' : 'secondary'}
              size="iconLg"
              className="rounded-full"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </Button>
            
            <Button
              variant={isVideoOff ? 'destructive' : 'secondary'}
              size="iconLg"
              className="rounded-full"
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
            </Button>
          </div>

          <div className="flex justify-center">
            <Button
              variant="endCall"
              size="iconXl"
              onClick={handleEndCall}
            >
              <PhoneOff size={32} />
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default HostSession;
