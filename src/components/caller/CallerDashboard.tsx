import { useState } from 'react';
import { Home, MessageCircle, Wallet, Settings } from 'lucide-react';
import CallerHome from './CallerHome';
import CallerWallet from './CallerWallet';
import CallerChat from './CallerChat';
import SettingsTab from '@/components/common/SettingsTab';

type CallerTab = 'home' | 'chat' | 'wallet' | 'settings';

const CallerDashboard = () => {
  const [activeTab, setActiveTab] = useState<CallerTab>('home');

  const tabs = [
    { id: 'home' as CallerTab, icon: Home, label: 'Home' },
    { id: 'chat' as CallerTab, icon: MessageCircle, label: 'Chat' },
    { id: 'wallet' as CallerTab, icon: Wallet, label: 'Wallet' },
    { id: 'settings' as CallerTab, icon: Settings, label: 'Settings' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <CallerHome />;
      case 'chat':
        return <CallerChat />;
      case 'wallet':
        return <CallerWallet />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <CallerHome />;
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

export default CallerDashboard;
