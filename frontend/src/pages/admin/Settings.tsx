import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import AdminLayout from '../../components/AdminLayout';

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => apiClient.settings.get(),
  });

  const [placeId, setPlaceId] = useState('');
  const [googleSyncEnabled, setGoogleSyncEnabled] = useState(false);
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');

  useState(() => {
    if (data) {
      setPlaceId(data.placeId || '');
      setGoogleSyncEnabled(data.googleSyncEnabled || false);
      setGoogleReviewUrl(data.googleReviewUrl || '');
    }
  });

  const mutation = useMutation({
    mutationFn: () => apiClient.settings.update({ placeId, googleSyncEnabled, googleReviewUrl }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      alert('Settings saved successfully');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (isLoading) return <AdminLayout><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Google Place ID
            </label>
            <input
              type="text"
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              placeholder="ChIJN1t_tDeuEmsRUsoyG83frY4"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Leave empty to use mock Google reviews
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Google Review URL
            </label>
            <input
              type="text"
              value={googleReviewUrl}
              onChange={(e) => setGoogleReviewUrl(e.target.value)}
              placeholder="https://g.page/r/YOUR_GOOGLE_PLACE_ID/review"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              URL where users will be redirected to leave a Google review
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="googleSync"
              checked={googleSyncEnabled}
              onChange={(e) => setGoogleSyncEnabled(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="googleSync" className="text-sm">
              Enable automatic Google Reviews sync
            </label>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {mutation.isPending ? 'Saving...' : 'Save Settings'}
          </button>

          {mutation.isError && (
            <p className="text-red-600 text-sm">
              {mutation.error?.message || 'Failed to save settings'}
            </p>
          )}
        </form>
      </div>
    </AdminLayout>
  );
}
