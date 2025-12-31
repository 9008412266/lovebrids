import { useState, useEffect } from 'react';
import { Plus, CreditCard, History, ArrowUpRight, ArrowDownLeft, Gift, Percent, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  description: string | null;
  created_at: string;
  balance_after: number | null;
}

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
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<RechargeOffer | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Fetch wallet
      const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (walletError) throw walletError;
      if (wallet) {
        setBalance(Number(wallet.balance) || 0);
      }

      // Fetch transactions
      const { data: txData, error: txError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (txError) throw txError;
      setTransactions(txData || []);
    } catch (error: any) {
      console.error('Error fetching wallet:', error);
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async () => {
    if (!selectedOffer) return;

    setProcessing(true);
    try {
      const response = await supabase.functions.invoke('process-recharge', {
        body: {
          baseAmount: selectedOffer.amount,
          bonusPercent: selectedOffer.bonus,
          offerTag: selectedOffer.tag,
        },
      });

      if (response.error) throw response.error;

      const { newBalance, creditsReceived } = response.data;
      setBalance(newBalance);
      toast.success(`₹${creditsReceived} credits added to your wallet!`);
      
      setShowAddMoney(false);
      setSelectedOffer(null);
      fetchWalletData(); // Refresh transactions
    } catch (error: any) {
      console.error('Recharge error:', error);
      toast.error(error.message || 'Recharge failed');
    } finally {
      setProcessing(false);
    }
  };

  const selectedPayment = selectedOffer ? calculatePayment(selectedOffer.amount, selectedOffer.bonus) : null;

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/caller')}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Wallet</h1>
        </div>
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
            <span className="text-4xl font-bold text-gradient">₹{balance.toFixed(2)}</span>
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
            disabled={!selectedOffer || processing}
            onClick={handleRecharge}
          >
            {processing ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <CreditCard size={20} />
                Pay ₹{selectedPayment?.totalPayable || 0}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="space-y-4">
        <h2 className="font-semibold text-foreground">Recent Transactions</h2>
        <div className="space-y-3">
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="glass-card p-4 flex items-center gap-4 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.amount > 0 
                    ? 'bg-success/20 text-success' 
                    : 'bg-destructive/20 text-destructive'
                }`}>
                  {transaction.amount > 0 ? (
                    <ArrowDownLeft size={20} />
                  ) : (
                    <ArrowUpRight size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{transaction.description || transaction.transaction_type}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span className={`font-semibold ${
                  transaction.amount > 0 ? 'text-success' : 'text-destructive'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions yet</p>
              <p className="text-sm mt-1">Add money to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallerWallet;