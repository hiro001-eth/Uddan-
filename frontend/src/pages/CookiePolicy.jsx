import React, { useEffect } from 'react';

const CookiePolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-6 gradient-text">Cookie Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: 2024-01-01</p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-2">1. What Are Cookies?</h2>
              <p>Cookies are small text files stored on your device to improve your browsing experience.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">2. How We Use Cookies</h2>
              <p>We use cookies for analytics, personalization, and to remember your preferences.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">3. Managing Cookies</h2>
              <p>You can manage cookies via your browser settings. Disabling cookies may impact site functionality.</p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy; 