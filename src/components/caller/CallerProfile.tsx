import { Settings, ChevronRight, Heart, Clock, HelpCircle, LogOut, Shield, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CallerProfile = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Heart, label: 'Favorites', count: 12 },
    { icon: Clock, label: 'Call History', count: 45 },
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
          <div className="w-24 h-24 mx-auto rounded-full bg-secondary flex items-center justify-center text-4xl mb-4">
            👤
          </div>
          <h2 className="text-xl font-bold text-foreground">Rahul Kumar</h2>
          <p className="text-muted-foreground text-sm">+91 98765 43210</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gradient">45</p>
              <p className="text-xs text-muted-foreground">Total Calls</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gradient">12h 30m</p>
              <p className="text-xs text-muted-foreground">Talk Time</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-bold text-gradient">₹2,450</p>
              <p className="text-xs text-muted-foreground">Spent</p>
            </div>
          </div>
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

export default CallerProfile;
