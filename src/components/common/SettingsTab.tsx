import { LogOut, ChevronRight, Bell, Shield, HelpCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';

const SettingsTab = () => {
  const { signOut } = useAuth();

  const settingsItems = [
    { icon: Bell, label: 'Notifications', hasToggle: true },
    { icon: Shield, label: 'Privacy & Security', hasArrow: true },
    { icon: HelpCircle, label: 'Help & Support', hasArrow: true },
    { icon: FileText, label: 'Terms & Conditions', hasArrow: true },
  ];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      <div className="glass-card divide-y divide-border">
        {settingsItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className="text-muted-foreground" />
              <span className="text-foreground">{item.label}</span>
            </div>
            {item.hasToggle && <Switch />}
            {item.hasArrow && <ChevronRight size={20} className="text-muted-foreground" />}
          </div>
        ))}
      </div>

      <Button
        variant="destructive"
        className="w-full"
        onClick={signOut}
      >
        <LogOut size={20} />
        Logout
      </Button>
    </div>
  );
};

export default SettingsTab;
