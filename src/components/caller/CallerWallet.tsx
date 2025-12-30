import { useState } from 'react';
import { Plus, CreditCard, History, ArrowUpRight, ArrowDownLeft, Gift, Percent, X } from 'lucide-react';
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

interface RechargeOffer {
  amount: number;
  bonus: number;
  tag?: string;
  tagColor?: string;
}

const rechargeOffers: RechargeOffer[] = [
  { amount: 80, bonus: 0 },
  { amount: 150, bonus: 2, tag: 'Basic' },
  { amount: 250, bonus: 5, tag: 'Popular', tagColor: 'bg-primary' },
  { amount: 350, bonus: 10, tag: 'Best Value', tagColor: 'bg-accent' },
  { amount: 500, bonus: 15 },
  { amount: 1000, bonus: 20 },
];

const PLATFORM_FEE_PERCENT = 3;
const GST_PERCENT = 10;

const calculatePayment = (baseAmount: number, bonusPercent: number) => {
  const platformFee = (baseAmount * PLATFORM_FEE_PERCENT) / 100;
  const subtotal = baseAmount + platformFee;
  const gst = (subtotal * GST_PERCENT) / 100;
  const totalPayable = subtotal + gst;
  const bonusAmount = (baseAmount * bonusPercent) / 100;
  const creditsReceived = baseAmount + bonusAmount;
  
  return {
    baseAmount,
    platformFee: Math.round(platformFee * 100) / 100,
    gst: Math.round(gst * 100) / 100,
    totalPayable: Math.round(totalPayable * 100) / 100,
    bonusAmount: Math.round(bonusAmount * 100) / 100,
    creditsReceived: Math.round(creditsReceived * 100) / 100,
  };
};

const CallerWallet = () => {
  const [balance] = useState(1275);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<RechargeOffer | null>(null);

  const selectedPayment = selectedOffer ? calculatePayment(selectedOffer.amount, selectedOffer.bonus) : null;

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
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Gift size={20} className="text-primary" />
              Choose Recharge Pack
            </h2>
            <button 
              onClick={() => {
                setShowAddMoney(false);
                setSelectedOffer(null);
              }}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Recharge Offers Grid */}
          <div className="grid grid-cols-2 gap-3">
            {rechargeOffers.map((offer) => (
              <button
                key={offer.amount}
                onClick={() => setSelectedOffer(offer)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  selectedOffer?.amount === offer.amount
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-secondary hover:border-primary/50'
                }`}
              >
                {/* Tag Badge */}
                {offer.tag && (
                  <span className={`absolute -top-2 -right-2 px-2 py-0.5 text-xs font-bold rounded-full text-white ${offer.tagColor || 'bg-success'}`}>
                    {offer.tag}
                  </span>
                )}
                
                <div className="space-y-1">
                  <span className="text-xl font-bold text-primary">₹{offer.amount}</span>
                  {offer.bonus > 0 ? (
                    <p className="text-sm text-success font-medium">+{offer.bonus}% Extra</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Basic Pack</p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Payment Breakdown */}
          {selectedPayment && (
            <div className="bg-secondary/50 rounded-xl p-4 space-y-3 border border-border">
              <h3 className="font-medium text-foreground flex items-center gap-2">
                <Percent size={16} className="text-muted-foreground" />
                Payment Details
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Amount</span>
                  <span className="text-foreground">₹{selectedPayment.baseAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee (3%)</span>
                  <span className="text-foreground">₹{selectedPayment.platformFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (10%)</span>
                  <span className="text-foreground">₹{selectedPayment.gst}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold">
                  <span className="text-foreground">Total Payable</span>
                  <span className="text-primary">₹{selectedPayment.totalPayable}</span>
                </div>
                {selectedPayment.bonusAmount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Bonus Credits</span>
                    <span>+₹{selectedPayment.bonusAmount}</span>
                  </div>
                )}
                <div className="bg-success/10 rounded-lg p-2 flex justify-between items-center">
                  <span className="text-success font-medium">Credits You'll Get</span>
                  <span className="text-success font-bold text-lg">₹{selectedPayment.creditsReceived}</span>
                </div>
              </div>
            </div>
          )}

          <Button 
            variant="gold" 
            size="lg" 
            className="w-full"
            disabled={!selectedOffer}
          >
            <CreditCard size={20} />
            Pay ₹{selectedPayment?.totalPayable || 0}
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
