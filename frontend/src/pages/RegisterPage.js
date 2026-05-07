import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { emailRegister, sendOTP, verifyOTP } from '../utils/api';
import Toast from '../components/Toast';

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [step, setStep] = useState('initial'); // 'initial', 'password', 'otp'
  const [otp, setOtp] = useState('');
  const [mockOtp, setMockOtp] = useState('');
  const [inputType, setInputType] = useState('unknown');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.identifier) {
      setToast({ message: 'Please enter email or phone number', type: 'error' });
      return;
    }

    const isEmail = formData.identifier.includes('@');
    const isPhone = /^\d{10}$/.test(formData.identifier);

    if (isEmail) {
      setInputType('email');
      setStep('password');
    } else if (isPhone) {
      setInputType('phone');
      setLoading(true);
      try {
        const response = await sendOTP(formData.identifier);
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

  const handleFinalRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (inputType === 'email') {
        if (!formData.password) {
           setToast({ message: 'Password is required for email registration', type: 'error' });
           setLoading(false);
           return;
        }
        response = await emailRegister({ email: formData.identifier, password: formData.password });
      } else {
        response = await verifyOTP(formData.identifier, otp);
      }
      
      setToast({ message: 'Registration successful!', type: 'success' });
      // Log the user in immediately
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setToast({ message: error.message || 'Registration failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      {/* Navbar */}
      <nav className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#10b981] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-800">Farmfura</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500 mb-8 text-sm">Join Farmfura for fresh vegetables delivered to your doorstep.</p>

            {step === 'initial' && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">{t('emailOrPhone')}</label>
                  <input
                    type="text"
                    placeholder="Email or 10-digit mobile number"
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#10b981]/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 mt-4"
                >
                  {loading ? t('loading') : t('continue')}
                </button>
              </form>
            )}

            {step === 'password' && (
              <form onSubmit={handleFinalRegister} className="space-y-6">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={t('password')}
                  autoFocus
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] text-gray-900"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#10b981] text-white py-4 rounded-2xl font-bold hover:bg-[#059669] transition-all duration-200 shadow-md disabled:opacity-50"
                >
                  {loading ? t('loading') : 'Complete Registration'}
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
              <form onSubmit={handleFinalRegister} className="space-y-6">
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter OTP"
                  maxLength={4}
                  autoFocus
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981] text-center text-2xl font-bold tracking-widest text-gray-900"
                />
                {mockOtp && (
                  <div className="p-2 bg-yellow-50 text-yellow-700 text-xs rounded border border-yellow-100 text-center">
                    Mock OTP: <span className="font-bold">{mockOtp}</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#10b981] text-white py-4 rounded-2xl font-bold hover:bg-[#059669] transition-all duration-200 shadow-md disabled:opacity-50"
                >
                  {loading ? t('loading') : 'Verify & Register'}
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

            <div className="mt-8 text-center flex flex-col gap-4">
              <p className="text-gray-600 text-sm">
                {t('alreadyHaveAccount')}{' '}
                <Link to="/login" className="text-[#10b981] font-bold hover:underline">
                  {t('login')}
                </Link>
              </p>
              
              <button 
               onClick={() => navigate('/login')}
               className="text-gray-500 text-xs font-medium hover:text-gray-800 transition-colors uppercase tracking-wider"
              >
               ← Back
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
             <Link to="/" className="text-gray-400 text-sm hover:text-gray-600 transition-colors">
               {t('backToHome')}
             </Link>
          </div>
        </div>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default RegisterPage;
