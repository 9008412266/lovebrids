import { useState } from 'react';
import { Upload, Camera, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

type VerificationStep = 'upload' | 'pending' | 'approved';

const HostVerification = () => {
  const [step, setStep] = useState<VerificationStep>('upload');
  const [idUploaded, setIdUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (idUploaded && selfieUploaded) {
      setStep('pending');
      // Simulate verification approval
      setTimeout(() => setStep('approved'), 3000);
    }
  };

  if (step === 'approved') {
    return (
      <div className="flex flex-col min-h-full p-6 items-center justify-center animate-fade-in">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-success rounded-full blur-xl opacity-30 animate-pulse" />
          <div className="relative bg-success/20 p-8 rounded-full">
            <CheckCircle className="text-success" size={64} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground text-center mb-2">
          Verification Approved! 🎉
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          You're now a verified host. Start accepting calls and earning!
        </p>

        <Button 
          variant="gradient" 
          size="lg" 
          className="w-full"
          onClick={() => navigate('/host')}
        >
          Start Earning
          <ArrowRight size={20} />
        </Button>
      </div>
    );
  }

  if (step === 'pending') {
    return (
      <div className="flex flex-col min-h-full p-6 items-center justify-center animate-fade-in">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-accent rounded-full blur-xl opacity-30 animate-pulse" />
          <div className="relative bg-accent/20 p-8 rounded-full">
            <Shield className="text-accent animate-pulse" size={64} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground text-center mb-2">
          Verification Pending
        </h1>
        <p className="text-muted-foreground text-center mb-4">
          We're reviewing your documents. This usually takes a few minutes.
        </p>

        <div className="glass-card p-4 w-full">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
            <span className="text-foreground">Under Review...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full p-6 animate-fade-in">
      <div className="space-y-2 mb-8">
        <h1 className="text-2xl font-bold text-foreground">Verify Your Identity</h1>
        <p className="text-muted-foreground">
          Complete verification to start earning as a host
        </p>
      </div>

      <div className="flex-1 space-y-6">
        {/* ID Upload */}
        <div 
          className={`glass-card p-6 border-2 border-dashed transition-all duration-300 cursor-pointer ${
            idUploaded ? 'border-success bg-success/10' : 'border-border hover:border-primary'
          }`}
          onClick={() => setIdUploaded(true)}
        >
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              idUploaded ? 'bg-success/20' : 'bg-secondary'
            }`}>
              {idUploaded ? (
                <CheckCircle className="text-success" size={28} />
              ) : (
                <Upload className="text-primary" size={28} />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {idUploaded ? 'ID Uploaded' : 'Upload Government ID'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Aadhaar, PAN, Passport, or Driving License
              </p>
            </div>
          </div>
        </div>

        {/* Selfie Upload */}
        <div 
          className={`glass-card p-6 border-2 border-dashed transition-all duration-300 cursor-pointer ${
            selfieUploaded ? 'border-success bg-success/10' : 'border-border hover:border-primary'
          }`}
          onClick={() => setSelfieUploaded(true)}
        >
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              selfieUploaded ? 'bg-success/20' : 'bg-secondary'
            }`}>
              {selfieUploaded ? (
                <CheckCircle className="text-success" size={28} />
              ) : (
                <Camera className="text-primary" size={28} />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {selfieUploaded ? 'Selfie Captured' : 'Take a Selfie'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Clear photo matching your ID
              </p>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="glass-card p-4 space-y-3">
          <h4 className="font-medium text-foreground text-sm">Verification Guidelines:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <span>Documents must be clear and readable</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <span>Selfie should match your ID photo</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <span>You must be 18+ years old</span>
            </li>
          </ul>
        </div>
      </div>

      <Button 
        variant="gradient" 
        size="lg" 
        className="w-full mt-6"
        onClick={handleSubmit}
        disabled={!idUploaded || !selfieUploaded}
      >
        Submit for Verification
        <ArrowRight size={20} />
      </Button>
    </div>
  );
};

export default HostVerification;
