import React, { useEffect } from 'react';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-6 gradient-text">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: 2024-01-01</p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
              <p>By using our website and services, you agree to these terms and all applicable laws and regulations.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">2. Services</h2>
              <p>We provide consultation, job listings, and application support for overseas opportunities.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">3. User Responsibilities</h2>
              <p>You agree not to misuse the platform and to provide accurate information during applications.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">4. Limitation of Liability</h2>
              <p>We are not liable for indirect or incidental damages arising from the use of our services.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">5. Changes</h2>
              <p>We may update these terms from time to time. Continued use signifies acceptance of the updated terms.</p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService; 