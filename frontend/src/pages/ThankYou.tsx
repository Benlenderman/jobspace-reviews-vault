import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [copied, setCopied] = useState(false);

  const discountCode = searchParams.get('code');
  const discountType = searchParams.get('type'); // 'video' or 'google'
  const discountPercent = discountType === 'video' ? 20 : 10;

  useEffect(() => {
    if (!discountCode) {
      // If no discount code, redirect to home
      navigate('/');
    }
  }, [discountCode, navigate]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const copyToClipboard = () => {
    if (discountCode) {
      navigator.clipboard.writeText(discountCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!discountCode) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
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

      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
              <svg
                className="w-16 h-16 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {i18n.language === 'he' ? 'תודה רבה!' : 'Thank You!'}
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto">
            {i18n.language === 'he'
              ? 'הביקורת שלך חשובה לנו מאוד'
              : 'Your review means a lot to us'}
          </p>
        </div>

        {/* Discount Code Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg mb-6">
              🎉 {i18n.language === 'he' ? `הנחה של ${discountPercent}%` : `${discountPercent}% Discount`}
            </div>

            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              {i18n.language === 'he' ? 'קוד ההנחה שלך:' : 'Your Discount Code:'}
            </h2>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-4 border-dashed border-purple-400 rounded-2xl p-6 mb-6">
              <div className="text-4xl md:text-5xl font-mono font-bold text-purple-700 tracking-wider mb-4">
                {discountCode}
              </div>

              <button
                onClick={copyToClipboard}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                {copied
                  ? i18n.language === 'he'
                    ? '✓ הועתק!'
                    : '✓ Copied!'
                  : i18n.language === 'he'
                  ? '📋 העתק קוד'
                  : '📋 Copy Code'}
              </button>
            </div>

            <p className="text-gray-600 text-lg">
              {i18n.language === 'he'
                ? `קבל ${discountPercent}% הנחה על פרסום המשרה הבא שלך!`
                : `Get ${discountPercent}% off your next job posting!`}
            </p>
          </div>

          {/* How to Use */}
          <div className="border-t pt-8">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
              {i18n.language === 'he' ? 'איך להשתמש בקוד?' : 'How to Use Your Code?'}
            </h3>

            <div className="space-y-4" dir={i18n.language === 'he' ? 'rtl' : 'ltr'}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1 text-gray-800">
                    {i18n.language === 'he' ? 'פרסם משרה חדשה' : 'Post a New Job'}
                  </h4>
                  <p className="text-gray-600">
                    {i18n.language === 'he'
                      ? 'כנס לחשבון JobSpace שלך והתחל לפרסם משרה חדשה'
                      : 'Log in to your JobSpace account and start posting a new job'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1 text-gray-800">
                    {i18n.language === 'he' ? 'הזן את הקוד בתשלום' : 'Enter Code at Checkout'}
                  </h4>
                  <p className="text-gray-600">
                    {i18n.language === 'he'
                      ? 'בעמוד התשלום, הזן את קוד ההנחה בשדה המיועד'
                      : 'On the payment page, enter your discount code in the designated field'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1 text-gray-800">
                    {i18n.language === 'he' ? 'תהנה מההנחה!' : 'Enjoy Your Discount!'}
                  </h4>
                  <p className="text-gray-600">
                    {i18n.language === 'he'
                      ? `ההנחה של ${discountPercent}% תוחל אוטומטית על הרכישה שלך`
                      : `Your ${discountPercent}% discount will be applied automatically`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-lg mb-2 text-gray-800">
            {i18n.language === 'he' ? 'שמור את הקוד!' : 'Save Your Code!'}
          </h3>
          <p className="text-gray-700">
            {i18n.language === 'he'
              ? 'הקוד שלך תקף לתמיד. שמור אותו במקום בטוח כדי להשתמש בו בעתיד.'
              : 'Your code is valid indefinitely. Save it in a safe place to use it in the future.'}
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-primary-600 to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            {i18n.language === 'he' ? '🏠 חזור לדף הבית' : '🏠 Back to Home'}
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 mb-4">
            {i18n.language === 'he'
              ? 'תודה שבחרת ב-JobSpace! הביקורת שלך עוזרת לנו לשפר את השירות.'
              : 'Thank you for choosing JobSpace! Your review helps us improve our service.'}
          </p>
          <p className="text-sm text-gray-500">&copy; 2026 JobSpace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
