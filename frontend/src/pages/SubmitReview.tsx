import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../api/client';

export default function SubmitReview() {
  const { publicToken } = useParams<{ publicToken: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    personName: '',
    personRole: '',
    companyName: '',
    rating: 5,
    text: '',
    consent: false,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const data = new FormData();
      data.append('personName', formData.personName);
      data.append('personRole', formData.personRole);
      data.append('companyName', formData.companyName);
      data.append('rating', formData.rating.toString());
      data.append('text', formData.text);
      data.append('consent', 'true');
      if (videoFile) {
        data.append('video', videoFile);
      }

      return apiClient.public.submit(publicToken!, data);
    },
    onSuccess: (response: any) => {
      // Redirect to thank you page with discount code
      if (response.discountCode) {
        navigate(`/thank-you?code=${response.discountCode}&type=video`);
      } else {
        setSuccess(true);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      alert('Please upload a video');
      return;
    }
    if (!formData.consent) {
      alert('Please accept the consent');
      return;
    }
    mutation.mutate();
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('submit.success')}</h2>
          <p className="text-gray-600">{t('submit.successMessage')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-2 text-center">{t('submit.title')}</h1>
          <p className="text-gray-600 text-center mb-8">{t('submit.subtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">{t('submit.name')}</label>
              <input
                type="text"
                required
                value={formData.personName}
                onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('submit.role')}</label>
              <input
                type="text"
                required
                value={formData.personRole}
                onChange={(e) => setFormData({ ...formData, personRole: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('submit.company')}</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('submit.rating')}</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="text-3xl focus:outline-none"
                  >
                    {star <= formData.rating ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('submit.text')}</label>
              <textarea
                required
                rows={4}
                maxLength={1000}
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.text.length}/1000
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('submit.video')}</label>
              <input
                type="file"
                required
                accept="video/mp4,video/webm,video/quicktime"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {videoFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                checked={formData.consent}
                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                className="mt-1"
              />
              <label className="text-sm text-gray-700">{t('submit.consent')}</label>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {mutation.isPending ? t('common.loading') : t('submit.submit')}
            </button>

            {mutation.isError && (
              <p className="text-red-600 text-sm text-center">
                {mutation.error?.message || 'Failed to submit'}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
