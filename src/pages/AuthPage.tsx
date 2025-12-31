import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/common/Logo';
import { toast } from 'sonner';
import { Phone, Lock, User, Calendar, MapPin, ArrowRight, Mail } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

type AuthMode = 'login' | 'signup';
type AuthStep = 'phone' | 'otp' | 'details' | 'forgot-password';

const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [step, setStep] = useState<AuthStep>('phone');
  const [loading, setLoading] = useState(false);
  
  // Phone & OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [serverOtp, setServerOtp] = useState(''); // Store OTP from server for verification
  
  // For email fallback
  const [useEmail, setUseEmail] = useState(false); // Default to phone OTP now that Twilio is set up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Profile details
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        redirectBasedOnRole(session.user.id);
      }
    };
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Check if profile exists
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          if (!profile) {
            setStep('details');
          } else {
            redirectBasedOnRole(session.user.id);
          }
        }
      }
    );

    checkSession();
    return () => subscription.unsubscribe();
  }, []);

  const redirectBasedOnRole = async (userId: string) => {
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (roleData?.role === 'host') {
      navigate('/host');
    } else if (roleData?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/caller');
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    // Add +91 if not present
    if (digits.startsWith('91') && digits.length === 12) {
      return '+' + digits;
    }
    if (digits.length === 10) {
      return '+91' + digits;
    }
    return '+' + digits;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    const formattedPhone = formatPhoneNumber(phone);

    try {
      // Use Twilio edge function to send OTP
      const response = await supabase.functions.invoke('send-otp', {
        body: { phone: formattedPhone },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to send OTP');
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      // Store the OTP for verification
      setServerOtp(response.data.otp);
      
      toast.success('OTP sent to your phone!');
      setStep('otp');
    } catch (error: unknown) {
      console.error('OTP error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      // Verify OTP locally (compare with server-sent OTP)
      if (otp !== serverOtp) {
        throw new Error('Invalid OTP. Please try again.');
      }

      // OTP is correct - now sign up/sign in the user with phone
      const formattedPhone = formatPhoneNumber(phone);
      
      // Create a unique email from phone for auth (since we're using custom OTP)
      const phoneEmail = `${formattedPhone.replace(/\+/g, '')}@lovebirds.phone`;
      const tempPassword = `LB_${serverOtp}_${Date.now()}`;

      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: phoneEmail,
        password: tempPassword,
      });

      if (signInError) {
        // If user doesn't exist, create account
        if (signInError.message.includes('Invalid login credentials')) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: phoneEmail,
            password: tempPassword,
            options: {
              data: {
                phone: formattedPhone,
              },
            },
          });

          if (signUpError) throw signUpError;

          toast.success('Phone verified! Please complete your profile.');
          setStep('details');
          return;
        }
        throw signInError;
      }

      toast.success('Phone verified successfully!');
      
      // Check if profile exists
      if (signInData.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', signInData.user.id)
          .maybeSingle();

        if (!profile) {
          setStep('details');
        } else {
          redirectBasedOnRole(signInData.user.id);
        }
      }
    } catch (error: unknown) {
      console.error('Verify OTP error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Invalid OTP';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Login successful!');
      
      if (data.user) {
        redirectBasedOnRole(data.user.id);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) throw error;
      
      if (data.user) {
        toast.success('Account created! Please complete your profile.');
        setStep('details');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;
      
      toast.success('Password reset link sent to your email!');
      setStep('phone');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      toast.error(error.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !gender || !city) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please login first');
        setStep('phone');
        return;
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          full_name: fullName,
          phone: phone || null,
          date_of_birth: dateOfBirth || null,
          gender,
          city,
          country,
        });

      if (profileError) throw profileError;

      toast.success('Profile created successfully!');
      
      // Redirect based on gender/role
      if (gender === 'female') {
        navigate('/host');
      } else {
        navigate('/caller');
      }
    } catch (error: any) {
      console.error('Profile error:', error);
      toast.error(error.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <Logo size="lg" />
          <p className="mt-2 text-muted-foreground">
            {step === 'details' 
              ? 'Complete your profile'
              : step === 'forgot-password'
                ? 'Reset your password'
                : mode === 'login' 
                  ? 'Welcome back!' 
                  : 'Create your account'
            }
          </p>
        </div>

        {/* Phone Input Step */}
        {step === 'phone' && !useEmail && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                We'll send you a 6-digit OTP
              </p>
            </div>

            <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>

            <button
              type="button"
              onClick={() => setUseEmail(true)}
              className="w-full text-center text-sm text-primary hover:underline"
            >
              Use email instead
            </button>
          </form>
        )}

        {/* OTP Verification Step */}
        {step === 'otp' && !useEmail && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Enter the 6-digit code sent to {phone}
              </p>
              <InputOTP 
                maxLength={6} 
                value={otp} 
                onChange={(value) => setOtp(value)}
                className="justify-center"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              Change phone number
            </button>
          </form>
        )}

        {/* Email Login/Signup */}
        {step === 'phone' && useEmail && (
          <form onSubmit={mode === 'login' ? handleEmailLogin : handleEmailSignup} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Create password (min 6 chars)' : 'Enter your password'}
                    className="pl-10"
                    minLength={6}
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
              {loading ? (mode === 'login' ? 'Logging in...' : 'Creating...') : (mode === 'login' ? 'Login' : 'Sign Up')}
            </Button>

            <div className="space-y-2">
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setStep('forgot-password')}
                  className="w-full text-center text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              )}
              
              <p className="text-center text-sm text-muted-foreground">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-primary hover:underline"
                >
                  {mode === 'login' ? 'Sign up' : 'Login'}
                </button>
              </p>
              
              <button
                type="button"
                onClick={() => setUseEmail(false)}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
              >
                Use phone number instead
              </button>
            </div>
          </form>
        )}

        {/* Forgot Password Step */}
        {step === 'forgot-password' && (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <Label htmlFor="resetEmail">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="resetEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                We'll send you a link to reset your password
              </p>
            </div>

            <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* Profile Details Step */}
        {step === 'details' && (
          <form onSubmit={handleCompleteProfile} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    id="dob"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Gender *</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      gender === 'male'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-secondary text-foreground'
                    }`}
                  >
                    <span className="text-2xl">👨</span>
                    <p className="mt-1 font-medium">Male</p>
                    <p className="text-xs text-muted-foreground">Caller</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      gender === 'female'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-secondary text-foreground'
                    }`}
                  >
                    <span className="text-2xl">👩</span>
                    <p className="mt-1 font-medium">Female</p>
                    <p className="text-xs text-muted-foreground">Host</p>
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="city">City *</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter your city"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
              {loading ? 'Creating Profile...' : 'Complete Profile'}
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
