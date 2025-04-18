import Depiction from './Depiction';
import { CardHeader, CardTitle } from '../../shadcn/components/ui/card';
import { Separator } from '../../shadcn/components/ui/separator';
import { Badge } from '../../shadcn/components/ui/badge';

const WhyMultinex: React.FC = () => {
  return (
    <div className='relative pt-14 w-full min-h-screen'>
      <CardHeader className="space-y-4 pt-14">
        <div className="flex flex-col items-center justify-center gap-4">
          <CardTitle className="text-center font-montserrat text-4xl md:text-5xl lg:text-title-xl font-bold">
            <span className="bg-gradient-to-r from-primary-900 via-primary-700 to-primary-900 bg-clip-text text-transparent">
              The Science Behind Multinex
            </span>
          </CardTitle>
          <Badge 
            variant="secondary" 
            className="bg-primary-50 text-primary-700 hover:bg-primary-100"
          >
            Brain Reactions
          </Badge>
          <Separator className="w-1/4 bg-primary-200/50" />
        </div>
      </CardHeader>
      <Depiction />
    </div>
  );
};

export default WhyMultinex;