import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { User, Lock, Eye, EyeOff, Shield, Key, Building2 } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [csrf, setCsrf] = useState({ headerName: 'x-csrf-token', csrfToken: '' });

  useEffect(() => {
    // fetch CSRF token cookie and header name
    (async () => {
      try {
        const res = await fetch('/api/auth/csrf', { credentials: 'include' });
        const { data } = await res.json();
        if (data?.csrfToken) setCsrf({ headerName: data.headerName || 'x-csrf-token', csrfToken: data.csrfToken });
      } catch (error) {
        console.error('CSRF fetch error:', error);
      }
    })();
  }, []);

  const [pendingMfa, setPendingMfa] = useState(false);
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json', 
          [csrf.headerName]: csrf.csrfToken 
        },
        body: JSON.stringify({ email: data.username, password: data.password })
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error?.message || 'Invalid credentials');
      }

      if (responseData?.mfaRequired) {
        setPendingMfa(true);
      } else {
        localStorage.setItem('adminAuthAt', String(Date.now()));
        toast.success('Login successful!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const [mfaCode, setMfaCode] = useState('');
  const submitMfa = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json', 
          [csrf.headerName]: csrf.csrfToken 
        },
        body: JSON.stringify({ code: mfaCode })
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error?.message || 'Invalid 2FA code');
      }

      localStorage.setItem('adminAuthAt', String(Date.now()));
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('2FA error:', error);
      toast.error(error.message || '2FA verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/app_logo-removebg-preview.png" 
                alt="Uddaan Agencies" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Uddaan Agencies Management System</p>
          </div>

          {/* Login Form */}
          {!pendingMfa ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Username */}
              <div>
                <label className="form-label flex items-center space-x-2 text-gray-700">
                  <User className="w-4 h-4" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  {...register('username', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email'
                    }
                  })}
                  className="form-input"
                  placeholder="admin@uddaanagencies.com"
                />
                {errors.username && (
                  <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="form-label flex items-center space-x-2 text-gray-700">
                  <Lock className="w-4 h-4" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: 'Password is required' })}
                    className="form-input pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    <span>Access Admin Panel</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* MFA Form */
            <form onSubmit={submitMfa} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h2>
                <p className="text-gray-600">Enter your 6-digit authentication code</p>
              </div>

              <div>
                <input 
                  type="text" 
                  value={mfaCode} 
                  onChange={(e) => setMfaCode(e.target.value)} 
                  className="form-input text-center text-2xl tracking-widest" 
                  placeholder="Enter 6-digit code" 
                  maxLength={6}
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setPendingMfa(false)} 
                  className="flex-1 btn-secondary"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading || mfaCode.length !== 6}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="spinner mx-auto"></div>
                  ) : (
                    'Verify & Login'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Demo credentials removed */}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;