import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/common/Logo';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email && password) {
      navigate('/admin');
    }
  };

  return (
    <div className="flex flex-col min-h-full p-6 animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <Logo size="lg" />
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
          <p className="text-muted-foreground">Sign in to manage the platform</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <div className="glass-card p-4 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <Mail className="text-muted-foreground" size={20} />
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent border-0 focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <Lock className="text-muted-foreground" size={20} />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent border-0 focus-visible:ring-0"
              />
            </div>
          </div>
          <Button variant="gradient" size="lg" className="w-full" onClick={handleLogin}>
            Sign In <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
