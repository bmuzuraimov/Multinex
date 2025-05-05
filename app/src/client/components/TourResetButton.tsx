import React from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import useTour from '../hooks/useTour';
import { cn } from '../../shared/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../shadcn/components/ui/tooltip';

interface TourResetButtonProps {
  className?: string;
  showTooltip?: boolean;
  tooltipText?: string;
}

/**
 * A button component that allows users to restart the onboarding tour
 */
const TourResetButton: React.FC<TourResetButtonProps> = ({
  className = '',
  showTooltip = true,
  tooltipText = 'Restart Tour',
}) => {
  const { resetTour } = useTour();

  const handleReset = async (): Promise<void> => {
    await resetTour();
  };

  const buttonElement = (
    <button
      onClick={handleReset}
      className={cn(
        'flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-teal-500',
        className
      )}
      aria-label="Restart tour"
    >
      <FiHelpCircle className="h-4 w-4" />
      {tooltipText}
    </button>
  );

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{buttonElement}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return buttonElement;
};

export default TourResetButton;