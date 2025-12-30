import { Users, DollarSign, Phone, ShieldCheck, TrendingUp, FileCheck, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

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

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <LogOut size={18} />
        </Button>
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

      {/* Revenue Chart Placeholder */}
      <div className="glass-card p-4">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp size={18} /> Revenue Analytics
        </h3>
        <div className="h-32 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground">
          Chart Visualization
        </div>
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
