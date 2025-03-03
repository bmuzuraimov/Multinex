import React from 'react';
import { ADMIN_EMAIL } from '../../shared/constants';

const TermsPage: React.FC = () => {
  return (
    <div className='max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8'>
      <h1 className='text-4xl font-manrope font-bold text-primary-900 mb-8'>Terms of Service</h1>

      <div className='space-y-6 text-lg font-montserrat text-primary-800'>
        <section>
          <h2 className='text-2xl font-manrope font-semibold text-primary-800'>1. Acceptance of Terms</h2>
          <p className='text-primary-700'>
            By accessing or using our service, you agree to comply with and be bound by these Terms of Service. If you
            do not agree to these terms, you must discontinue using our service immediately.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-manrope font-semibold text-primary-800'>2. Modification of Services</h2>
          <p className='text-primary-700'>
            We reserve the right to modify or discontinue any part of the service at any time, with or without notice.
            This includes changes to features, content, or availability of the platform. We are not liable for any such
            changes and will make an effort to notify users when substantial changes are made.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-manrope font-semibold text-primary-800'>3. User Responsibilities</h2>
          <p className='text-primary-700'>
            You are responsible for the content you upload and interact with on our platform. This includes ensuring
            that you have the necessary rights to any content you upload (e.g., PDFs) and that you use the service in a
            lawful manner. Any misuse of the service, including illegal or prohibited activities, may result in
            termination of your access.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-manrope font-semibold text-primary-800'>4. Intellectual Property</h2>
          <p className='text-primary-700'>
            All content and services provided on this platform, including but not limited to text, graphics, logos, and
            software, are the property of Typit.app or our licensors and are protected by copyright and intellectual
            property laws. You may not use, reproduce, or distribute any content from our platform without prior written
            permission.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-manrope font-semibold text-primary-800'>5. Third-Party Services</h2>
          <p className='text-primary-700'>
            Our service integrates third-party services such as OpenAI for content processing and Stripe for payment
            processing. By using our service, you agree to the terms and policies of these third-party providers. We are
            not liable for any issues arising from their use.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-manrope font-semibold text-primary-800'>6. Limitation of Liability</h2>
          <p className='text-primary-700'>
            To the fullest extent permitted by law, Typit shall not be liable for any direct, indirect, incidental,
            consequential, or punitive damages arising from your use of the service, or for any actions taken based on
            the content provided within the platform. You agree to use the service at your own risk.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-manrope font-semibold text-primary-800'>7. Termination</h2>
          <p className='text-primary-700'>
            We reserve the right to terminate or suspend your access to our services, with or without notice, for any
            reason, including violation of these terms or any behavior that we consider harmful to the platform or other
            users.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-manrope font-semibold text-primary-800'>8. Governing Law</h2>
          <p className='text-primary-700'>
            These Terms of Service and any disputes related to your use of the platform shall be governed by and
            construed in accordance with the laws of Hong Kong. You agree to submit to the jurisdiction of the courts
            located within Hong Kong for any legal proceedings.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-manrope font-semibold text-primary-800'>9. Contact Information</h2>
          <p className='text-primary-700'>
            If you have any questions regarding these Terms of Service, please contact us at
            {ADMIN_EMAIL}.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
