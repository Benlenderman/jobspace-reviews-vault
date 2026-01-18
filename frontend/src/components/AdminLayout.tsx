import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.auth.logout();
    } catch (error) {
      // Ignore
    }
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary-600">JobSpace Admin</h1>
            <div className="flex items-center gap-6">
              <Link to="/admin/dashboard" className="hover:text-primary-600">
                Dashboard
              </Link>
              <Link to="/admin/collections" className="hover:text-primary-600">
                Collections
              </Link>
              <Link to="/admin/submissions" className="hover:text-primary-600">
                Submissions
              </Link>
              <Link to="/admin/settings" className="hover:text-primary-600">
                Settings
              </Link>
              <div className="border-l pl-4 flex items-center gap-4">
                <span className="text-sm text-gray-600">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
