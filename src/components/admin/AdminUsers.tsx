import { ArrowLeft, Search, Phone, Star, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface AdminUsersProps {
  onBack: () => void;
}

interface UserData {
  id: string;
  name: string;
  phone: string;
  type: 'caller' | 'host';
  avatar: string;
  totalSpent?: number;
  totalEarnings?: number;
  walletBalance: number;
  totalCalls: number;
  rating?: number;
  status: 'active' | 'suspended' | 'pending';
}

const mockUsers: UserData[] = [
  { id: '1', name: 'Rahul Kumar', phone: '+91 98765 43210', type: 'caller', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', totalSpent: 4500, walletBalance: 1275, totalCalls: 45, status: 'active' },
  { id: '2', name: 'Priya Sharma', phone: '+91 98765 43211', type: 'host', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', totalEarnings: 18500, walletBalance: 4250, totalCalls: 234, rating: 4.8, status: 'active' },
  { id: '3', name: 'Amit Sharma', phone: '+91 98765 43212', type: 'caller', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100', totalSpent: 2300, walletBalance: 500, totalCalls: 23, status: 'active' },
  { id: '4', name: 'Ananya Patel', phone: '+91 98765 43213', type: 'host', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', totalEarnings: 46800, walletBalance: 8500, totalCalls: 456, rating: 4.9, status: 'active' },
  { id: '5', name: 'Vikram Singh', phone: '+91 98765 43214', type: 'caller', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', totalSpent: 890, walletBalance: 110, totalCalls: 12, status: 'suspended' },
];

const AdminUsers = ({ onBack }: AdminUsersProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'caller' | 'host'>('all');

  const filteredUsers = mockUsers.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.phone.includes(searchQuery);
    const matchesFilter = filterType === 'all' || u.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalCallers = mockUsers.filter(u => u.type === 'caller').length;
  const totalHosts = mockUsers.filter(u => u.type === 'host').length;

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold text-foreground">User Management</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-3 text-center">
          <p className="text-xs text-muted-foreground">Total Callers</p>
          <p className="text-xl font-bold text-accent">{totalCallers}</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-xs text-muted-foreground">Total Hosts</p>
          <p className="text-xl font-bold text-primary">{totalHosts}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="glass-card p-3">
          <div className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-2">
            <Search className="text-muted-foreground" size={20} />
            <Input
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 p-0"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {(['all', 'caller', 'host'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterType === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {type === 'all' ? 'All Users' : type === 'caller' ? '👨 Callers' : '👩 Hosts'}
            </button>
          ))}
        </div>
      </div>

      {/* User List */}
      <div className="space-y-3">
        {filteredUsers.map((user, index) => (
          <div
            key={user.id}
            className="glass-card p-4 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${
                  user.status === 'active' ? 'bg-success' :
                  user.status === 'suspended' ? 'bg-destructive' : 'bg-accent'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground truncate">{user.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    user.type === 'host' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                  }`}>
                    {user.type}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{user.phone}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Phone size={10} /> {user.totalCalls}
                  </span>
                  {user.rating && (
                    <span className="flex items-center gap-1">
                      <Star size={10} className="text-accent fill-current" /> {user.rating}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                {user.type === 'caller' ? (
                  <>
                    <p className="text-xs text-muted-foreground">Spent</p>
                    <p className="font-bold text-foreground">₹{user.totalSpent?.toLocaleString()}</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-muted-foreground">Earned</p>
                    <p className="font-bold text-gradient-gold">₹{user.totalEarnings?.toLocaleString()}</p>
                  </>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Wallet size={10} /> ₹{user.walletBalance}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" className="flex-1">View Details</Button>
              {user.status === 'active' ? (
                <Button variant="destructive" size="sm">Suspend</Button>
              ) : (
                <Button variant="success" size="sm">Activate</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
