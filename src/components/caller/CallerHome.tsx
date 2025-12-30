import { useState } from 'react';
import { Search, Star, Phone, Video } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/common/StatusBadge';
import { Host, HostStatus } from '@/types';
import { useNavigate } from 'react-router-dom';

// Mock data for hosts
const mockHosts: Host[] = [
  {
    id: '1',
    fullName: 'Priya Sharma',
    phone: '+919876543210',
    dateOfBirth: '1998-05-15',
    gender: 'female',
    city: 'Mumbai',
    country: 'India',
    role: 'host',
    rating: 4.8,
    pricePerMinute: 15,
    status: 'available',
    totalCalls: 234,
    totalMinutes: 1205,
    verificationStatus: 'approved',
    earnings: 18075,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    id: '2',
    fullName: 'Ananya Patel',
    phone: '+919876543211',
    dateOfBirth: '1999-08-22',
    gender: 'female',
    city: 'Delhi',
    country: 'India',
    role: 'host',
    rating: 4.9,
    pricePerMinute: 20,
    status: 'busy',
    totalCalls: 456,
    totalMinutes: 2340,
    verificationStatus: 'approved',
    earnings: 46800,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: '3',
    fullName: 'Riya Singh',
    phone: '+919876543212',
    dateOfBirth: '2000-03-10',
    gender: 'female',
    city: 'Bangalore',
    country: 'India',
    role: 'host',
    rating: 4.6,
    pricePerMinute: 12,
    status: 'available',
    totalCalls: 123,
    totalMinutes: 678,
    verificationStatus: 'approved',
    earnings: 8136,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
  },
  {
    id: '4',
    fullName: 'Meera Joshi',
    phone: '+919876543213',
    dateOfBirth: '1997-11-28',
    gender: 'female',
    city: 'Pune',
    country: 'India',
    role: 'host',
    rating: 4.7,
    pricePerMinute: 18,
    status: 'offline',
    totalCalls: 345,
    totalMinutes: 1890,
    verificationStatus: 'approved',
    earnings: 34020,
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150',
  },
];

const CallerHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<HostStatus | 'all'>('all');
  const navigate = useNavigate();

  const filteredHosts = mockHosts.filter((host) => {
    const matchesSearch = host.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || host.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleHostClick = (host: Host) => {
    navigate(`/caller/host/${host.id}`);
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Discover</h1>
          <p className="text-sm text-muted-foreground">Find your perfect match</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-lg">👤</span>
        </div>
      </div>

      {/* Search */}
      <div className="glass-card p-3">
        <div className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-2">
          <Search className="text-muted-foreground" size={20} />
          <Input
            placeholder="Search hosts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 focus-visible:ring-0 p-0"
          />
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'available', 'busy', 'offline'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              filterStatus === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            {status === 'all' ? 'All' : status === 'available' ? '🟢 Available' : status === 'busy' ? '🟡 In Session' : '⚫ Offline'}
          </button>
        ))}
      </div>

      {/* Hosts List */}
      <div className="space-y-4">
        {filteredHosts.map((host, index) => (
          <div
            key={host.id}
            onClick={() => handleHostClick(host)}
            className="glass-card p-4 cursor-pointer hover:bg-white/5 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={host.avatar}
                  alt={host.fullName}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${
                  host.status === 'available' ? 'bg-success' :
                  host.status === 'busy' ? 'bg-accent' : 'bg-muted-foreground'
                }`} />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{host.fullName}</h3>
                  <div className="flex items-center gap-1 text-accent">
                    <Star size={14} className="fill-current" />
                    <span className="text-sm font-medium">{host.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{host.city}, {host.country}</p>
                <div className="flex items-center justify-between mt-2">
                  <StatusBadge status={host.status} size="sm" />
                  <span className="text-sm font-semibold text-gradient">₹{host.pricePerMinute}/min</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {host.status === 'available' && (
              <div className="flex gap-2 mt-4">
                <Button
                  variant="gradient"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/caller/call/${host.id}?type=audio`);
                  }}
                >
                  <Phone size={16} />
                  Voice Call
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/caller/call/${host.id}?type=video`);
                  }}
                >
                  <Video size={16} />
                  Video Call
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CallerHome;
