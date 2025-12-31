import { useState, useEffect } from 'react';
import { Phone, Video, PhoneIncoming, Clock, TrendingUp, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const HostHome = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    todayEarnings: 0,
    todayCalls: 0,
    totalMinutes: 0,
    rating: 4.5,
  });
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHostData();
  }, []);

  const fetchHostData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile(profileData);
      setIsAvailable(profileData?.availability === 'online');

      // Check verification status
      const { data: kycData } = await supabase
        .from('kyc_details')
        .select('verification_status')
        .eq('user_id', user.id)
        .maybeSingle();

      setIsVerified(kycData?.verification_status === 'approved');

      // Fetch host settings
      const { data: hostSettings } = await supabase
        .from('host_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (hostSettings) {
        setStats(prev => ({
          ...prev,
          totalMinutes: hostSettings.total_minutes || 0,
          rating: hostSettings.rating || 4.5,
        }));
      }

      // Fetch today's sessions
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: sessions } = await supabase
        .from('call_sessions')
        .select('*')
        .eq('host_id', user.id)
        .gte('created_at', today.toISOString())
        .eq('status', 'completed');

      if (sessions) {
        const todayEarnings = sessions.reduce((sum, s) => sum + Number(s.host_earnings || 0), 0);
        setStats(prev => ({
          ...prev,
          todayEarnings,
          todayCalls: sessions.length,
        }));
      }
    } catch (error: any) {
      console.error('Error fetching host data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    if (!isVerified) {
      toast.error('Please complete verification to go online');
      navigate('/host/verification');
      return;
    }

    setUpdating(true);
    try {
      const newStatus = isAvailable ? 'offline' : 'online';
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('update-availability', {
        body: { availability: newStatus },
      });

      if (response.error) throw response.error;

      setIsAvailable(!isAvailable);
      toast.success(`You are now ${newStatus}`);
    } catch (error: any) {
      console.error('Error updating availability:', error);
      toast.error(error.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Simulate incoming call
  const simulateCall = () => {
    if (isAvailable) {
      setShowIncomingCall(true);
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold text-foreground">Hello, {profile?.full_name?.split(' ')[0] || 'Host'}! 👋</h1>
          <p className="text-sm text-muted-foreground">
            {isVerified ? 'Ready to earn today?' : 'Complete verification to start'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut size={20} />
          </Button>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
            <img
              src={profile?.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Verification Alert */}
      {!isVerified && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
          <p className="text-destructive font-medium">Verification Required</p>
          <p className="text-sm text-destructive/70 mt-1">Complete KYC to start accepting calls</p>
          <Button 
            variant="destructive" 
            size="sm" 
            className="mt-2"
            onClick={() => navigate('/host/verification')}
          >
            Complete Verification
          </Button>
        </div>
      )}

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
            onClick={toggleAvailability}
            disabled={updating || !isVerified}
            className={`w-16 h-8 rounded-full relative transition-all duration-300 ${
              isAvailable ? 'bg-success' : 'bg-muted'
            } ${(!isVerified || updating) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            <span className="text-xs">Total Minutes</span>
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
      {isAvailable && isVerified && (
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