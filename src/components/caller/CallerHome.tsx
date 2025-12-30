import { useState } from 'react';
import { Search, Star, Phone, Video, Shuffle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/common/StatusBadge';
import { Host, HostStatus } from '@/types';
import { useNavigate } from 'react-router-dom';

// Mock data for verified hosts only
const mockHosts: Host[] = [
  {
    id: '1',
    fullName: 'Priya Sharma',
    phone: '+919876543210',
    dateOfBirth: '1998-05-15',
    gender: 'female',
    city: 'Hyderabad, TS',
    country: 'India',
    role: 'host',
    rating: 4.8,
    pricePerMinute: 5,
    status: 'available',
    totalCalls: 234,
    totalMinutes: 1205,
    verificationStatus: 'approved',
    earnings: 18075,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    languages: ['Telugu', 'Hindi'],
    category: 'Confidence',
  },
  {
    id: '2',
    fullName: 'Ananya Patel',
    phone: '+919876543211',
    dateOfBirth: '1999-08-22',
    gender: 'female',
    city: 'Hyderabad, TS',
    country: 'India',
    role: 'host',
    rating: 4.9,
    pricePerMinute: 7,
    status: 'busy',
    totalCalls: 456,
    totalMinutes: 2340,
    verificationStatus: 'approved',
    earnings: 46800,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    languages: ['Telugu'],
    category: 'Relationship',
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
    pricePerMinute: 5,
    status: 'available',
    totalCalls: 123,
    totalMinutes: 678,
    verificationStatus: 'approved',
    earnings: 8136,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    languages: ['Telugu', 'Odia'],
    category: 'Confidence',
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
    pricePerMinute: 7,
    status: 'offline',
    totalCalls: 345,
    totalMinutes: 1890,
    verificationStatus: 'approved',
    earnings: 34020,
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150',
    languages: ['Hindi'],
    category: 'Marriage',
  },
];

const categories = ['All', 'Star', 'Relationship', 'Marriage', 'Confidence'];

const CallerHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<HostStatus | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  // Only show verified hosts
  const verifiedHosts = mockHosts.filter(host => host.verificationStatus === 'approved');
  
  const filteredHosts = verifiedHosts.filter((host) => {
    const matchesSearch = host.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || host.status === filterStatus;
    const matchesCategory = selectedCategory === 'All' || host.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const availableHosts = verifiedHosts.filter(h => h.status === 'available');
  const hasAvailableHosts = availableHosts.length > 0;

  const handleHostClick = (host: Host) => {
    navigate(`/caller/host/${host.id}`);
  };

  const handleRandomCall = () => {
    if (hasAvailableHosts) {
      const randomHost = availableHosts[Math.floor(Math.random() * availableHosts.length)];
      navigate(`/caller/call/${randomHost.id}?type=audio`);
    }
  };

  const getAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground italic">Love Birds</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-primary text-primary text-sm font-medium">
            ₹0.00
            <span className="text-lg">+</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
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
        {filteredHosts.map((host, index) => (
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
                  src={host.avatar}
                  alt={host.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-accent/30"
                />
                <div className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                  host.status === 'available' ? 'bg-success' :
                  host.status === 'busy' ? 'bg-accent' : 'bg-muted-foreground'
                }`} />
                <StatusBadge status={host.status} size="sm" className="absolute -bottom-1 left-1/2 -translate-x-1/2" />
                <div className="flex items-center gap-0.5 mt-1 justify-center">
                  <Star size={12} className="fill-accent text-accent" />
                  <span className="text-xs font-medium text-foreground">{host.rating}</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{host.fullName.split(' ')[0]}</h3>
                    <span className="text-muted-foreground text-sm">• {getAge(host.dateOfBirth)} Y</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{host.languages?.join(' • ')}</span>
                </div>
                <p className="text-sm text-muted-foreground">{host.city}</p>
                <p className="text-sm text-primary">{host.category}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-semibold text-foreground">₹{host.pricePerMinute}/min</span>
                  
                  {/* Call Button - Only show for available hosts */}
                  {host.status === 'available' ? (
                    <Button
                      variant="gradient"
                      size="sm"
                      className="px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/caller/call/${host.id}?type=audio`);
                      }}
                    >
                      <Phone size={14} />
                      Call Now
                    </Button>
                  ) : host.status === 'busy' ? (
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
        ))}

        {/* No Available Hosts Message */}
        {filteredHosts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No hosts available right now</p>
            <Button variant="gradient" onClick={handleRandomCall} disabled={!hasAvailableHosts}>
              <Shuffle size={16} />
              Try Random Call
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallerHome;
