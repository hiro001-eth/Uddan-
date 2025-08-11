import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { User, Lock, Eye, EyeOff, Shield, Key } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityCode, setSecurityCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
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
      } catch {}
    })();
  }, []);

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    if (securityCode === 'uddaan-secure-2024') {
      setIsAuthenticated(true);
      setShowSecurityModal(false);
      toast.success('Security verification successful');
    } else {
      toast.error('Invalid security code');
      setSecurityCode('');
    }
  };

  const [pendingMfa, setPendingMfa] = useState(false);
  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      setShowSecurityModal(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', [csrf.headerName]: csrf.csrfToken },
        body: JSON.stringify({ email: data.username, password: data.password })
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const payload = await res.json();
      if (payload?.mfaRequired) {
        setPendingMfa(true);
        toast('Enter your 2FA code to continue');
      } else {
        localStorage.setItem('adminAuthAt', String(Date.now()));
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
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
        headers: { 'Content-Type': 'application/json', [csrf.headerName]: csrf.csrfToken },
        body: JSON.stringify({ code: mfaCode })
      });
      if (!res.ok) throw new Error('Invalid 2FA code');
      localStorage.setItem('adminAuthAt', String(Date.now()));
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.message || '2FA failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <img src={'/app_logo-removebg-preview.png'} alt="Udaan Agencies" className="w-16 h-16 rounded-2xl mx-auto mb-4" />
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-blue-100">Secure administrative panel</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username */}
            <div>
              <label className="form-label-premium flex items-center space-x-2 text-white">
                <User className="w-4 h-4" />
                <span>Username</span>
              </label>
              <input
                type="text"
                {...register('username', { required: 'Username is required' })}
                className="form-input-premium bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-300 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="form-label-premium flex items-center space-x-2 text-white">
                <Lock className="w-4 h-4" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className="form-input-premium pr-12 bg-white text-gray-900 placeholder-gray-500"
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
                <p className="text-red-300 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-premium w-full flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Key className="w-5 h-5" />
                  <span>Access Admin Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-white/10 rounded-xl border border-white/20 text-blue-100">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield className="w-4 h-4 text-blue-200" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Secure Access</h4>
                <p className="text-sm">
                  This is a protected administrative area. Unauthorized access is prohibited.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="modal-premium">
          <div className="modal-content-premium">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Security Verification</h2>
              <p className="text-gray-600">
                Enter the security code to access the administrative panel
              </p>
            </div>

            <form onSubmit={handleSecuritySubmit} className="space-y-4">
              <div>
                <label className="form-label-premium flex items-center space-x-2">
                  <Key className="w-4 h-4" />
                  <span>Security Code</span>
                </label>
                <input
                  type="password"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  className="form-input-premium"
                  placeholder="Enter security code"
                  autoFocus
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 btn-premium"
                >
                  Verify Access
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSecurityModal(false);
                    setSecurityCode('');
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>

            <div className="mt-6 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-700 text-center">
                <strong>Note:</strong> This is a demo. Use security code: <code className="bg-red-100 px-2 py-1 rounded">uddaan-secure-2024</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MFA Modal */}
      {pendingMfa && (
        <div className="modal-premium">
          <div className="modal-content-premium">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Two-Factor Authentication</h2>
              <p className="text-gray-600">Enter your 6-digit code from the authenticator app</p>
            </div>
            <form onSubmit={submitMfa} className="space-y-4">
              <input type="text" value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} className="form-input-premium" placeholder="123456" maxLength={6} />
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setPendingMfa(false)} className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Verify</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin; 