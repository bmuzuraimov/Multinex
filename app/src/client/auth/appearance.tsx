import type { CustomizationOptions } from 'wasp/client/auth'

export const authAppearance: CustomizationOptions['appearance'] = {
  colors: {
    brand: '#008080', // teal color
    brandAccent: '#262626',
    submitButtonText: 'white',
  },
  className: {
    button: 'dark:bg-teal-600 dark:hover:bg-teal-700',
    input: 'dark:bg-gray-800 dark:text-white dark:border-gray-700',
    label: 'dark:text-gray-200',
    anchor: 'dark:text-teal-400 dark:hover:text-teal-300',
  },
  variables: {
    colorBackground: 'var(--background-color)',
    colorInputBackground: 'var(--input-background)',
    colorInputText: 'var(--input-text)',
    colorInputBorder: 'var(--input-border)',
  },
}