import { useState } from 'react';
import { Phone, Video, PhoneIncoming, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HostHome = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const navigate = useNavigate();

  const stats = {
    todayEarnings: 450,
    todayCalls: 8,
    totalMinutes: 156,
    rating: 4.8,
  };

  // Simulate incoming call
  const simulateCall = () => {
    if (isAvailable) {
      setShowIncomingCall(true);
    }
  };

  if (showIncomingCall) {
    return (
      <div className="flex flex-col min-h-full p-6 items-center justify-center animate-fade-in">
        {/* Incoming Call Animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full gradient-primary animate-ring" />
          <div className="absolute inset-0 rounded-full gradient-primary animate-ring" style={{ animationDelay: '0.5s' }} />
          <div className="absolute inset-0 rounded-full gradient-primary animate-ring" style={{ animationDelay: '1s' }} />
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
            alt="Caller"
            className="w-32 h-32 rounded-full object-cover border-4 border-primary relative z-10"
          />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">Incoming Video Call</h1>
        <p className="text-muted-foreground mb-2">Rahul Kumar</p>
        <p className="text-sm text-accent font-medium mb-8">₹15/min</p>

        <div className="flex gap-6">
          <Button
            variant="endCall"
            size="iconXl"
            onClick={() => setShowIncomingCall(false)}
          >
            <Phone className="rotate-[135deg]" size={32} />
          </Button>
          <Button
            variant="call"
            size="iconXl"
            onClick={() => navigate('/host/session')}
            className="animate-pulse"
          >
            <Video size={32} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Hello, Priya! 👋</h1>
          <p className="text-sm text-muted-foreground">Ready to earn today?</p>
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground">Your Status</h2>
            <p className={`text-sm ${isAvailable ? 'text-success' : 'text-muted-foreground'}`}>
              {isAvailable ? '🟢 Available for calls' : '⚫ Offline'}
            </p>
          </div>
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`w-16 h-8 rounded-full relative transition-all duration-300 ${
              isAvailable ? 'bg-success' : 'bg-muted'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${
                isAvailable ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp size={16} />
            <span className="text-xs">Today's Earnings</span>
          </div>
          <p className="text-2xl font-bold text-gradient-gold">₹{stats.todayEarnings}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Phone size={16} />
            <span className="text-xs">Calls Today</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.todayCalls}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Clock size={16} />
            <span className="text-xs">Minutes Talked</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalMinutes}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <span className="text-xs">⭐ Rating</span>
          </div>
          <p className="text-2xl font-bold text-accent">{stats.rating}</p>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="glass-card p-4 space-y-3">
        <h3 className="font-semibold text-foreground">Tips to Earn More</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-accent">💡</span>
            <span>Stay online during peak hours (7 PM - 11 PM)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">💡</span>
            <span>Maintain a high rating for better visibility</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">💡</span>
            <span>Update your profile with a great photo</span>
          </li>
        </ul>
      </div>

      {/* Demo Button */}
      {isAvailable && (
        <Button 
          variant="gradient" 
          size="lg" 
          className="w-full"
          onClick={simulateCall}
        >
          <PhoneIncoming size={20} />
          Simulate Incoming Call (Demo)
        </Button>
      )}
    </div>
  );
};

export default HostHome;
