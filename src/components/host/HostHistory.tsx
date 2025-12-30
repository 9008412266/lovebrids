import { Phone, Video, Clock, Star } from 'lucide-react';

interface SessionHistory {
  id: string;
  callerName: string;
  callerAvatar: string;
  type: 'audio' | 'video';
  duration: number;
  earnings: number;
  rating: number;
  timestamp: Date;
}

const mockHistory: SessionHistory[] = [
  {
    id: '1',
    callerName: 'Rahul Kumar',
    callerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    type: 'video',
    duration: 12 * 60 + 34,
    earnings: 189,
    rating: 5,
    timestamp: new Date('2024-01-15T14:30:00'),
  },
  {
    id: '2',
    callerName: 'Amit Sharma',
    callerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
    type: 'audio',
    duration: 8 * 60 + 15,
    earnings: 124,
    rating: 4,
    timestamp: new Date('2024-01-15T12:15:00'),
  },
  {
    id: '3',
    callerName: 'Vikram Singh',
    callerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    type: 'video',
    duration: 25 * 60 + 45,
    earnings: 386,
    rating: 5,
    timestamp: new Date('2024-01-15T10:00:00'),
  },
  {
    id: '4',
    callerName: 'Arjun Patel',
    callerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    type: 'audio',
    duration: 5 * 60 + 22,
    earnings: 81,
    rating: 4,
    timestamp: new Date('2024-01-14T22:30:00'),
  },
];

const HostHistory = () => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }
  };

  // Group by date
  const groupedHistory = mockHistory.reduce((acc, session) => {
    const dateKey = formatDate(session.timestamp);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(session);
    return acc;
  }, {} as Record<string, SessionHistory[]>);

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Earnings History</h1>
      </div>

      {/* History List */}
      {Object.entries(groupedHistory).map(([date, sessions]) => (
        <div key={date} className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">{date}</h3>
          {sessions.map((session, index) => (
            <div
              key={session.id}
              className="glass-card p-4 flex items-center gap-4 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={session.callerAvatar}
                alt={session.callerName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground">{session.callerName}</h4>
                  {session.type === 'video' ? (
                    <Video size={14} className="text-primary" />
                  ) : (
                    <Phone size={14} className="text-primary" />
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{formatDuration(session.duration)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-accent fill-current" />
                    <span>{session.rating}</span>
                  </div>
                </div>
              </div>
              <span className="text-lg font-bold text-gradient-gold">+₹{session.earnings}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default HostHistory;
