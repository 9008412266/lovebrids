import MobileLayout from '@/components/layout/MobileLayout';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';

interface AdminPageProps {
  isLogin?: boolean;
}

const AdminPage = ({ isLogin = false }: AdminPageProps) => {
  return (
    <MobileLayout>
      {isLogin ? <AdminLogin /> : <AdminDashboard />}
    </MobileLayout>
  );
};

export default AdminPage;
