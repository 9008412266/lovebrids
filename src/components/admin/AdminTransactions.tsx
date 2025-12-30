import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface AdminTransactionsProps {
  onBack: () => void;
}

interface Transaction {
  id: string;
  type: 'credit' | 'debit' | 'withdrawal' | 'commission';
  userName: string;
  userType: 'caller' | 'host';
  amount: number;
  description: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

const mockTransactions: Transaction[] = [
  { id: '1', type: 'credit', userName: 'Rahul Kumar', userType: 'caller', amount: 1000, description: 'Wallet Top-up', timestamp: new Date('2024-01-15T14:30:00'), status: 'completed' },
  { id: '2', type: 'debit', userName: 'Rahul Kumar', userType: 'caller', amount: 150, description: 'Video call - Priya', timestamp: new Date('2024-01-15T14:45:00'), status: 'completed' },
  { id: '3', type: 'commission', userName: 'Priya Sharma', userType: 'host', amount: 45, description: 'Platform Commission (30%)', timestamp: new Date('2024-01-15T14:45:00'), status: 'completed' },
  { id: '4', type: 'withdrawal', userName: 'Ananya Patel', userType: 'host', amount: 2000, description: 'Bank Transfer - HDFC', timestamp: new Date('2024-01-15T12:00:00'), status: 'completed' },
  { id: '5', type: 'credit', userName: 'Amit Sharma', userType: 'caller', amount: 500, description: 'Wallet Top-up', timestamp: new Date('2024-01-15T11:30:00'), status: 'completed' },
  { id: '6', type: 'withdrawal', userName: 'Riya Singh', userType: 'host', amount: 1500, description: 'UPI Transfer', timestamp: new Date('2024-01-15T10:00:00'), status: 'pending' },
];

const AdminTransactions = ({ onBack }: AdminTransactionsProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTransactions = mockTransactions.filter((t) => {
    const matchesSearch = t.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'credit': return 'text-success bg-success/20';
      case 'debit': return 'text-destructive bg-destructive/20';
      case 'withdrawal': return 'text-accent bg-accent/20';
      case 'commission': return 'text-primary bg-primary/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'credit': return <ArrowDownLeft size={16} />;
      case 'debit': return <ArrowUpRight size={16} />;
      case 'withdrawal': return <ArrowUpRight size={16} />;
      case 'commission': return <ArrowDownLeft size={16} />;
      default: return null;
    }
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold text-foreground">Transaction Logs</h1>
      </div>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="glass-card p-3">
          <div className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-2">
            <Search className="text-muted-foreground" size={20} />
            <Input
              placeholder="Search by user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-0 focus-visible:ring-0 p-0"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'credit', 'debit', 'withdrawal', 'commission'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                filterType === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-3 text-center">
          <p className="text-xs text-muted-foreground">Today's Inflow</p>
          <p className="text-lg font-bold text-success">+₹45,230</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-xs text-muted-foreground">Today's Outflow</p>
          <p className="text-lg font-bold text-destructive">-₹12,450</p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className="glass-card p-4 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(transaction.type)}`}>
                {getTypeIcon(transaction.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground truncate">{transaction.userName}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    transaction.userType === 'host' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                  }`}>
                    {transaction.userType}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">
                  {transaction.timestamp.toLocaleString('en-IN', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  transaction.type === 'credit' || transaction.type === 'commission'
                    ? 'text-success' : 'text-destructive'
                }`}>
                  {transaction.type === 'credit' || transaction.type === 'commission' ? '+' : '-'}₹{transaction.amount}
                </p>
                <span className={`text-xs ${
                  transaction.status === 'completed' ? 'text-success' :
                  transaction.status === 'pending' ? 'text-accent' : 'text-destructive'
                }`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTransactions;
