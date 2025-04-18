import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../shadcn/components/ui/card';
import { Separator } from '../../shadcn/components/ui/separator';
import { FEATURES } from '../../../shared/constants';
import { cn } from '../../../shared/utils';

const FeaturesSection: React.FC = () => {
  return (
    <div id='features' className='relative mx-auto min-h-screen py-24 px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50/20 to-white'>
      <div className='relative mx-auto max-w-2xl text-center mb-16'>
        <h2 className='font-montserrat text-4xl md:text-5xl lg:text-title-xl font-bold bg-gradient-to-r from-primary-900 via-primary-700 to-primary-900 bg-clip-text text-transparent mb-4'>
        Features
        </h2>
      </div>

      <div className='relative mx-auto max-w-7xl'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8'>
          {FEATURES.map((feature) => (
            <Card key={feature.name} className={cn(
              'group relative overflow-hidden transition-all duration-300',
              'border-2 hover:border-primary-500/50',
              'bg-white/50 hover:bg-white',
              'shadow-sm hover:shadow-xl hover:shadow-primary-500/10'
            )}>
              <CardHeader className='pb-4'>
                <div className='flex items-center gap-x-4'>
                  <div className={cn(
                    'flex h-16 w-16 items-center justify-center rounded-xl',
                    'bg-primary-50 group-hover:bg-primary-100',
                    'transition-all duration-300 group-hover:scale-110'
                  )}>
                    <div className='text-3xl text-primary-600 group-hover:text-primary-700'>
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className='font-satoshi text-xl text-primary-900'>
                    {feature.name}
                  </CardTitle>
                </div>
              </CardHeader>
              <Separator className='mx-6 bg-primary-100/50' />
              <CardContent className='pt-6'>
                <CardDescription className='text-base leading-relaxed text-gray-600 font-montserrat'>
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
