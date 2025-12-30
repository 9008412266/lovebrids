import { ArrowLeft, Building2, CheckCircle, XCircle, Clock, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface AdminWithdrawalsProps {
  onBack: () => void;
}

interface WithdrawalRequest {
  id: string;
  hostName: string;
  hostAvatar: string;
  amount: number;
  method: 'upi' | 'bank';
  accountDetails: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  availableBalance: number;
}

const mockWithdrawals: WithdrawalRequest[] = [
  { id: '1', hostName: 'Priya Sharma', hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', amount: 3000, method: 'upi', accountDetails: 'priya@upi', requestedAt: new Date('2024-01-15T14:30:00'), status: 'pending', availableBalance: 4250 },
  { id: '2', hostName: 'Ananya Patel', hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', amount: 5000, method: 'bank', accountDetails: 'HDFC - ****1234', requestedAt: new Date('2024-01-15T12:00:00'), status: 'pending', availableBalance: 8500 },
  { id: '3', hostName: 'Riya Singh', hostAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100', amount: 1500, method: 'upi', accountDetails: 'riya.singh@paytm', requestedAt: new Date('2024-01-15T10:00:00'), status: 'pending', availableBalance: 2100 },
  { id: '4', hostName: 'Meera Joshi', hostAvatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100', amount: 2000, method: 'bank', accountDetails: 'SBI - ****5678', requestedAt: new Date('2024-01-14T16:00:00'), status: 'completed', availableBalance: 3400 },
  { id: '5', hostName: 'Kavya Reddy', hostAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100', amount: 800, method: 'upi', accountDetails: 'kavya@gpay', requestedAt: new Date('2024-01-14T14:00:00'), status: 'completed', availableBalance: 1200 },
];

const AdminWithdrawals = ({ onBack }: AdminWithdrawalsProps) => {
  const [withdrawals, setWithdrawals] = useState(mockWithdrawals);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');

  const handleApprove = (id: string) => {
    setWithdrawals(prev => prev.map(w => 
      w.id === id ? { ...w, status: 'completed' as const } : w
    ));
  };

  const handleReject = (id: string) => {
    setWithdrawals(prev => prev.map(w => 
      w.id === id ? { ...w, status: 'rejected' as const } : w
    ));
  };

  const filteredWithdrawals = withdrawals.filter(w => 
    filterStatus === 'all' || w.status === filterStatus
  );

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;
  const pendingAmount = withdrawals.filter(w => w.status === 'pending').reduce((acc, w) => acc + w.amount, 0);

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold text-foreground">Bank Withdrawals</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 gradient-gold opacity-20 blur-2xl rounded-full" />
          <div className="relative">
            <p className="text-xs text-muted-foreground mb-1">Pending Requests</p>
            <p className="text-2xl font-bold text-accent">{pendingCount}</p>
          </div>
        </div>
        <div className="glass-card p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 gradient-primary opacity-20 blur-2xl rounded-full" />
          <div className="relative">
            <p className="text-xs text-muted-foreground mb-1">Pending Amount</p>
            <p className="text-2xl font-bold text-gradient">₹{pendingAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'pending', 'completed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filterStatus === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            {status === 'all' ? 'All' : status === 'pending' ? '⏳ Pending' : '✅ Completed'}
          </button>
        ))}
      </div>

      {/* Withdrawal Requests */}
      <div className="space-y-4">
        {filteredWithdrawals.map((withdrawal, index) => (
          <div
            key={withdrawal.id}
            className="glass-card p-4 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              <img
                src={withdrawal.hostAvatar}
                alt={withdrawal.hostName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{withdrawal.hostName}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    withdrawal.status === 'pending' ? 'bg-accent/20 text-accent' :
                    withdrawal.status === 'completed' ? 'bg-success/20 text-success' :
                    'bg-destructive/20 text-destructive'
                  }`}>
                    {withdrawal.status}
                  </span>
                </div>
                
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-bold text-gradient-gold">₹{withdrawal.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Method</span>
                    <span className="flex items-center gap-1 text-foreground">
                      {withdrawal.method === 'upi' ? <Wallet size={14} /> : <Building2 size={14} />}
                      {withdrawal.method.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Account</span>
                    <span className="text-foreground">{withdrawal.accountDetails}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Available Balance</span>
                    <span className="text-success">₹{withdrawal.availableBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Requested</span>
                    <span className="text-foreground text-xs">
                      {withdrawal.requestedAt.toLocaleString('en-IN', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {withdrawal.status === 'pending' && (
              <div className="flex gap-3 mt-4">
                <Button 
                  variant="success" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleApprove(withdrawal.id)}
                >
                  <CheckCircle size={16} />
                  Approve & Transfer
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleReject(withdrawal.id)}
                >
                  <XCircle size={16} />
                  Reject
                </Button>
              </div>
            )}

            {withdrawal.status === 'completed' && (
              <div className="flex items-center gap-2 mt-4 p-2 bg-success/10 rounded-lg">
                <CheckCircle size={16} className="text-success" />
                <span className="text-sm text-success">Transfer completed successfully</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminWithdrawals;
