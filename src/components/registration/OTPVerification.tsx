import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/common/Logo';
import { ArrowLeft, Shield } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OTPVerificationProps {
  phone: string;
  onVerify: (otp: string) => void;
  onBack: () => void;
}

const OTPVerification = ({ phone, onVerify, onBack }: OTPVerificationProps) => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleResend = () => {
    setTimer(30);
    setCanResend(false);
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  return (
    <div className="flex flex-col min-h-full p-6 animate-fade-in">
      <Button variant="ghost" size="icon" onClick={onBack} className="self-start mb-4">
        <ArrowLeft size={24} />
      </Button>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 gradient-primary rounded-full blur-xl opacity-30 animate-pulse-slow" />
          <div className="relative bg-secondary p-4 rounded-full">
            <Shield className="text-primary" size={40} />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Verify OTP</h1>
          <p className="text-muted-foreground">
            Enter the 6-digit code sent to
            <br />
            <span className="text-foreground font-medium">{phone}</span>
          </p>
        </div>

        <div className="w-full max-w-sm space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
            >
              <InputOTPGroup className="gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-12 h-14 text-xl font-bold bg-secondary border-border rounded-xl"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button 
            variant="gradient" 
            size="lg" 
            className="w-full"
            onClick={handleVerify}
            disabled={otp.length !== 6}
          >
            Verify & Continue
          </Button>

          <div className="text-center">
            {canResend ? (
              <Button variant="link" onClick={handleResend} className="text-primary">
                Resend OTP
              </Button>
            ) : (
              <p className="text-muted-foreground text-sm">
                Resend code in <span className="text-primary font-medium">{timer}s</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
