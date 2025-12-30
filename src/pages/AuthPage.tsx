import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/common/Logo';
import { toast } from 'sonner';
import { Mail, Lock, User, Phone, Calendar, MapPin, ArrowRight } from 'lucide-react';

type AuthMode = 'login' | 'signup';
type SignupStep = 'credentials' | 'details';

const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [signupStep, setSignupStep] = useState<SignupStep>('credentials');
  const [loading, setLoading] = useState(false);
  
  // Login/Signup credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Profile details
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Login successful!');
      
      // Get user role and redirect
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (roleData?.role === 'host') {
        navigate('/host');
      } else if (roleData?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/caller');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSignupStep('details');
  };

  const handleSignupComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !gender || !city) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          full_name: fullName,
          phone,
          date_of_birth: dateOfBirth || null,
          gender,
          city,
          country,
        });

      if (profileError) throw profileError;

      toast.success('Account created successfully!');
      
      // Redirect based on gender/role
      if (gender === 'female') {
        navigate('/host');
      } else {
        navigate('/caller');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Signup failed');
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
            {mode === 'login' ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-6">
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
                    placeholder="Enter your password"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-primary hover:underline"
              >
                Sign up
              </button>
            </p>
          </form>
        )}

        {/* Signup Step 1: Credentials */}
        {mode === 'signup' && signupStep === 'credentials' && (
          <form onSubmit={handleSignupCredentials} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    id="signup-email"
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
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (min 6 chars)"
                    className="pl-10"
                    minLength={6}
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" variant="gradient" className="w-full">
              Continue <ArrowRight size={16} className="ml-2" />
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-primary hover:underline"
              >
                Login
              </button>
            </p>
          </form>
        )}

        {/* Signup Step 2: Personal Details */}
        {mode === 'signup' && signupStep === 'details' && (
          <form onSubmit={handleSignupComplete} className="space-y-6">
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

            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setSignupStep('credentials')}
              >
                Back
              </Button>
              <Button type="submit" variant="gradient" className="flex-1" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
