import { Link } from 'wasp/client/router';
import ExerciseForm from '../../../../user/components/ExerciseForm';
import { useAuth } from 'wasp/client/auth';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shadcn/components/ui/card';
import { Button } from '../../../../shadcn/components/ui/button';
import { Badge } from '../../../../shadcn/components/ui/badge';
import { Separator } from '../../../../shadcn/components/ui/separator';

const HeroSection: React.FC = () => {
  const { data: user, isLoading } = useAuth();
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    if (user && !isLoading) {
      setDemoMode(false);
    } else {
      setDemoMode(true);
    }
  }, [user, isLoading]);

  return (
    <div className='relative pt-14 w-full min-h-[85vh] flex items-center'>
      {/* Enhanced background with multiple gradients */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute inset-0 bg-gradient-to-tr from-primary-50 via-transparent to-secondary-50/30 opacity-70' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-100/20 via-transparent to-secondary-100/20' />
      </div>

      <div className='w-full py-24 sm:py-32'>
        <Card className='mx-auto max-w-4xl border-none bg-transparent shadow-none'>
          <CardContent className='text-center space-y-8'>
            {/* Main Title */}
            <CardHeader className='p-0 space-y-4'>
              <CardTitle className='text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight'>
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-800 to-secondary-700'>
                  Triathlon But For Brain
                </span>
              </CardTitle>
              <CardDescription className='mx-auto py-4 text-md sm:text-lg text-muted-foreground'>
                <span className='font-medium text-tertiary-600'>📊 Diagram to visualize</span>
                <span className='mx-2'>→</span>
                <span className='font-medium text-primary-600'>⌨️ Type to encode</span>
                <span className='mx-2'>→</span>
                <span className='font-medium text-secondary-600'>🎧 Listen to reinforce</span>
                <span className='mx-2'>→</span>
                <span className='font-medium text-danger'>✍️ Write to recall</span>
              </CardDescription>
            </CardHeader>

            {/* Exercise Form */}
            <div className='pointer-events-auto'>
              <ExerciseForm topic_id={null} demo={demoMode} />
            </div>

            {/* CTA Buttons */}
            {!user && !isLoading && (
              <div className='flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pointer-events-auto'>
                <Button
                  asChild
                  size='lg'
                  className='rounded-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-primary-500/25'
                >
                  <Link to='/signup'>Sign up for more free credits</Link>
                </Button>

                <Button
                  asChild
                  variant='secondary'
                  size='lg'
                  className='rounded-full bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white shadow-lg hover:shadow-secondary-500/25'
                >
                  <Link to='/demo' className='group'>
                    Try demo
                    <span aria-hidden='true' className='ml-2 transition-transform group-hover:translate-x-1'>
                      →
                    </span>
                  </Link>
                </Button>
              </div>
            )}

            <Separator className='my-8' />

            <div className='flex flex-col items-center justify-center gap-4'>
              <Badge variant='secondary' className='px-4 py-1'>
                🚀 Education 2.0
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HeroSection;
