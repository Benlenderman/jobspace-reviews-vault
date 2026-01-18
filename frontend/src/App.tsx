import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

// Pages
import ReviewsWall from './pages/ReviewsWall';
import SubmitReview from './pages/SubmitReview';
import IncentiveLanding from './pages/IncentiveLanding';
import ThankYou from './pages/ThankYou';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminSubmissions from './pages/admin/Submissions';
import AdminCollections from './pages/admin/Collections';
import AdminSettings from './pages/admin/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuthStore();

  if (!accessToken) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
}

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/reviews/jobspace" />} />
          <Route path="/reviews/:slug" element={<ReviewsWall />} />
          <Route path="/incentive/:publicToken" element={<IncentiveLanding />} />
          <Route path="/submit/:publicToken" element={<SubmitReview />} />
          <Route path="/thank-you" element={<ThankYou />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Navigate to="/admin/dashboard" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/submissions"
            element={
              <ProtectedRoute>
                <AdminSubmissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/collections"
            element={
              <ProtectedRoute>
                <AdminCollections />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
