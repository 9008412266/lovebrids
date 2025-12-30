import { useState } from 'react';
import { Plus, CreditCard, History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types';

const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: 'caller1',
    type: 'credit',
    amount: 500,
    description: 'Wallet Top-up',
    timestamp: new Date('2024-01-15T10:30:00'),
    status: 'completed',
  },
  {
    id: '2',
    userId: 'caller1',
    type: 'debit',
    amount: 150,
    description: 'Video call with Priya',
    timestamp: new Date('2024-01-15T11:45:00'),
    status: 'completed',
  },
  {
    id: '3',
    userId: 'caller1',
    type: 'debit',
    amount: 75,
    description: 'Voice call with Ananya',
    timestamp: new Date('2024-01-14T16:20:00'),
    status: 'completed',
  },
  {
    id: '4',
    userId: 'caller1',
    type: 'credit',
    amount: 1000,
    description: 'Wallet Top-up',
    timestamp: new Date('2024-01-13T09:00:00'),
    status: 'completed',
  },
];

const CallerWallet = () => {
  const [balance] = useState(1275);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const quickAmounts = [100, 200, 500, 1000, 2000];

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Wallet</h1>
        <Button variant="ghost" size="icon">
          <History size={20} />
        </Button>
      </div>

      {/* Balance Card */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 gradient-primary opacity-20 blur-3xl rounded-full" />
        <div className="relative">
          <p className="text-muted-foreground text-sm mb-1">Available Balance</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-gradient">₹{balance.toLocaleString()}</span>
          </div>
          <Button 
            variant="gradient" 
            className="mt-4 w-full"
            onClick={() => setShowAddMoney(true)}
          >
            <Plus size={20} />
            Add Money
          </Button>
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="glass-card p-6 space-y-4 animate-scale-in">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Add Money</h2>
            <button 
              onClick={() => setShowAddMoney(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedAmount === amount
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-secondary text-foreground hover:border-primary/50'
                }`}
              >
                <span className="font-semibold">₹{amount}</span>
              </button>
            ))}
          </div>

          <Button 
            variant="gold" 
            size="lg" 
            className="w-full"
            disabled={!selectedAmount}
          >
            <CreditCard size={20} />
            Pay ₹{selectedAmount || 0}
          </Button>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="space-y-4">
        <h2 className="font-semibold text-foreground">Recent Transactions</h2>
        <div className="space-y-3">
          {mockTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className="glass-card p-4 flex items-center gap-4 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.type === 'credit' 
                  ? 'bg-success/20 text-success' 
                  : 'bg-destructive/20 text-destructive'
              }`}>
                {transaction.type === 'credit' ? (
                  <ArrowDownLeft size={20} />
                ) : (
                  <ArrowUpRight size={20} />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">
                  {transaction.timestamp.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <span className={`font-semibold ${
                transaction.type === 'credit' ? 'text-success' : 'text-destructive'
              }`}>
                {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CallerWallet;
