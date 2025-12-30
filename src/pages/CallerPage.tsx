import { Routes, Route } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import CallerDashboard from '@/components/caller/CallerDashboard';
import CallerCallScreen from '@/components/caller/CallerCallScreen';
import CallerCallSummary from '@/components/caller/CallerCallSummary';

const CallerPage = () => {
  return (
    <Routes>
      <Route path="/" element={<MobileLayout><CallerDashboard /></MobileLayout>} />
      <Route path="/call/:hostId" element={<CallerCallScreen />} />
      <Route path="/call-summary" element={<CallerCallSummary />} />
    </Routes>
  );
};

export default CallerPage;
