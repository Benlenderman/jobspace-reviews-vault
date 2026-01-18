import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import AdminLayout from '../../components/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => apiClient.submissions.stats(),
  });

  const ratingData = stats?.ratingDistribution?.map((item: any) => ({
    rating: `${item._id} ★`,
    count: item.count,
  })) || [];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Submissions</div>
          <div className="text-3xl font-bold text-primary-600">{stats?.total || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Pending</div>
          <div className="text-3xl font-bold text-yellow-600">{stats?.pending || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Approved</div>
          <div className="text-3xl font-bold text-green-600">{stats?.approved || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Rejected</div>
          <div className="text-3xl font-bold text-red-600">{stats?.rejected || 0}</div>
        </div>
      </div>

      {ratingData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Rating Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </AdminLayout>
  );
}
