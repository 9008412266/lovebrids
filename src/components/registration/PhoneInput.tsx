import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/common/Logo';
import { ArrowRight, Smartphone } from 'lucide-react';

interface PhoneInputProps {
  onSubmit: (phone: string) => void;
}

const PhoneInput = ({ onSubmit }: PhoneInputProps) => {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  const handleSubmit = () => {
    if (phone.length >= 10) {
      onSubmit(`${countryCode}${phone}`);
    }
  };

  return (
    <div className="flex flex-col min-h-full p-6 animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <Logo size="lg" />
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Welcome</h1>
          <p className="text-muted-foreground">Enter your phone number to get started</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <div className="glass-card p-4 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <Smartphone className="text-muted-foreground" size={20} />
              <select 
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-transparent text-foreground font-medium outline-none"
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+971">🇦🇪 +971</option>
              </select>
              <Input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="flex-1 bg-transparent border-0 text-lg font-medium focus-visible:ring-0"
              />
            </div>
          </div>

          <Button 
            variant="gradient" 
            size="lg" 
            className="w-full"
            onClick={handleSubmit}
            disabled={phone.length < 10}
          >
            Continue
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
};

export default PhoneInput;
