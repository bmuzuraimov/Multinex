import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../../shadcn/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shadcn/components/ui/card';
import { FAQS } from '../../../../../shared/constants';

const FaqSection: React.FC = () => {
  return (
    <section className='relative bg-gradient-to-b from-white to-gray-50/50 py-24 px-6'>
      <div className='mx-auto max-w-4xl'>
        {/* Section Header */}
        <div className='text-center mb-12'>
          <h2 className='font-montserrat text-title-xl font-bold bg-gradient-to-r from-primary-900 via-primary-700 to-primary-900 bg-clip-text text-transparent'>
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Cards */}
        <div className='grid gap-6'>
          <Card className='border-none shadow-lg shadow-primary-100/10'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-xl font-satoshi text-primary-900'>
                General Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type='single' collapsible className='w-full'>
                {FAQS.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className='border-b border-primary-100/50 last:border-0'
                  >
                    <AccordionTrigger className='text-left font-manrope text-lg text-gray-800 hover:text-primary-700 hover:no-underline py-4'>
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className='text-gray-600 font-satoshi leading-relaxed pb-4'>
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Support Card */}
          <Card className='border-2 border-primary-100/50 bg-primary-50/30 shadow-lg shadow-primary-100/10'>
            <CardContent className='pt-6'>
              <div className='flex flex-col md:flex-row items-center justify-between gap-4 p-4'>
                <div className='text-center md:text-left'>
                  <h3 className='text-lg font-satoshi font-bold text-primary-900 mb-2'>
                    Still have questions?
                  </h3>
                  <p className='text-gray-600 font-manrope'>
                    Can't find the answer you're looking for? Please chat with our friendly team.
                  </p>
                </div>
                <a
                  href='mailto:support@multinex.io'
                  className='inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary-600 text-white font-satoshi font-medium hover:bg-primary-700 transition-colors duration-200'
                >
                  Contact Support
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
