import React, { useState } from 'react';
import { createFeedback } from 'wasp/client/operations';
import { FiCheckCircle, FiSend } from 'react-icons/fi';
import { cn } from '../../shared/utils';

const FeedbackPage: React.FC = () => {
    const [form_data, setFormData] = useState({
        message: '',
        rating: 0,
        usability: '',
        features: '',
        improvements: '',
        would_recommend: false,
        experience_level: '',
        category: 'GENERAL',
        browser_info: ''
    });
    const [is_submitted, setIsSubmitted] = useState(false);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form_data.message.trim()) {
            const browser_info = `${navigator.userAgent}`;
            await createFeedback({ ...form_data, browser_info });
            setIsSubmitted(true);
        }
    };

    const renderRatingOption = (value: number) => {
        return (
            <div 
                key={value} 
                className={cn(
                    'flex flex-col items-center gap-2 cursor-pointer transition-all duration-300',
                    form_data.rating === value 
                        ? 'transform scale-110' 
                        : 'hover:scale-105'
                )}
                onClick={() => setFormData(prev => ({ ...prev, rating: value }))}
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
                <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center',
                    form_data.rating === value
                        ? 'bg-secondary-500 text-white shadow-lg'
                        : 'bg-white text-primary-600 shadow-md',
                    'border-2 border-secondary-200 transition-all duration-300 font-manrope font-bold'
                )}>
                    {value}
                </div>
                <label
                    htmlFor={`rating-${value}`}
                    className='text-sm font-montserrat text-primary-600'
                >
                    {value === 1 ? 'Poor' : value === 5 ? 'Excellent' : ''}
                </label>
            </div>
        );
    };

    const renderSuccessMessage = () => (
        <div className='mt-12 flex flex-col items-center p-8 bg-success/10 backdrop-blur-sm rounded-2xl'>
            <FiCheckCircle className='text-success w-16 h-16' />
            <h3 className='mt-6 text-title-md font-manrope font-bold text-success'>Thank You!</h3>
            <p className='mt-4 text-center text-success/80 font-montserrat'>
                We'll review your feedback right away and implement necessary changes as soon as possible.
            </p>
        </div>
    );

    const renderFeedbackForm = () => (
        <form onSubmit={handleFormSubmit} className='mt-12 space-y-8'>
            <div>
                <label htmlFor='category' className='block text-sm font-montserrat font-medium text-primary-700'>Priority Level</label>
                <select
                    id='category'
                    name='category'
                    value={form_data.category}
                    onChange={handleFormChange}
                    className='mt-2 w-full px-4 py-3 bg-white border border-primary-200 rounded-xl focus:ring-2 focus:ring-secondary-300 focus:border-secondary-300 font-satoshi text-primary-800'
                >
                    <option value='URGENT'>Urgent - Needs Immediate Attention</option>
                    <option value='BUG'>Critical Bug Report</option>
                    <option value='FEATURE'>Feature Request</option>
                    <option value='GENERAL'>General Feedback</option>
                </select>
            </div>

            <div>
                <label className='block text-sm font-montserrat font-medium text-primary-700 mb-4'>Rate Your Experience</label>
                <div className='flex gap-4 items-center justify-center bg-primary-50 p-6 rounded-xl'>
                    {[1, 2, 3, 4, 5].map(renderRatingOption)}
                </div>
            </div>

            <div>
                <label htmlFor='message' className='block text-sm font-montserrat font-medium text-primary-700'>Your Feedback</label>
                <textarea
                    id='message'
                    name='message'
                    value={form_data.message}
                    onChange={handleFormChange}
                    placeholder='Share your thoughts with us...'
                    rows={4}
                    className='mt-2 w-full px-4 py-3 bg-white border border-primary-200 rounded-xl focus:ring-2 focus:ring-secondary-300 focus:border-secondary-300 font-satoshi text-primary-800 resize-none'
                    required
                />
            </div>

            <div>
                <label htmlFor='usability' className='block text-sm font-montserrat font-medium text-primary-700'>Usability Feedback</label>
                <textarea
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
                <label htmlFor='experience_level' className='block text-sm font-montserrat font-medium text-primary-700'>Your Field of Study</label>
                <select
                    id='experience_level'
                    name='experience_level'
                    value={form_data.experience_level}
                    onChange={handleFormChange}
                    className='mt-2 w-full px-4 py-3 bg-white border border-primary-200 rounded-xl focus:ring-2 focus:ring-secondary-300 focus:border-secondary-300 font-satoshi text-primary-800'
                >
                    <option value=''>Select your field...</option>
                    <option value='Business'>Business</option>
                    <option value='STEM'>STEM</option>
                    <option value='Arts'>Arts & Humanities</option>
                    <option value='Social'>Social Sciences</option>
                    <option value='Other'>Other</option>
                </select>
            </div>

            <div className='flex items-center bg-primary-50 p-4 rounded-xl'>
                <input
                    type='checkbox'
                    id='would_recommend'
                    name='would_recommend'
                    checked={form_data.would_recommend}
                    onChange={handleCheckboxChange}
                    className='h-5 w-5 text-secondary-500 focus:ring-secondary-300 border-primary-200 rounded'
                />
                <label htmlFor='would_recommend' className='ml-3 text-sm font-montserrat text-primary-700'>
                    Would you recommend our app to others?
                </label>
            </div>

            <button
                type='submit'
                disabled={is_submitted}
                className='w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:from-primary-600 hover:to-secondary-600 focus:ring-2 focus:ring-secondary-300 transition-all duration-300 font-manrope font-medium text-lg'
            >
                <FiSend className='w-5 h-5' />
                {is_submitted ? 'Thank You!' : 'Submit Feedback'}
            </button>
        </form>
    );

    return (
        <div className='min-h-screen bg-white flex items-center justify-center px-4 py-16'>
            <div className='w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-primary-100/20 p-12'>
                <h2 className='text-title-xl font-manrope font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent text-center'>We Value Your Feedback</h2>
                <p className='mt-6 text-lg font-montserrat text-primary-600/70 text-center'>
                    Your insights help us improve. We read and implement feedback quickly, so don't hesitate to share!
                </p>

                {is_submitted ? renderSuccessMessage() : renderFeedbackForm()}
            </div>
        </div>
    );
};

export default FeedbackPage;
