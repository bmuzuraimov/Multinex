import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../shadcn/components/ui/card';
import { ScrollArea } from '../../shadcn/components/ui/scroll-area';
import { Separator } from '../../shadcn/components/ui/separator';
import { Badge } from '../../shadcn/components/ui/badge';
import { Button } from '../../shadcn/components/ui/button';
import { FaShieldAlt, FaDatabase, FaUserShield } from 'react-icons/fa';
import { MdSecurity, MdContactSupport } from 'react-icons/md';
import { SiOpenai } from 'react-icons/si';
import DefaultLayout from '../layouts/DefaultLayout';
const PrivacyPage: React.FC = () => {
  return (
    <ScrollArea className="h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-primary-50 to-secondary-50 mb-8">
          <CardHeader className="space-y-4">
            <Badge variant="secondary" className="w-fit">Last Updated: 2024</Badge>
            <CardTitle className="text-4xl font-satoshi font-bold text-primary-900">
              Privacy Policy
            </CardTitle>
            <p className="text-lg text-primary-700 font-montserrat">
              We value your privacy and are committed to protecting your personal information
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Data Collection */}
          <Card className="border border-primary-100 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-primary-100">
                  <FaDatabase className="w-5 h-5 text-primary-600" />
                </div>
                <CardTitle className="text-xl font-satoshi text-primary-800">
                  Data Collection
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-primary-700">
              <p>
                We only collect your Google account's email address and username during authentication. 
                We avoid invasive tracking technologies and prioritize your privacy.
              </p>
            </CardContent>
          </Card>

          {/* Data Processing */}
          <Card className="border border-secondary-100 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-secondary-100">
                  <SiOpenai className="w-5 h-5 text-secondary-600" />
                </div>
                <CardTitle className="text-xl font-satoshi text-primary-800">
                  Data Processing
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-primary-700">
              <p>
                PDF content is processed locally and sent to OpenAI's API for summaries and quizzes. 
                We don't store original content on our servers.
              </p>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card className="border border-primary-100 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-tertiary-100">
                  <FaShieldAlt className="w-5 h-5 text-tertiary-600" />
                </div>
                <CardTitle className="text-xl font-satoshi text-primary-800">
                  Third-Party Services
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-primary-700">
              <div>
                <strong className="text-primary-900">Plausible Analytics:</strong>
                <p>Anonymous usage tracking without personal data collection.</p>
              </div>
              <Separator className="my-2" />
              <div>
                <strong className="text-primary-900">Stripe:</strong>
                <p>Secure payment processing with no stored payment details.</p>
              </div>
            </CardContent>
          </Card>

          {/* Security Measures */}
          <Card className="border border-secondary-100 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-secondary-100">
                  <MdSecurity className="w-5 h-5 text-secondary-600" />
                </div>
                <CardTitle className="text-xl font-satoshi text-primary-800">
                  Security Measures
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-primary-700">
              <p>
                We implement SSL encryption and follow industry-standard security practices 
                to protect your information.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User Rights Card */}
        <Card className="mt-6 border-none shadow-lg bg-gradient-to-br from-secondary-50 to-primary-50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary-100">
                <FaUserShield className="w-5 h-5 text-primary-600" />
              </div>
              <CardTitle className="text-xl font-satoshi text-primary-800">
                Your Rights
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-primary-700">
            <p>
              You have the right to request the deletion of your account and associated data. 
              Contact our support team for assistance.
            </p>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="mt-6 border-none shadow-lg bg-gradient-to-br from-primary-50 to-secondary-50">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-primary-100">
                  <MdContactSupport className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-satoshi text-primary-900">
                Questions about our privacy policy?
              </h3>
              <Button
                variant="outline"
                className="bg-white hover:bg-primary-50"
                onClick={() => window.location.href = 'mailto:support@multinex.app'}
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default DefaultLayout(PrivacyPage);
