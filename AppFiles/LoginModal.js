// LoginModal.js - Login Component
import React, { useState } from 'react';
import { X, Phone, ArrowRight } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onLoginSuccess, authService }) => {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetModal = () => {
    setStep('phone');
    setPhoneNumber('');
    setOtp('');
    setGeneratedOTP('');
    setError('');
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOTP = async () => {
    setError('');
    
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    
    try {
      const response = await authService.sendOTP(phoneNumber);
      if (response.success) {
        setGeneratedOTP(response.otp);
        setStep('otp');
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    
    if (otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }

    setLoading(true);
    
    try {
      const response = await authService.verifyOTP(phoneNumber, otp, generatedOTP);
      if (response.success) {
        onLoginSuccess(response.user, response.isNewUser);
        handleClose();
      } else {
        setError(response.message || 'Invalid OTP');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp('');
    setError('');
    setLoading(true);
    
    try {
      const response = await authService.sendOTP(phoneNumber);
      if (response.success) {
        setGeneratedOTP(response.otp);
      }
    } catch (error) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {step === 'phone' ? 'Login / Sign Up' : 'Verify OTP'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'phone' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      setPhoneNumber(value);
                    }
                  }}
                  placeholder="Enter your mobile number"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                We'll send you a verification code
              </p>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              onClick={handleSendOTP}
              disabled={loading || phoneNumber.length !== 10}
              className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
                loading || phoneNumber.length !== 10
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  Send OTP
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Enter the 4-digit code sent to{' '}
                <span className="font-medium">+91 {phoneNumber}</span>
              </p>
              <p className="text-xs text-green-600 mb-4">
                Demo OTP: <strong>{generatedOTP}</strong>
              </p>
              
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 4) {
                    setOtp(value);
                  }
                }}
                placeholder="Enter OTP"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl tracking-widest"
                maxLength={4}
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 4}
              className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
                loading || otp.length !== 4
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Verify OTP'
              )}
            </button>

            <div className="text-center">
              <button
                onClick={() => setStep('phone')}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Change Number
              </button>
              <span className="mx-2 text-gray-400">•</span>
              <button
                onClick={handleResendOTP}
                disabled={loading}
                className="text-sm text-green-600 hover:text-green-800"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
