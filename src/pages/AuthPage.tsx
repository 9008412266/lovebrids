import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/common/Logo';
import { toast } from 'sonner';
import { Phone, Lock, User, Calendar, MapPin, ArrowRight, Mail } from 'lucide-react';

type AuthMode = 'login' | 'signup';
type AuthStep = 'email' | 'details' | 'forgot-password';

const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [step, setStep] = useState<AuthStep>('email');
  const [loading, setLoading] = useState(false);
  
  // Email & Password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Phone (optional for profile)
  const [phone, setPhone] = useState('');
  
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
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Defer to avoid deadlock
          setTimeout(() => {
            checkProfileAndRedirect(session.user.id);
          }, 0);
        }
      }
    );

    checkSession();
    return () => subscription.unsubscribe();
  }, []);

  const checkProfileAndRedirect = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (!profile) {
      setStep('details');
    } else {
      redirectBasedOnRole(userId);
    }
  };

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
        await checkProfileAndRedirect(data.user.id);
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
      setStep('email');
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
        setStep('email');
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

        {/* Email Login/Signup */}
        {step === 'email' && (
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
              onClick={() => setStep('email')}
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
