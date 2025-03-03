import type { CustomizationOptions } from 'wasp/client/auth'

export const authAppearance: CustomizationOptions['appearance'] = {
  colors: {
    brand: '#05c49b', // Primary brand color
    brandAccent: '#008069', // Darker shade for hover/active states
    submitButtonText: 'white',
    inputBackground: 'white',
    inputBorder: '#cefdea', // Light border
    inputText: '#015346', // Dark text for readability
    inputLabel: '#015346',
  },
  className: {
    button: 'font-satoshi bg-primary-500 hover:bg-primary-600 active:bg-primary-700 transition-colors duration-200',
    input: 'font-montserrat border-2 border-primary-100 focus:border-primary-300 focus:ring-primary-200 rounded-xl transition-all duration-200',
    label: 'font-satoshi text-primary-900 mb-2 block text-sm',
    anchor: 'font-satoshi text-primary-500 hover:text-primary-600 transition-colors duration-200',
    container: 'p-8 rounded-2xl bg-white shadow-lg max-w-md w-full mx-auto',
  },
  variables: {
    borderRadius: '1rem',
    buttonFontWeight: '500',
    fontFamily: '"Satoshi", sans-serif',
    inputPadding: '0.75rem 1rem',
    spacingUnit: '0.5rem',
  },
}