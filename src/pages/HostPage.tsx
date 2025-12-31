import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import HostVerification from '@/components/host/HostVerification';
import HostDashboard from '@/components/host/HostDashboard';
import HostSession from '@/components/host/HostSession';
import HostSessionSummary from '@/components/host/HostSessionSummary';
import useAuth from '@/hooks/useAuth';

const HostPage = () => {
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
      <Route path="/verification" element={<MobileLayout><HostVerification /></MobileLayout>} />
      <Route path="/" element={<MobileLayout><HostDashboard /></MobileLayout>} />
      <Route path="/session" element={<HostSession />} />
      <Route path="/session-summary" element={<HostSessionSummary />} />
    </Routes>
  );
};

export default HostPage;
