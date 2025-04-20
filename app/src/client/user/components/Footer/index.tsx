import { Link } from 'wasp/client/router';
import { Separator } from '../../../shadcn/components/ui/separator';
import { Button } from '../../../shadcn/components/ui/button';
import { Card, CardContent } from '../../../shadcn/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../../shadcn/components/ui/hover-card';
import { cn } from '../../../../shared/utils';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Demo', href: '/demo' },
      { name: 'Roadmap', href: '#roadmap' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Licenses', href: '/licenses' },
    ],
    social: [
      { name: 'Twitter', href: 'https://twitter.com/multinex', icon: '𝕏' },
      { name: 'GitHub', href: 'https://github.com/multinex', icon: '⌨' },
      { name: 'Discord', href: 'https://discord.gg/multinex', icon: '💬' },
      { name: 'LinkedIn', href: 'https://linkedin.com/company/multinex', icon: '💼' },
    ],
  };

  return (
    <footer className='relative bg-gradient-to-b from-gray-50/50 to-white border-t border-gray-100'>
      <div className='mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16'>
        <div className='xl:grid xl:grid-cols-3 xl:gap-8'>
          {/* Brand Section */}
          <Card className='bg-transparent border-none shadow-none space-y-8 xl:col-span-1'>
            <div className='space-y-4'>
              <Link
                to='/'
                className='flex items-center space-x-2 text-2xl font-satoshi font-bold text-primary-900'
              >
                <span className='bg-gradient-to-r from-primary-600 to-primary-900 bg-clip-text text-transparent'>
                  Multinex
                </span>
              </Link>
              <p className='text-gray-600 font-manrope max-w-xs'>
                Empowering learning through multi-modal engagement and AI-driven personalization
              </p>
            </div>

            {/* Social Links */}
            <div className='flex space-x-4'>
              {footerLinks.social.map((item) => (
                <HoverCard key={item.name}>
                  <HoverCardTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-10 w-10 rounded-full hover:bg-primary-100 hover:text-primary-900'
                      asChild
                    >
                      <a href={item.href} target='_blank' rel='noopener noreferrer'>
                        <span className='text-xl'>{item.icon}</span>
                      </a>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className='w-auto p-2 bg-white/95 backdrop-blur-sm'>
                    <p className='text-sm font-manrope text-gray-600'>Follow us on {item.name}</p>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </Card>

          {/* Links Grid */}
          <div className='mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0'>
            <div className='grid grid-cols-2 gap-8 md:gap-x-12'>
              <div>
                <h3 className='text-base font-satoshi font-semibold text-primary-900'>Product</h3>
                <ul role='list' className='mt-4 space-y-3'>
                  {footerLinks.product.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href as any}
                        className='text-sm text-gray-600 hover:text-primary-700 transition-colors font-manrope'
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className='text-base font-satoshi font-semibold text-primary-900'>Company</h3>
                <ul role='list' className='mt-4 space-y-3'>
                  {footerLinks.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href as any}
                        className='text-sm text-gray-600 hover:text-primary-700 transition-colors font-manrope'
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h3 className='text-base font-satoshi font-semibold text-primary-900'>Legal</h3>
              <ul role='list' className='mt-4 space-y-3'>
                {footerLinks.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href as any}
                      className='text-sm text-gray-600 hover:text-primary-700 transition-colors font-manrope'
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className='my-8 bg-gray-100' />

        {/* Bottom Section */}
        <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
          <p className='text-sm text-gray-500 font-manrope'>
            © {currentYear} Multinex. All rights reserved.
          </p>
          <div className='flex items-center space-x-2'>
            <Button variant='ghost' size='sm' className='text-gray-500 hover:text-primary-700'>
              <Link to='/privacy'>Privacy</Link>
            </Button>
            <Separator orientation='vertical' className='h-4 bg-gray-200' />
            <Button variant='ghost' size='sm' className='text-gray-500 hover:text-primary-700'>
              <Link to='/terms'>Terms</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
