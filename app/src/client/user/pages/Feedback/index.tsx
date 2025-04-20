import React, { useState } from 'react';
import { useAction, createFeedback } from 'wasp/client/operations';
import { FiCheckCircle, FiSend } from 'react-icons/fi';
import { cn } from '../../../../shared/utils';

// shadcn components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../shadcn/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shadcn/components/ui/select';
import { Textarea } from '../../../shadcn/components/ui/textarea';
import { Button } from '../../../shadcn/components/ui/button';
import { Checkbox } from '../../../shadcn/components/ui/checkbox';
import { Label } from '../../../shadcn/components/ui/label';
import { Separator } from '../../../shadcn/components/ui/separator';
import DefaultLayout from '../../layouts/DefaultLayout';

const Feedback: React.FC = () => {
  const [form_data, setFormData] = useState({
    message: '',
    rating: 0,
    usability: '',
    features: '',
    improvements: '',
    would_recommend: false,
    experience_level: '',
    category: 'GENERAL',
    browser_info: '',
  });
  const [is_submitted, setIsSubmitted] = useState(false);
  const createFeedbackAction = useAction(createFeedback);
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form_data.message.trim()) {
      const browser_info = `${navigator.userAgent}`;
      await createFeedbackAction({ ...form_data, browser_info });
      setIsSubmitted(true);
    }
  };

  const renderRatingOption = (value: number) => {
    return (
      <div
        key={value}
        className={cn(
          'flex flex-col items-center gap-2 cursor-pointer transition-all duration-300',
          form_data.rating === value ? 'transform scale-110' : 'hover:scale-105'
        )}
        onClick={() => setFormData((prev) => ({ ...prev, rating: value }))}
      >
        <input
          type='radio'
          id={`rating-${value}`}
          name='rating'
          value={value}
          checked={form_data.rating === value}
          onChange={handleFormChange}
          className='hidden'
        />
        <div
          className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center',
            form_data.rating === value
              ? 'bg-secondary-500 text-white shadow-lg'
              : 'bg-white text-primary-600 shadow-md',
            'border-2 border-secondary-200 transition-all duration-300 font-manrope font-bold'
          )}
        >
          {value}
        </div>
        <label htmlFor={`rating-${value}`} className='text-sm font-montserrat text-primary-600'>
          {value === 1 ? 'Poor' : value === 5 ? 'Excellent' : ''}
        </label>
      </div>
    );
  };

  const renderSuccessMessage = () => (
    <Card className='mt-12 bg-success/5 border-success/10'>
      <CardContent className='flex flex-col items-center p-8'>
        <FiCheckCircle className='text-success w-16 h-16' />
        <CardTitle className='mt-6 text-title-md font-manrope font-bold text-success'>Thank You!</CardTitle>
        <CardDescription className='mt-4 text-center text-success/80 font-montserrat'>
          We'll review your feedback right away and implement necessary changes as soon as possible.
        </CardDescription>
      </CardContent>
    </Card>
  );

  const renderFeedbackForm = () => (
    <form onSubmit={handleFormSubmit} className='mt-12 space-y-8'>
      <div className='space-y-4'>
        <Label htmlFor='category' className='block text-sm font-montserrat font-medium text-primary-700'>
          Priority Level
        </Label>
        <Select
          value={form_data.category}
          onValueChange={(value) => handleFormChange({ target: { name: 'category', value } } as any)}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select priority level' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='URGENT'>Urgent - Needs Immediate Attention</SelectItem>
            <SelectItem value='BUG'>Critical Bug Report</SelectItem>
            <SelectItem value='FEATURE'>Feature Request</SelectItem>
            <SelectItem value='GENERAL'>General Feedback</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className='block text-sm font-montserrat font-medium text-primary-700 mb-4'>Rate Your Experience</label>
        <div className='flex gap-4 items-center justify-center bg-primary-50 p-6 rounded-xl'>
          {[1, 2, 3, 4, 5].map(renderRatingOption)}
        </div>
      </div>

      <div className='space-y-4'>
        <Label htmlFor='message' className='block text-sm font-montserrat font-medium text-primary-700'>
          Your Feedback
        </Label>
        <Textarea
          id='message'
          name='message'
          value={form_data.message}
          onChange={handleFormChange}
          placeholder='Share your thoughts with us...'
          rows={3}
          className='mt-2 w-full px-4 py-3 bg-white border border-primary-200 rounded-xl focus:ring-2 focus:ring-secondary-300 focus:border-secondary-300 font-satoshi text-primary-800 resize-none'
          required
        />
      </div>

      <div>
        <Label htmlFor='usability' className='block text-sm font-montserrat font-medium text-primary-700'>
          Usability Feedback
        </Label>
        <Textarea
          id='usability'
          name='usability'
          value={form_data.usability}
          onChange={handleFormChange}
          placeholder='How was your experience using our app?'
          rows={3}
          className='mt-2 w-full px-4 py-3 bg-white border border-primary-200 rounded-xl focus:ring-2 focus:ring-secondary-300 focus:border-secondary-300 font-satoshi text-primary-800 resize-none'
        />
      </div>

      <div>
        <Label htmlFor='experience_level' className='block text-sm font-montserrat font-medium text-primary-700'>
          Your Field of Study
        </Label>
        <Select
          value={form_data.experience_level}
          onValueChange={(value) => handleFormChange({ target: { name: 'experience_level', value } } as any)}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select your field...' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='Business'>Business</SelectItem>
            <SelectItem value='STEM'>STEM</SelectItem>
            <SelectItem value='Arts'>Arts & Humanities</SelectItem>
            <SelectItem value='Social'>Social Sciences</SelectItem>
            <SelectItem value='Other'>Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className='border-primary-100'>
        <CardContent className='flex items-center p-4 bg-primary-50/30'>
          <Checkbox
            id='would_recommend'
            checked={form_data.would_recommend}
            onCheckedChange={(checked) => handleCheckboxChange({ target: { name: 'would_recommend', checked } } as any)}
            className='border-primary-500 data-[state=checked]:bg-primary-500 data-[state=checked]:text-primary-50'
          />
          <Label htmlFor='would_recommend' className='ml-3 text-primary-700 text-lg font-montserrat'>
            Would you recommend our app to others?
          </Label>
        </CardContent>
      </Card>

      <Button
        type='submit'
        disabled={is_submitted}
        className='w-full h-14 text-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors'
        variant='default'
      >
        <FiSend className='w-5 h-5 mr-2' />
        {is_submitted ? 'Thank You!' : 'Submit Feedback'}
      </Button>
    </form>
  );

  return (
    <div className='min-h-screen bg-primary-50/30'>
      <div className='mx-auto max-w-4xl px-6 py-16'>
        <Card className='border-primary-100/20 shadow-xl'>
          <CardHeader className='text-center space-y-6 p-8'>
            <CardTitle className='text-4xl md:text-5xl font-manrope font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent'>
              We Value Your Feedback
            </CardTitle>
            <CardDescription className='text-xl font-montserrat text-primary-600/70'>
              We read and implement feedback quickly, so don't hesitate to share!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Separator className='my-6' />
            {is_submitted ? renderSuccessMessage() : renderFeedbackForm()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DefaultLayout(Feedback);
