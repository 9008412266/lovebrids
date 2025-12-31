import { useState, useEffect, forwardRef } from 'react';
import { Search, Star, Phone, Video, Shuffle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/common/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HostData {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  city: string | null;
  date_of_birth: string | null;
  availability: 'online' | 'busy' | 'offline';
  host_settings: {
    voice_rate_per_minute: number;
    video_rate_per_minute: number;
    rating: number;
    total_calls: number;
    category: string;
    languages: string[];
  } | null;
}

const categories = ['All', 'Star', 'Relationship', 'Marriage', 'Confidence'];

const CallerHome = forwardRef<HTMLDivElement, {}>((_, ref) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'busy' | 'offline'>('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hosts, setHosts] = useState<HostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHosts();
    fetchWalletBalance();
  }, []);

  const fetchHosts = async () => {
    try {
      // Fetch female profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, avatar_url, city, date_of_birth, availability')
        .eq('gender', 'female');

      if (profilesError) throw profilesError;

      // Fetch all host settings
      const { data: hostSettings, error: settingsError } = await supabase
        .from('host_settings')
        .select('user_id, voice_rate_per_minute, video_rate_per_minute, rating, total_calls, category, languages');

      if (settingsError) throw settingsError;

      // Merge data
      const hostsWithSettings: HostData[] = (profiles || [])
        .map(profile => {
          const settings = hostSettings?.find(s => s.user_id === profile.user_id);
          if (!settings) return null;
          return {
            ...profile,
            host_settings: settings,
          } as HostData;
        })
        .filter((h): h is HostData => h !== null);

      setHosts(hostsWithSettings);
    } catch (error: any) {
      console.error('Error fetching hosts:', error);
      toast.error('Failed to load hosts');
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setWalletBalance(Number(data.balance) || 0);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

  const filteredHosts = hosts.filter((host) => {
    const matchesSearch = host.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || host.availability === filterStatus;
    const matchesCategory = selectedCategory === 'All' || host.host_settings?.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const availableHosts = hosts.filter(h => h.availability === 'online');
  const hasAvailableHosts = availableHosts.length > 0;

  const handleHostClick = (host: HostData) => {
    navigate(`/caller/host/${host.user_id}`);
  };

  const handleRandomCall = () => {
    if (hasAvailableHosts) {
      const randomHost = availableHosts[Math.floor(Math.random() * availableHosts.length)];
      navigate(`/caller/call/${randomHost.user_id}?type=audio`);
    }
  };

  const getAge = (dob: string | null) => {
    if (!dob) return '??';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div ref={ref} className="p-4 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground italic">Love Birds</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/caller/wallet')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-primary text-primary text-sm font-medium hover:bg-primary/10 transition-colors"
          >
            ₹{walletBalance.toFixed(2)}
            <span className="text-lg">+</span>
          </button>
          <button 
            onClick={() => navigate('/caller/profile')}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden"
          >
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* Random Call Banner */}
      <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="font-semibold text-foreground">Connect & Make Friends</p>
            <p className="text-sm text-primary">@ ₹5/min only!</p>
          </div>
          <Button 
            variant="gradient" 
            size="sm"
            onClick={handleRandomCall}
            disabled={!hasAvailableHosts}
            className="flex items-center gap-2"
          >
            Random Call
            <Shuffle size={16} />
          </Button>
        </div>
      </div>

      {/* Featured Experts Header */}
      <div>
        <h2 className="font-semibold text-foreground text-lg">Featured Experts</h2>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Hosts List */}
      <div className="space-y-3">
        {filteredHosts.length > 0 ? (
          filteredHosts.map((host, index) => (
            <div
              key={host.id}
              onClick={() => handleHostClick(host)}
              className="bg-card rounded-2xl p-4 cursor-pointer hover:bg-card/80 transition-all duration-300 animate-slide-up border border-border/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-4">
                {/* Avatar with Status */}
                <div className="relative">
                  <img
                    src={host.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                    alt={host.full_name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-accent/30"
                  />
                  <div className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                    host.availability === 'online' ? 'bg-success' :
                    host.availability === 'busy' ? 'bg-accent' : 'bg-muted-foreground'
                  }`} />
                  <StatusBadge status={host.availability === 'online' ? 'available' : host.availability === 'busy' ? 'busy' : 'offline'} size="sm" className="absolute -bottom-1 left-1/2 -translate-x-1/2" />
                  <div className="flex items-center gap-0.5 mt-1 justify-center">
                    <Star size={12} className="fill-accent text-accent" />
                    <span className="text-xs font-medium text-foreground">{host.host_settings?.rating || 4.5}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{host.full_name.split(' ')[0]}</h3>
                      <span className="text-muted-foreground text-sm">• {getAge(host.date_of_birth)} Y</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{host.host_settings?.languages?.join(' • ') || 'Hindi'}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{host.city || 'India'}</p>
                  <p className="text-sm text-primary">{host.host_settings?.category || 'Confidence'}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-semibold text-foreground">₹{host.host_settings?.voice_rate_per_minute || 5}/min</span>
                    
                    {/* Call Button - Only show for available hosts */}
                    {host.availability === 'online' ? (
                      <Button
                        variant="gradient"
                        size="sm"
                        className="px-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/caller/call/${host.user_id}?type=audio`);
                        }}
                      >
                        <Phone size={14} />
                        Call Now
                      </Button>
                    ) : host.availability === 'busy' ? (
                      <Button variant="secondary" size="sm" disabled className="px-4">
                        <Clock size={14} />
                        Busy
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" disabled className="px-4 opacity-50">
                        <Phone size={14} />
                        Offline
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {hosts.length === 0 ? 'No verified hosts available yet' : 'No hosts match your filters'}
            </p>
            <Button variant="gradient" onClick={handleRandomCall} disabled={!hasAvailableHosts}>
              <Shuffle size={16} />
              Try Random Call
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

CallerHome.displayName = 'CallerHome';

export default CallerHome;