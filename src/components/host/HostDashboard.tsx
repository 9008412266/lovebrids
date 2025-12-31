import { useState } from 'react';
import { Home, Wallet, History, Settings } from 'lucide-react';
import HostHome from './HostHome';
import HostEarnings from './HostEarnings';
import HostHistory from './HostHistory';
import SettingsTab from '@/components/common/SettingsTab';

type HostTab = 'home' | 'earnings' | 'history' | 'settings';

const HostDashboard = () => {
  const [activeTab, setActiveTab] = useState<HostTab>('home');

  const tabs = [
    { id: 'home' as HostTab, icon: Home, label: 'Home' },
    { id: 'earnings' as HostTab, icon: Wallet, label: 'Earnings' },
    { id: 'history' as HostTab, icon: History, label: 'History' },
    { id: 'settings' as HostTab, icon: Settings, label: 'Settings' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HostHome />;
      case 'earnings':
        return <HostEarnings />;
      case 'history':
        return <HostHistory />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <HostHome />;
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[800px]">
      <div className="flex-1 overflow-y-auto pb-20">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-border">
        <div className="flex justify-around items-center py-3 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                activeTab === tab.id ? 'bg-primary/10' : ''
              }`}>
                <tab.icon size={22} />
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;
