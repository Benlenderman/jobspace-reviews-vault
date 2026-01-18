import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export default function IncentiveLanding() {
  const { publicToken } = useParams<{ publicToken: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<'video' | 'google' | null>(null);

  const { data: googleReviewData } = useQuery({
    queryKey: ['google-review-url'],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/api/public/google-review-url`);
      return response.json();
    },
  });

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleVideoClick = () => {
    navigate(`/submit/${publicToken}`);
  };

  const handleGoogleClick = async () => {
    try {
      // Generate discount code for Google review
      const response = await fetch(
        `http://localhost:3000/api/public/google-review-discount/${publicToken}`,
        { method: 'POST' }
      );
      const data = await response.json();

      if (data.discountCode) {
        // Redirect to thank you page with discount code
        navigate(`/thank-you?code=${data.discountCode}&type=google`);

        // Open Google review in new tab after a short delay
        const googleUrl = googleReviewData?.googleReviewUrl || 'https://g.page/r/YOUR_GOOGLE_PLACE_ID/review';
        setTimeout(() => {
          window.open(googleUrl, '_blank');
        }, 500);
      }
    } catch (error) {
      console.error('Error generating discount code:', error);
      // Fallback: just open Google review
      const googleUrl = googleReviewData?.googleReviewUrl || 'https://g.page/r/YOUR_GOOGLE_PLACE_ID/review';
      window.open(googleUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">JobSpace</h1>
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

      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse">
              🎁 {i18n.language === 'he' ? 'קבל הנחה מיידית!' : 'Get Instant Discount!'}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            {i18n.language === 'he'
              ? 'שתף את החוויה שלך'
              : 'Share Your Experience'}
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto">
            {i18n.language === 'he'
              ? 'עזור לאחרים לגלות את JobSpace וקבל קוד הנחה על הרכישה הבאה!'
              : 'Help others discover JobSpace and get a discount code for your next purchase!'}
          </p>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {i18n.language === 'he'
              ? 'בחר אחת משתי האפשרויות וקבל קוד הנחה ייחודי'
              : 'Choose one of two options and receive a unique discount code'}
          </p>
        </div>

        {/* Discount Banner */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-2xl p-6 mb-12 text-center shadow-xl">
          <div className="text-4xl mb-3">💰</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {i18n.language === 'he' ? 'ההנחה שלך ממתינה!' : 'Your Discount Awaits!'}
          </h3>
          <p className="text-gray-700 text-lg font-semibold">
            {i18n.language === 'he'
              ? 'סרטון = 20% הנחה | גוגל = 10% הנחה'
              : 'Video = 20% OFF | Google = 10% OFF'}
          </p>
          <p className="text-gray-600 text-sm mt-2">
            {i18n.language === 'he'
              ? 'על פרסום משרה הבא שלך'
              : 'On your next job posting'}
          </p>
        </div>

        {/* Two Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Option 1: Video Testimonial */}
          <div
            className={`bg-white rounded-3xl shadow-2xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-3xl border-4 ${
              selectedOption === 'video' ? 'border-primary-500' : 'border-transparent'
            }`}
            onClick={() => setSelectedOption('video')}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                {i18n.language === 'he' ? 'אופציה 1: סרטון המלצה' : 'Option 1: Video Testimonial'}
              </h3>

              <div className="space-y-3 mb-6 text-right" dir={i18n.language === 'he' ? 'rtl' : 'ltr'}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm mt-1">
                    ✓
                  </div>
                  <p className="text-gray-700 text-left">
                    {i18n.language === 'he'
                      ? 'צלם סרטון קצר (30-60 שניות)'
                      : 'Record a short video (30-60 seconds)'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm mt-1">
                    ✓
                  </div>
                  <p className="text-gray-700 text-left">
                    {i18n.language === 'he'
                      ? 'שתף את החוויה האישית שלך'
                      : 'Share your personal experience'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm mt-1">
                    ✓
                  </div>
                  <p className="text-gray-700 text-left">
                    {i18n.language === 'he'
                      ? 'הסרטון יופיע בדף הביקורות שלנו'
                      : 'Your video will appear on our reviews page'}
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4 mb-6">
                <p className="text-purple-800 font-bold text-xl">
                  💎 {i18n.language === 'he' ? 'הנחה של 20%' : '20% Discount'}
                </p>
                <p className="text-purple-700 text-sm mt-1">
                  {i18n.language === 'he' ? 'על פרסום המשרה הבא' : 'On your next job posting'}
                </p>
              </div>

              <button
                onClick={handleVideoClick}
                className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                {i18n.language === 'he' ? '📹 צלם סרטון עכשיו' : '📹 Record Video Now'}
              </button>
            </div>
          </div>

          {/* Option 2: Google Review */}
          <div
            className={`bg-white rounded-3xl shadow-2xl p-8 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-3xl border-4 ${
              selectedOption === 'google' ? 'border-red-500' : 'border-transparent'
            }`}
            onClick={() => setSelectedOption('google')}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                {i18n.language === 'he' ? 'אופציה 2: ביקורת בגוגל' : 'Option 2: Google Review'}
              </h3>

              <div className="space-y-3 mb-6 text-right" dir={i18n.language === 'he' ? 'rtl' : 'ltr'}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm mt-1">
                    ✓
                  </div>
                  <p className="text-gray-700 text-left">
                    {i18n.language === 'he'
                      ? 'מהיר וקל - 2 דקות בלבד'
                      : 'Quick and easy - just 2 minutes'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm mt-1">
                    ✓
                  </div>
                  <p className="text-gray-700 text-left">
                    {i18n.language === 'he'
                      ? 'כתוב כמה משפטים על החוויה שלך'
                      : 'Write a few sentences about your experience'}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm mt-1">
                    ✓
                  </div>
                  <p className="text-gray-700 text-left">
                    {i18n.language === 'he'
                      ? 'עוזר לעסק שלנו לצמוח'
                      : 'Helps our business grow'}
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 mb-6">
                <p className="text-orange-800 font-bold text-xl">
                  ⭐ {i18n.language === 'he' ? 'הנחה של 10%' : '10% Discount'}
                </p>
                <p className="text-orange-700 text-sm mt-1">
                  {i18n.language === 'he' ? 'על פרסום המשרה הבא' : 'On your next job posting'}
                </p>
              </div>

              <button
                onClick={handleGoogleClick}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                {i18n.language === 'he' ? '⭐ כתוב ביקורת בגוגל' : '⭐ Write Google Review'}
              </button>
            </div>
          </div>
        </div>

        {/* Why It Matters Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            {i18n.language === 'he' ? 'למה זה חשוב?' : 'Why It Matters?'}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💙</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                {i18n.language === 'he' ? 'עוזר לאחרים' : 'Helps Others'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'he'
                  ? 'הביקורת שלך עוזרת למועמדים ומעסיקים לקבל החלטות טובות יותר'
                  : 'Your review helps candidates and employers make better decisions'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                {i18n.language === 'he' ? 'משפר את השירות' : 'Improves Service'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'he'
                  ? 'המשוב שלך מאפשר לנו להמשיך לשפר ולהעניק שירות טוב יותר'
                  : 'Your feedback allows us to continue improving and provide better service'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌟</span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">
                {i18n.language === 'he' ? 'בונה אמון' : 'Builds Trust'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'he'
                  ? 'ביקורות אמיתיות בונות אמון ומחזקות את הקהילה שלנו'
                  : 'Authentic reviews build trust and strengthen our community'}
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {i18n.language === 'he' ? 'איך זה עובד?' : 'How It Works?'}
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <div className="text-5xl font-bold mb-2">20%</div>
              <p className="text-purple-100">
                {i18n.language === 'he' ? 'הנחה על סרטון' : 'Video Review Discount'}
              </p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">10%</div>
              <p className="text-purple-100">
                {i18n.language === 'he' ? 'הנחה על ביקורת גוגל' : 'Google Review Discount'}
              </p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">
                {i18n.language === 'he' ? 'מיידי' : 'Instant'}
              </div>
              <p className="text-purple-100">
                {i18n.language === 'he' ? 'קבלת קוד הנחה' : 'Discount Code Delivery'}
              </p>
            </div>
          </div>

          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            {i18n.language === 'he'
              ? 'אחרי שתשלימו את הביקורת, תקבלו קוד הנחה ייחודי באופן מיידי. השתמשו בו בפרסום המשרה הבא שלכם!'
              : 'After completing your review, you\'ll receive a unique discount code instantly. Use it on your next job posting!'}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 mb-4">
            {i18n.language === 'he'
              ? 'תודה שבחרת ב-JobSpace! הביקורת שלך חשובה לנו.'
              : 'Thank you for choosing JobSpace! Your review matters to us.'}
          </p>
          <p className="text-sm text-gray-500">
            &copy; 2026 JobSpace. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
