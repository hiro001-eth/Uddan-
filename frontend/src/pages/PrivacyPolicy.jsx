import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-6 gradient-text">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: 2024-01-01</p>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
              <p>We collect personal information such as name, email, phone number, and application details when you submit forms or interact with our services.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">2. How We Use Information</h2>
              <p>We use your information to process applications, provide consultation, improve our services, and communicate with you.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">3. Data Security</h2>
              <p>We implement security measures to protect your data against unauthorized access, alteration, or disclosure.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">4. Cookies</h2>
              <p>We use cookies to enhance user experience, analyze traffic, and personalize content. You can control cookies via your browser settings.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-2">5. Your Rights</h2>
              <p>You may request access, correction, or deletion of your personal data by contacting us at info@uddaanconsultancy.com.</p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy; 