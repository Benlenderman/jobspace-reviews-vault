import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../api/client';
import { useState } from 'react';

export default function ReviewsWall() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['wall', slug],
    queryFn: () => apiClient.public.wall(slug!),
  });

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  const avgRating =
    data?.approvedSubmissions.reduce((sum: number, s: any) => sum + s.rating, 0) /
      (data?.approvedSubmissions.length || 1) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">JobSpace Reviews</h1>
          <div className="flex gap-2">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-3 py-1 rounded ${
                i18n.language === 'en' ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('he')}
              className={`px-3 py-1 rounded ${
                i18n.language === 'he' ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}
            >
              עב
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('home.hero.title')}</h1>
          <p className="text-xl mb-8 opacity-90">{t('home.hero.subtitle')}</p>
          <a
            href={`/submit/${data?.collection?.publicToken || ''}`}
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            {t('home.hero.cta')}
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary-600">
              {data?.approvedSubmissions?.length || 0}
            </div>
            <div className="text-gray-600 mt-2">{t('home.stats.reviews')}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary-600">{avgRating.toFixed(1)}</div>
            <div className="text-yellow-400 text-2xl mt-1">★★★★★</div>
            <div className="text-gray-600 mt-2">{t('home.stats.rating')}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-primary-600">98%</div>
            <div className="text-gray-600 mt-2">{t('home.stats.satisfaction')}</div>
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Video Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.approvedSubmissions?.map((submission: any) => (
            <div
              key={submission._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
              onClick={() => setSelectedVideo(submission)}
            >
              <div className="aspect-video bg-gray-200 relative">
                {submission.video?.thumbnailPath && (
                  <img
                    src={`http://localhost:3000/uploads/${submission.video.thumbnailPath}`}
                    alt={submission.personName}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
                {/* Download Button */}
                <a
                  href={`http://localhost:3000/uploads/${submission.video.storagePath}`}
                  download={`${submission.personName}-testimonial.${submission.video.storagePath.split('.').pop()}`}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-2 right-2 bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full shadow-lg transition-all z-10"
                  title={i18n.language === 'he' ? 'הורד סרטון' : 'Download video'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-yellow-400">
                    {'★'.repeat(submission.rating)}
                    {'☆'.repeat(5 - submission.rating)}
                  </div>
                </div>
                <h3 className="font-bold text-lg">{submission.personName}</h3>
                <p className="text-sm text-gray-600">{submission.personRole}</p>
                {submission.companyName && (
                  <p className="text-sm text-gray-500">{submission.companyName}</p>
                )}
                <p className="mt-3 text-gray-700 line-clamp-3">{submission.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Google Reviews */}
      {data?.googleReviews?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16 bg-white">
          <h2 className="text-3xl font-bold mb-8 text-center">Google Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.googleReviews.map((review: any) => (
              <div key={review._id} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                    {review.authorName[0]}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">{review.authorName}</h4>
                    <div className="text-yellow-400 text-sm">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </div>
                    <p className="mt-2 text-gray-700">{review.text}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(review.time).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">{selectedVideo.personName}</h3>
              <div className="flex gap-2">
                <a
                  href={`http://localhost:3000/uploads/${selectedVideo.video.storagePath}`}
                  download={`${selectedVideo.personName}-testimonial.${selectedVideo.video.storagePath.split('.').pop()}`}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  title={i18n.language === 'he' ? 'הורד סרטון' : 'Download video'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {i18n.language === 'he' ? 'הורד' : 'Download'}
                </a>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-gray-500 hover:text-gray-700 px-2"
                >
                  ✕
                </button>
              </div>
            </div>
            <video
              controls
              className="w-full"
              src={`http://localhost:3000/uploads/${selectedVideo.video.storagePath}`}
            />
            <div className="p-6">
              <p className="text-gray-700">{selectedVideo.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 JobSpace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
