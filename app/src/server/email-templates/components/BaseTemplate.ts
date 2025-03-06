import { CSSProperties } from 'react';

// Base interface for all email templates
export interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

// Modern color palette
const colors = {
  primary: '#0CC0DF',
  primaryGradient: 'linear-gradient(135deg, #0CC0DF 0%, #04D3BC 100%)',
  secondary: '#1A365D',
  accent: '#04D3BC',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: {
    primary: '#1A202C',
    secondary: '#4A5568',
    muted: '#718096',
    light: '#A0AEC0'
  },
  border: '#E2E8F0',
  success: '#48BB78',
  warning: '#ECC94B',
  error: '#F56565'
};

// Typography scale
const typography = {
  h1: {
    fontSize: '28px',
    lineHeight: '34px',
    fontWeight: '700'
  },
  h2: {
    fontSize: '24px',
    lineHeight: '30px',
    fontWeight: '600'
  },
  h3: {
    fontSize: '20px',
    lineHeight: '28px',
    fontWeight: '600'
  },
  body: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 'normal'
  },
  small: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 'normal'
  }
};

// Spacing scale
const spacing = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px'
};

// Common styles that can be reused across templates
export const styles = {
  container: {
    margin: '0',
    padding: '0',
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    msTextSizeAdjust: '100%',
    webkitTextSizeAdjust: '100%'
  } as CSSProperties,
  mainTable: {
    backgroundColor: colors.background,
    width: '100%',
    borderSpacing: '0',
    borderCollapse: 'separate'
  } as CSSProperties,
  contentTable: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: '12px',
    width: '600px',
    maxWidth: '100%',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  } as CSSProperties,
  logo: {
    width: '40px',
    height: 'auto',
    transform: 'scaleY(-1)',
    msInterpolationMode: 'bicubic',
    border: '0',
    outline: 'none',
    textDecoration: 'none',
    display: 'block'
  } as CSSProperties,
  heading: {
    ...typography.h2,
    color: colors.text.primary,
    margin: `0 0 ${spacing.md} 0`,
    padding: '0'
  } as CSSProperties,
  subheading: {
    ...typography.h3,
    color: colors.text.secondary,
    margin: `0 0 ${spacing.sm} 0`,
    padding: '0'
  } as CSSProperties,
  text: {
    ...typography.body,
    color: colors.text.secondary,
    margin: `0 0 ${spacing.md} 0`,
    padding: '0'
  } as CSSProperties,
  button: {
    display: 'inline-block',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: typography.body.fontSize,
    color: colors.surface,
    padding: `${spacing.sm} ${spacing.xl}`,
    borderRadius: '8px',
    background: colors.primaryGradient,
    textAlign: 'center',
    msoPaddingAlt: '0',
    msoBackgroundAlt: colors.primary
  } as CSSProperties,
  secondaryButton: {
    display: 'inline-block',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: typography.body.fontSize,
    color: colors.primary,
    padding: `${spacing.sm} ${spacing.xl}`,
    borderRadius: '8px',
    border: `2px solid ${colors.primary}`,
    background: colors.surface,
    textAlign: 'center'
  } as CSSProperties,
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: '8px',
    border: `1px solid ${colors.border}`,
    marginBottom: spacing.lg
  } as CSSProperties,
  footer: {
    ...typography.small,
    color: colors.text.muted,
    textAlign: 'center',
    padding: `${spacing.lg} ${spacing.md}`
  } as CSSProperties,
  divider: {
    borderTop: `1px solid ${colors.border}`,
    margin: `${spacing.lg} 0`
  } as CSSProperties
};

// Base layout component that will be used by all email templates
export const baseLayout = (content: string, title: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
  </head>
  <body style="${styleToString(styles.container)}">
    <!--[if mso]>
    <table role="presentation" width="100%">
    <tr>
    <td>
    <![endif]-->
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="${styleToString(styles.mainTable)}">
      <tr>
        <td align="center" style="padding: ${spacing.xl} ${spacing.md};">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="${styleToString(styles.contentTable)}">
            <tr>
              <td>
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                  <tr>
                    <td align="left" style="padding-bottom: ${spacing.lg};">
                      <img 
                        src="https://multinex.app/logo.png" 
                        alt="Multinex" 
                        style="${styleToString(styles.logo)}" 
                        width="40"
                      />
                    </td>
                  </tr>
                </table>
                ${content}
              </td>
            </tr>
          </table>
          
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="600" style="max-width: 100%;">
            <tr>
              <td style="${styleToString(styles.footer)}">
                <p style="margin: 0;">Type, write, listen. In one AI-powered workspace</p>
                <p style="margin: ${spacing.xs} 0 0 0; color: ${colors.text.light};">
                  © ${new Date().getFullYear()} Multinex. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <!--[if mso]>
    </td>
    </tr>
    </table>
    <![endif]-->
  </body>
</html>
`;

// Helper function to convert style object to string
export const styleToString = (style: CSSProperties): string => {
  return Object.entries(style)
    .map(([key, value]) => `${kebabCase(key)}: ${value}`)
    .join('; ');
};

// Helper function to convert camelCase to kebab-case
const kebabCase = (str: string): string => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

// Common components that can be reused across templates
export const components = {
  button: (text: string, link: string, variant: 'primary' | 'secondary' = 'primary') => text && link ? `
    <tr>
      <td align="center" style="padding: ${spacing.md} 0;">
        <!--[if mso]>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${link}" style="height:40px;v-text-anchor:middle;width:200px;" arcsize="10%" stroke="f" fillcolor="${variant === 'primary' ? colors.primary : colors.surface}">
          <w:anchorlock/>
          <center style="color:${variant === 'primary' ? colors.surface : colors.primary};font-family:sans-serif;font-size:16px;font-weight:bold;">${text}</center>
        </v:roundrect>
        <![endif]-->
        <a href="${link}" style="${styleToString(variant === 'primary' ? styles.button : styles.secondaryButton)}">${text}</a>
      </td>
    </tr>
  ` : '',
  heading: (text: string) => text ? `
    <tr>
      <td style="${styleToString(styles.heading)}">${text}</td>
    </tr>
  ` : '',
  subheading: (text: string) => text ? `
    <tr>
      <td style="${styleToString(styles.subheading)}">${text}</td>
    </tr>
  ` : '',
  paragraph: (text: string) => text ? `
    <tr>
      <td style="${styleToString(styles.text)}">${text}</td>
    </tr>
  ` : '',
  bulletList: (items: string[]) => items && items.length > 0 ? `
    <tr>
      <td style="${styleToString({ ...styles.text, paddingLeft: spacing.md })}">
        ${items.map(item => `<div style="margin-bottom: ${spacing.xs};">• ${item}</div>`).join('')}
      </td>
    </tr>
  ` : '',
  card: (content: string) => content ? `
    <tr>
      <td style="${styleToString(styles.card)}">
        ${content}
      </td>
    </tr>
  ` : '',
  divider: () => `
    <tr>
      <td style="${styleToString(styles.divider)}"></td>
    </tr>
  `
};