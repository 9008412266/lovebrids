import MobileLayout from '@/components/layout/MobileLayout';
import RegistrationFlow from '@/components/registration/RegistrationFlow';
import Logo from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <RegistrationFlow />
      <div className="absolute bottom-6 left-0 right-0 px-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-muted-foreground"
          onClick={() => navigate('/admin-login')}
        >
          <Shield size={16} />
          Admin Login
        </Button>
      </div>
    </MobileLayout>
  );
};

export default Index;
