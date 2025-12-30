import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileLayout from '@/components/layout/MobileLayout';

const CallerCallScreen = () => {
  const { hostId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const callType = searchParams.get('type') || 'audio';
  
  const [callStatus, setCallStatus] = useState<'connecting' | 'ringing' | 'connected' | 'ended'>('connecting');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [balance, setBalance] = useState(1275);
  const pricePerMinute = 15;

  // Mock host data
  const host = {
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
  };

  useEffect(() => {
    // Simulate call connection
    const timeout1 = setTimeout(() => setCallStatus('ringing'), 1500);
    const timeout2 = setTimeout(() => setCallStatus('connected'), 4000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  useEffect(() => {
    if (callStatus === 'connected') {
      const interval = setInterval(() => {
        setDuration((d) => d + 1);
        // Deduct balance every minute
        if ((duration + 1) % 60 === 0) {
          setBalance((b) => Math.max(0, b - pricePerMinute));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [callStatus, duration]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      navigate('/caller/call-summary', {
        state: {
          hostName: host.name,
          duration,
          cost: Math.ceil(duration / 60) * pricePerMinute,
          callType,
        },
      });
    }, 1000);
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-full bg-gradient-to-b from-background via-background to-secondary/30 p-6 animate-fade-in">
        {/* Call Info */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          {/* Host Avatar */}
          <div className="relative">
            {callStatus === 'connecting' || callStatus === 'ringing' ? (
              <>
                <div className="absolute inset-0 rounded-full gradient-primary animate-ping opacity-30" style={{ transform: 'scale(1.2)' }} />
                <div className="absolute inset-0 rounded-full gradient-primary animate-pulse opacity-20" style={{ transform: 'scale(1.4)' }} />
              </>
            ) : null}
            
            <img
              src={host.avatar}
              alt={host.name}
              className={`w-32 h-32 rounded-full object-cover border-4 ${
                callStatus === 'connected' ? 'border-success' : 'border-primary'
              } shadow-xl`}
            />
            
            {callType === 'video' && callStatus === 'connected' && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/50 to-transparent" />
            )}
          </div>

          {/* Name & Status */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">{host.name}</h1>
            <p className={`text-sm mt-2 ${
              callStatus === 'connected' ? 'text-success' : 'text-muted-foreground'
            }`}>
              {callStatus === 'connecting' && 'Connecting...'}
              {callStatus === 'ringing' && 'Ringing...'}
              {callStatus === 'connected' && formatDuration(duration)}
              {callStatus === 'ended' && 'Call Ended'}
            </p>
          </div>

          {/* Balance Display */}
          {callStatus === 'connected' && (
            <div className="glass-card px-6 py-3 animate-scale-in">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Balance</p>
                  <p className="text-lg font-bold text-gradient">₹{balance}</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Rate</p>
                  <p className="text-lg font-bold text-accent">₹{pricePerMinute}/min</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call Controls */}
        <div className="space-y-6 mb-8">
          {callStatus === 'connected' && (
            <div className="flex justify-center gap-6">
              <Button
                variant={isMuted ? 'destructive' : 'secondary'}
                size="iconLg"
                className="rounded-full"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </Button>
              
              {callType === 'video' && (
                <Button
                  variant={isVideoOff ? 'destructive' : 'secondary'}
                  size="iconLg"
                  className="rounded-full"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                >
                  {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                </Button>
              )}
            </div>
          )}

          <div className="flex justify-center">
            <Button
              variant="endCall"
              size="iconXl"
              onClick={handleEndCall}
              className="animate-pulse"
            >
              <PhoneOff size={32} />
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default CallerCallScreen;
