import { Settings, ChevronRight, Shield, Bell, HelpCircle, LogOut, Star, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HostProfile = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: FileCheck, label: 'Verification Status', badge: 'Verified' },
    { icon: Star, label: 'My Reviews', count: 156 },
    { icon: Bell, label: 'Notifications', toggle: true },
    { icon: Shield, label: 'Privacy & Security' },
    { icon: HelpCircle, label: 'Help & Support' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="glass-card p-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 gradient-primary opacity-10 blur-3xl rounded-full" />
        <div className="relative">
          <div className="relative inline-block">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
              alt="Profile"
              className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-primary"
            />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-success rounded-full border-2 border-card flex items-center justify-center">
              <Shield size={12} className="text-success-foreground" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground mt-4">Priya Sharma</h2>
          <p className="text-muted-foreground text-sm">Mumbai, India</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <Star size={16} className="text-accent fill-current" />
            <span className="font-semibold text-foreground">4.8</span>
            <span className="text-muted-foreground">(156 reviews)</span>
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gradient">234</p>
              <p className="text-xs text-muted-foreground">Total Calls</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gradient">40h</p>
              <p className="text-xs text-muted-foreground">Talk Time</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gradient-gold">₹18K</p>
              <p className="text-xs text-muted-foreground">Earned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Your Rate</p>
            <p className="text-xl font-bold text-gradient">₹15/min</p>
          </div>
          <Button variant="outline" size="sm">Edit</Button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <div
            key={item.label}
            className="glass-card p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-all duration-300 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <item.icon size={20} className="text-primary" />
            </div>
            <span className="flex-1 font-medium text-foreground">{item.label}</span>
            {item.badge && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-success/20 text-success">
                {item.badge}
              </span>
            )}
            {item.count !== undefined && (
              <span className="text-sm text-muted-foreground">{item.count}</span>
            )}
            {item.toggle !== undefined ? (
              <div className="w-12 h-6 bg-primary rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-primary-foreground rounded-full" />
              </div>
            ) : (
              <ChevronRight size={20} className="text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      {/* Logout */}
      <Button 
        variant="outline" 
        className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        onClick={() => navigate('/')}
      >
        <LogOut size={20} />
        Logout
      </Button>
    </div>
  );
};

export default HostProfile;
