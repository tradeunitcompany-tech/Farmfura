import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { sendOTP, verifyOTP, emailLogin } from '../utils/api';
import Toast from '../components/Toast';

const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('initial'); // 'initial', 'password', 'otp'
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [mockOtp, setMockOtp] = useState('');
  const [inputType, setInputType] = useState('unknown'); // 'email' or 'phone'

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!identifier) {
      setToast({ message: 'Please enter email or phone number', type: 'error' });
      return;
    }

    // Detect type
    const isEmail = identifier.includes('@');
    const isPhone = /^\d{10}$/.test(identifier);

    if (isEmail) {
      setInputType('email');
      setStep('password');
    } else if (isPhone) {
      setInputType('phone');
      setLoading(true);
      try {
        const response = await sendOTP(identifier);
        setMockOtp(response.mockOtp);
        setStep('otp');
      } catch (error) {
        setToast({ message: error.message, type: 'error' });
      } finally {
        setLoading(false);
      }
    } else {
      setToast({ message: 'Please enter a valid email or 10-digit mobile number', type: 'error' });
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (inputType === 'email') {
        response = await emailLogin(identifier, password);
      } else {
        response = await verifyOTP(identifier, otp);
      }
      login(response.user, response.token);
      setToast({ message: 'Login successful!', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="text-2xl">🌱</div>
          <span className="text-2xl font-bold text-[#10b981] italic">Farmfura</span>
        </div>
        <Link to="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-1 text-sm font-medium">
          ← {t('backToHome')}
        </Link>
      </nav>

      {/* Login Card Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-10 w-full max-w-[450px] animate-slideUp">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('welcome')}</h1>
            <p className="text-gray-500 text-sm mb-8">{t('loginSubtitle')}</p>

            {step === 'initial' && (
              <form onSubmit={handleContinue} className="space-y-6">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={t('emailOrPhone')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#10b981] text-gray-800 placeholder-gray-400"
                />
                <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-4 rounded-lg font-bold shadow-md transition-all duration-200 disabled:opacity-70"
              >
                {loading ? t('loading') : t('continue')}
              </button>

              <div className="text-center mt-6">
                <p className="text-gray-500 text-sm">
                  {t('dontHaveAccount')}{' '}
                  <Link to="/register" className="text-[#10b981] font-bold hover:underline">
                    {t('register')}
                  </Link>
                </p>
              </div>
            </form>
            )}

            {step === 'password' && (
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('password')}
                  autoFocus
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#10b981] text-gray-800"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#10b981] text-white py-3 rounded-lg font-bold hover:bg-[#059669] transition shadow-md disabled:opacity-50"
                >
                  {loading ? t('loading') : t('login')}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('initial')}
                  className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest font-bold"
                >
                  ← Back
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter OTP"
                  maxLength={6}
                  autoFocus
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#10b981] text-center text-2xl font-bold tracking-widest"
                />
                {mockOtp && (
                  <div className="p-2 bg-yellow-50 text-yellow-700 text-xs rounded border border-yellow-100">
                    Mock OTP: <span className="font-bold">{mockOtp}</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#10b981] text-white py-3 rounded-lg font-bold hover:bg-[#059669] transition shadow-md disabled:opacity-50"
                >
                  {loading ? t('loading') : t('verifyOTP')}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('initial')}
                  className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest font-bold"
                >
                  ← Back
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
};

export default LoginPage;


