import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Clock, Phone, Crown, Medal, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type TimeFilter = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  city: string | null;
  total_minutes: number;
  total_calls: number;
}

interface AdminLeaderboardProps {
  onBack: () => void;
}

const AdminLeaderboard = ({ onBack }: AdminLeaderboardProps) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('daily');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const timeFilters: { id: TimeFilter; label: string }[] = [
    { id: 'daily', label: 'Today' },
    { id: 'weekly', label: 'This Week' },
    { id: 'monthly', label: 'This Month' },
    { id: 'yearly', label: 'This Year' },
  ];

  useEffect(() => {
    fetchLeaderboard();
  }, [timeFilter]);

  const getDateRange = () => {
    const now = new Date();
    let startDate: Date;

    switch (timeFilter) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        const dayOfWeek = now.getDay();
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    return startDate.toISOString();
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const startDate = getDateRange();

      // First get call sessions for female hosts within date range
      const { data: sessions, error: sessionsError } = await supabase
        .from('call_sessions')
        .select('host_id, duration_seconds')
        .gte('start_time', startDate)
        .eq('status', 'completed');

      if (sessionsError) throw sessionsError;

      // Aggregate by host_id
      const hostStats: Record<string, { total_seconds: number; total_calls: number }> = {};
      
      sessions?.forEach((session) => {
        if (session.host_id) {
          if (!hostStats[session.host_id]) {
            hostStats[session.host_id] = { total_seconds: 0, total_calls: 0 };
          }
          hostStats[session.host_id].total_seconds += session.duration_seconds || 0;
          hostStats[session.host_id].total_calls += 1;
        }
      });

      const hostIds = Object.keys(hostStats);

      if (hostIds.length === 0) {
        setLeaderboard([]);
        setLoading(false);
        return;
      }

      // Get female host profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url, city')
        .eq('gender', 'female')
        .in('user_id', hostIds);

      if (profilesError) throw profilesError;

      // Build leaderboard
      const leaderboardData: LeaderboardEntry[] = (profiles || [])
        .map((profile) => ({
          user_id: profile.user_id,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          city: profile.city,
          total_minutes: Math.round((hostStats[profile.user_id]?.total_seconds || 0) / 60),
          total_calls: hostStats[profile.user_id]?.total_calls || 0,
        }))
        .sort((a, b) => b.total_minutes - a.total_minutes)
        .slice(0, 20);

      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={22} />;
      case 3:
        return <Award className="text-amber-600" size={20} />;
      default:
        return <span className="text-muted-foreground font-bold w-6 text-center">{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/30';
      default:
        return 'bg-secondary border-border';
    }
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <div className="flex items-center gap-2">
          <Trophy className="text-primary" size={24} />
          <h1 className="text-xl font-bold text-foreground">Host Leaderboard</h1>
        </div>
      </div>

      {/* Time Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {timeFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setTimeFilter(filter.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              timeFilter === filter.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="glass-card p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-muted rounded-full" />
                  <div className="w-12 h-12 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-32" />
                    <div className="h-3 bg-muted rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Trophy className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">No call data for this period</p>
          </div>
        ) : (
          leaderboard.map((entry, index) => (
            <div
              key={entry.user_id}
              className={`glass-card p-4 border ${getRankBg(index + 1)} animate-slide-up`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 flex justify-center">
                  {getRankIcon(index + 1)}
                </div>
                
                <Avatar className="w-12 h-12 border-2 border-border">
                  <AvatarImage src={entry.avatar_url || ''} alt={entry.full_name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {entry.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{entry.full_name}</p>
                  <p className="text-xs text-muted-foreground">{entry.city || 'Unknown'}</p>
                </div>

                <div className="text-right space-y-1">
                  <div className="flex items-center justify-end gap-1 text-primary">
                    <Clock size={14} />
                    <span className="font-bold">{entry.total_minutes} min</span>
                  </div>
                  <div className="flex items-center justify-end gap-1 text-muted-foreground text-xs">
                    <Phone size={12} />
                    <span>{entry.total_calls} calls</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminLeaderboard;
