import { useState } from 'react';
import { Users, DollarSign, Phone, ShieldCheck, TrendingUp, FileCheck, LogOut, ArrowUpRight, Building2, History, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AdminTransactions from './AdminTransactions';
import AdminUsers from './AdminUsers';
import AdminWithdrawals from './AdminWithdrawals';
import AdminLeaderboard from './AdminLeaderboard';

type AdminTab = 'dashboard' | 'transactions' | 'users' | 'withdrawals' | 'leaderboard';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const stats = [
    { icon: Users, label: 'Total Users', value: '12,456', trend: '+12%' },
    { icon: DollarSign, label: 'Total Revenue', value: '₹4.2L', trend: '+8%' },
    { icon: Phone, label: 'Calls Today', value: '1,234', trend: '+15%' },
    { icon: ShieldCheck, label: 'Verified Hosts', value: '892', trend: '+5%' },
  ];

  const pendingVerifications = [
    { name: 'Sneha Gupta', city: 'Delhi', time: '2h ago' },
    { name: 'Kavya Reddy', city: 'Hyderabad', time: '4h ago' },
    { name: 'Pooja Nair', city: 'Chennai', time: '5h ago' },
  ];

  const tabs = [
    { id: 'dashboard' as AdminTab, label: 'Overview' },
    { id: 'users' as AdminTab, label: 'Users' },
    { id: 'transactions' as AdminTab, label: 'Transactions' },
    { id: 'withdrawals' as AdminTab, label: 'Withdrawals' },
    { id: 'leaderboard' as AdminTab, label: 'Leaderboard' },
  ];

  if (activeTab === 'transactions') {
    return <AdminTransactions onBack={() => setActiveTab('dashboard')} />;
  }

  if (activeTab === 'users') {
    return <AdminUsers onBack={() => setActiveTab('dashboard')} />;
  }

  if (activeTab === 'withdrawals') {
    return <AdminWithdrawals onBack={() => setActiveTab('dashboard')} />;
  }

  if (activeTab === 'leaderboard') {
    return <AdminLeaderboard onBack={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <LogOut size={18} />
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-4 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <stat.icon size={16} />
              <span className="text-xs">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <span className="text-xs text-success">{stat.trend}</span>
          </div>
        ))}
      </div>

      {/* Revenue vs Commission */}
      <div className="glass-card p-4 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <TrendingUp size={18} /> Revenue Breakdown
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary p-4 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Host Earnings</p>
            <p className="text-xl font-bold text-gradient-gold">₹2.94L</p>
            <p className="text-xs text-muted-foreground">70% of revenue</p>
          </div>
          <div className="bg-secondary p-4 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Platform Commission</p>
            <p className="text-xl font-bold text-gradient">₹1.26L</p>
            <p className="text-xs text-muted-foreground">30% of revenue</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setActiveTab('withdrawals')}
          className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-white/5 transition-all"
        >
          <Building2 className="text-accent" size={24} />
          <span className="font-medium text-foreground text-sm">Withdrawals</span>
          <span className="text-xs text-destructive">5 Pending</span>
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-white/5 transition-all"
        >
          <History className="text-primary" size={24} />
          <span className="font-medium text-foreground text-sm">Transactions</span>
          <span className="text-xs text-muted-foreground">View All</span>
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className="glass-card p-4 flex flex-col items-center gap-2 hover:bg-white/5 transition-all"
        >
          <Trophy className="text-yellow-500" size={24} />
          <span className="font-medium text-foreground text-sm">Leaderboard</span>
          <span className="text-xs text-muted-foreground">Top Hosts</span>
        </button>
      </div>

      {/* Pending Verifications */}
      <div className="glass-card p-4 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <FileCheck size={18} /> Pending Verifications
        </h3>
        {pendingVerifications.map((v, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
            <div>
              <p className="font-medium text-foreground">{v.name}</p>
              <p className="text-xs text-muted-foreground">{v.city} • {v.time}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="success" size="sm">Approve</Button>
              <Button variant="outline" size="sm">Reject</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
