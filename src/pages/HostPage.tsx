import { Routes, Route } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import HostVerification from '@/components/host/HostVerification';
import HostDashboard from '@/components/host/HostDashboard';
import HostSession from '@/components/host/HostSession';
import HostSessionSummary from '@/components/host/HostSessionSummary';

const HostPage = () => {
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
