import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-white font-montserrat">
      <h1 className="text-4xl font-manrope font-bold text-primary-900 mb-8">Privacy Policy</h1>

      <div className="space-y-6 text-lg text-primary-800">
        <section>
          <h2 className="text-2xl font-manrope font-semibold text-primary-800">1. Data Collection</h2>
          <p className="text-primary-700">
            We respect your privacy and are committed to protecting your personal data. 
            The only data we collect during authentication is your Google account's 
            email address and username. We do not collect any precise personal data 
            such as browsing behavior or interactions, and we avoid using invasive 
            tracking technologies like Google Analytics. 
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-manrope font-semibold text-primary-800">2. Data Processing</h2>
          <p className="text-primary-700">
            All PDF content uploaded by users is processed locally in your browser and 
            sent to OpenAI's API to generate summaries and quizzes. We do not store the 
            original content or any personal information derived from it on our servers.
            The data is only processed in real time to deliver the requested output. 
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-manrope font-semibold text-primary-800">3. Third-Party Services</h2>
          <p className="text-primary-700">
            We utilize a few trusted third-party services to ensure the best user experience:
          </p>
          <ul className="list-disc pl-5 text-primary-700">
            <li>
              <strong className="text-primary-900">Plausible Analytics:</strong> This service helps us understand overall 
              user behavior on the site without collecting personal data. It anonymizes 
              user interactions, ensuring your privacy.
            </li>
            <li>
              <strong className="text-primary-900">Stripe:</strong> For secure payment processing, we use Stripe, a 
              credible and trusted third-party service. We do not store your payment 
              details, and Stripe handles all payment-related information in compliance 
              with its privacy standards.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-manrope font-semibold text-primary-800">4. Data Retention</h2>
          <p className="text-primary-700">
            We do not permanently store any data beyond what is necessary for the site's 
            functionality. All data processed (such as summaries and quizzes) is retained 
            only as long as the site is live and in use. After that, it is deleted.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-manrope font-semibold text-primary-800">5. User Rights</h2>
          <p className="text-primary-700">
            As a user, you have the right to request the deletion of your account and 
            any associated data. If you wish to do so, please contact us via support email, 
            and we will handle your request promptly.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-manrope font-semibold text-primary-800">6. Security Measures</h2>
          <p className="text-primary-700">
            We take security seriously. Our website uses SSL to encrypt communications 
            and follows industry-standard security practices to protect your information. 
            While we strive to ensure the highest level of security, please be aware 
            that no system can guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-manrope font-semibold text-primary-800">7. Contact Us</h2>
          <p className="text-primary-700">
            If you have any questions or concerns about this privacy policy, feel free to 
            reach out to us via our support email.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
