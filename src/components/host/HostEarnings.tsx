import { useState } from 'react';
import { TrendingUp, ArrowUpRight, Wallet, Building2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HostEarnings = () => {
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'upi' | 'bank'>('upi');
  const [showSuccess, setShowSuccess] = useState(false);

  const earnings = {
    available: 4250,
    pending: 450,
    thisWeek: 2100,
    thisMonth: 8500,
  };

  const handleWithdraw = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowWithdraw(false);
      setWithdrawAmount('');
    }, 3000);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col min-h-full p-6 items-center justify-center animate-fade-in">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-success rounded-full blur-xl opacity-30 animate-pulse" />
          <div className="relative bg-success/20 p-8 rounded-full">
            <CheckCircle className="text-success" size={64} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground text-center mb-2">
          Withdrawal Successful!
        </h1>
        <p className="text-muted-foreground text-center">
          ₹{withdrawAmount} will be credited within 24-48 hours
        </p>
      </div>
    );
  }

  if (showWithdraw) {
    return (
      <div className="p-4 space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowWithdraw(false)} className="text-muted-foreground">
            ←
          </button>
          <h1 className="text-xl font-bold text-foreground">Withdraw Earnings</h1>
        </div>

        {/* Available Balance */}
        <div className="glass-card p-6 text-center">
          <p className="text-muted-foreground text-sm">Available Balance</p>
          <p className="text-3xl font-bold text-gradient-gold">₹{earnings.available}</p>
        </div>

        {/* Amount Input */}
        <div className="glass-card p-4 space-y-4">
          <label className="text-sm text-muted-foreground">Amount to Withdraw</label>
          <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
            <span className="text-xl font-bold text-foreground">₹</span>
            <Input
              type="number"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-xl font-medium"
            />
          </div>
          <div className="flex gap-2">
            {[500, 1000, 2000].map((amount) => (
              <button
                key={amount}
                onClick={() => setWithdrawAmount(amount.toString())}
                className="flex-1 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>

        {/* Withdraw Method */}
        <div className="glass-card p-4 space-y-4">
          <label className="text-sm text-muted-foreground">Withdraw To</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setWithdrawMethod('upi')}
              className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                withdrawMethod === 'upi'
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-secondary'
              }`}
            >
              <Wallet size={24} className={withdrawMethod === 'upi' ? 'text-primary' : 'text-muted-foreground'} />
              <span className="font-medium">UPI</span>
            </button>
            <button
              onClick={() => setWithdrawMethod('bank')}
              className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                withdrawMethod === 'bank'
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-secondary'
              }`}
            >
              <Building2 size={24} className={withdrawMethod === 'bank' ? 'text-primary' : 'text-muted-foreground'} />
              <span className="font-medium">Bank</span>
            </button>
          </div>
        </div>

        {/* UPI/Bank Details */}
        <div className="glass-card p-4 space-y-3">
          {withdrawMethod === 'upi' ? (
            <>
              <label className="text-sm text-muted-foreground">UPI ID</label>
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                <Input
                  placeholder="yourname@upi"
                  className="flex-1 bg-transparent border-0 focus-visible:ring-0"
                />
              </div>
            </>
          ) : (
            <>
              <label className="text-sm text-muted-foreground">Account Number</label>
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                <Input
                  placeholder="Account Number"
                  className="flex-1 bg-transparent border-0 focus-visible:ring-0"
                />
              </div>
              <label className="text-sm text-muted-foreground">IFSC Code</label>
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                <Input
                  placeholder="IFSC Code"
                  className="flex-1 bg-transparent border-0 focus-visible:ring-0"
                />
              </div>
            </>
          )}
        </div>

        <Button 
          variant="gold" 
          size="lg" 
          className="w-full"
          onClick={handleWithdraw}
          disabled={!withdrawAmount || parseInt(withdrawAmount) <= 0}
        >
          Withdraw ₹{withdrawAmount || 0}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Earnings</h1>
      </div>

      {/* Main Balance Card */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 gradient-gold opacity-20 blur-3xl rounded-full" />
        <div className="relative">
          <p className="text-muted-foreground text-sm mb-1">Available Balance</p>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-4xl font-bold text-gradient-gold">₹{earnings.available.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span>₹{earnings.pending} pending clearance</span>
          </div>
          <Button 
            variant="gold" 
            className="w-full"
            onClick={() => setShowWithdraw(true)}
          >
            <ArrowUpRight size={20} />
            Withdraw
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp size={16} />
            <span className="text-xs">This Week</span>
          </div>
          <p className="text-2xl font-bold text-foreground">₹{earnings.thisWeek.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp size={16} />
            <span className="text-xs">This Month</span>
          </div>
          <p className="text-2xl font-bold text-foreground">₹{earnings.thisMonth.toLocaleString()}</p>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className="glass-card p-4 space-y-4">
        <h3 className="font-semibold text-foreground">Earnings Breakdown</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Video Calls</span>
            <span className="font-medium text-foreground">₹5,200</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Voice Calls</span>
            <span className="font-medium text-foreground">₹2,800</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tips Received</span>
            <span className="font-medium text-foreground">₹500</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostEarnings;
