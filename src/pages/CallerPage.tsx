import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import CallerDashboard from '@/components/caller/CallerDashboard';
import CallerCallScreen from '@/components/caller/CallerCallScreen';
import CallerCallSummary from '@/components/caller/CallerCallSummary';
import useAuth from '@/hooks/useAuth';

const CallerPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<MobileLayout><CallerDashboard /></MobileLayout>} />
      <Route path="/call/:hostId" element={<CallerCallScreen />} />
      <Route path="/call-summary" element={<CallerCallSummary />} />
    </Routes>
  );
};

export default CallerPage;
