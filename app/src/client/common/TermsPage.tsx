import React from 'react';
import { ADMIN_EMAIL } from '../../shared/constants';
import { Card, CardContent, CardHeader, CardTitle } from '../shadcn/components/ui/card';
import { ScrollArea } from '../shadcn/components/ui/scroll-area';
import { Separator } from '../shadcn/components/ui/separator';
import { Badge } from '../shadcn/components/ui/badge';
import { Button } from '../shadcn/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../shadcn/components/ui/accordion';
import { FaBook, FaShieldAlt, FaUserLock, FaBalanceScale, FaExclamationTriangle } from 'react-icons/fa';
import { MdGavel, MdEmail } from 'react-icons/md';

const TermsPage: React.FC = () => {
  return (
    <ScrollArea className="h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-primary-50 to-secondary-50 mb-8">
          <CardHeader className="space-y-4">
            <Badge variant="secondary" className="w-fit">Last Updated: 2024</Badge>
            <CardTitle className="text-4xl font-satoshi font-bold text-primary-900">
              Terms of Service
            </CardTitle>
            <p className="text-lg text-primary-700 font-montserrat">
              Please read these terms carefully before using our service
            </p>
          </CardHeader>
        </Card>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border rounded-lg shadow-sm bg-white">
            <AccordionTrigger className="px-6 py-4 hover:bg-primary-50/50">
              <div className="flex items-center space-x-3">
                <FaBook className="w-5 h-5 text-primary-600" />
                <span className="text-xl font-satoshi text-primary-900">1. Acceptance of Terms</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 text-primary-700">
              By accessing or using our service, you agree to comply with and be bound by these Terms of Service. If you
              do not agree to these terms, you must discontinue using our service immediately.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border rounded-lg shadow-sm bg-white">
            <AccordionTrigger className="px-6 py-4 hover:bg-primary-50/50">
              <div className="flex items-center space-x-3">
                <FaShieldAlt className="w-5 h-5 text-primary-600" />
                <span className="text-xl font-satoshi text-primary-900">2. Modification of Services</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 text-primary-700">
              We reserve the right to modify or discontinue any part of the service at any time, with or without notice.
              This includes changes to features, content, or availability of the platform.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border rounded-lg shadow-sm bg-white">
            <AccordionTrigger className="px-6 py-4 hover:bg-primary-50/50">
              <div className="flex items-center space-x-3">
                <FaUserLock className="w-5 h-5 text-primary-600" />
                <span className="text-xl font-satoshi text-primary-900">3. User Responsibilities</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 text-primary-700">
              You are responsible for the content you upload and interact with on our platform. This includes ensuring
              that you have the necessary rights to any content you upload and that you use the service lawfully.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border rounded-lg shadow-sm bg-white">
            <AccordionTrigger className="px-6 py-4 hover:bg-primary-50/50">
              <div className="flex items-center space-x-3">
                <FaBalanceScale className="w-5 h-5 text-primary-600" />
                <span className="text-xl font-satoshi text-primary-900">4. Intellectual Property</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 text-primary-700">
              All content and services provided on this platform, including but not limited to text, graphics, logos, and
              software, are the property of Multinex.app or our licensors and are protected by copyright and intellectual
              property laws. You may not use, reproduce, or distribute any content from our platform without prior written
              permission.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border rounded-lg shadow-sm bg-white">
            <AccordionTrigger className="px-6 py-4 hover:bg-primary-50/50">
              <div className="flex items-center space-x-3">
                <FaBalanceScale className="w-5 h-5 text-primary-600" />
                <span className="text-xl font-satoshi text-primary-900">5. Third-Party Services</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 text-primary-700">
              Our service integrates third-party services such as OpenAI for content processing and Stripe for payment
              processing. By using our service, you agree to the terms and policies of these third-party providers. We are
              not liable for any issues arising from their use.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="border rounded-lg shadow-sm bg-white">
            <AccordionTrigger className="px-6 py-4 hover:bg-primary-50/50">
              <div className="flex items-center space-x-3">
                <FaBalanceScale className="w-5 h-5 text-primary-600" />
                <span className="text-xl font-satoshi text-primary-900">6. Limitation of Liability</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 text-primary-700">
              To the fullest extent permitted by law, Multinex shall not be liable for any direct, indirect, incidental,
              consequential, or punitive damages arising from your use of the service, or for any actions taken based on
              the content provided within the platform. You agree to use the service at your own risk.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7" className="border rounded-lg shadow-sm bg-white">
            <AccordionTrigger className="px-6 py-4 hover:bg-primary-50/50">
              <div className="flex items-center space-x-3">
                <FaBalanceScale className="w-5 h-5 text-primary-600" />
                <span className="text-xl font-satoshi text-primary-900">7. Termination</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 text-primary-700">
              We reserve the right to terminate or suspend your access to our services, with or without notice, for any
              reason, including violation of these terms or any behavior that we consider harmful to the platform or other
              users.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8" className="border rounded-lg shadow-sm bg-white">
            <AccordionTrigger className="px-6 py-4 hover:bg-primary-50/50">
              <div className="flex items-center space-x-3">
                <FaBalanceScale className="w-5 h-5 text-primary-600" />
                <span className="text-xl font-satoshi text-primary-900">8. Governing Law</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 text-primary-700">
              These Terms of Service and any disputes related to your use of the platform shall be governed by and
              construed in accordance with the laws of Hong Kong. You agree to submit to the jurisdiction of the courts
              located within Hong Kong for any legal proceedings.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9" className="border rounded-lg shadow-sm bg-white">
            <AccordionTrigger className="px-6 py-4 hover:bg-primary-50/50">
              <div className="flex items-center space-x-3">
                <MdEmail className="w-5 h-5 text-primary-600" />
                <span className="text-xl font-satoshi text-primary-900">9. Contact Information</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
              <div className="space-y-4">
                <p className="text-primary-700">
                  If you have any questions regarding these Terms of Service, please contact us:
                </p>
                <Button
                  variant="outline"
                  className="bg-white hover:bg-primary-50"
                  onClick={() => window.location.href = `mailto:${ADMIN_EMAIL}`}
                >
                  Contact Support
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Footer Card */}
        <Card className="mt-8 border-none shadow-lg bg-gradient-to-br from-secondary-50 to-primary-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2 text-primary-700">
              <FaExclamationTriangle className="w-5 h-5" />
              <p className="text-sm">
                These terms are subject to change. Last updated: January 2024
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default TermsPage;
