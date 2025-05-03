import { CSSProperties } from 'react';

// Base interface for all email templates
export interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

// Refined color palette with more sophisticated and professional tones
const COLORS = {
  PRIMARY: '#3182CE',
  PRIMARY_DARK: '#2C5282',
  PRIMARY_LIGHT: '#EBF4FF',
  PRIMARY_GRADIENT: 'linear-gradient(135deg, #3182CE 0%, #63B3ED 100%)',
  SECONDARY: '#2D3748',
  ACCENT: '#4299E1',
  BACKGROUND: '#F7FAFC',
  SURFACE: '#FFFFFF',
  TEXT: {
    PRIMARY: '#1A202C',
    SECONDARY: '#4A5568',
    MUTED: '#718096',
    LIGHT: '#A0AEC0'
  },
  BORDER: '#E2E8F0',
  SUCCESS: '#38A169',
  WARNING: '#DD6B20',
  ERROR: '#E53E3E'
};

// Enhanced typography scale with better readability and hierarchy
const TYPOGRAPHY = {
  h1: {
    font_size: '32px',
    line_height: '40px',
    font_weight: '700',
    letter_spacing: '-0.02em'
  },
  h2: {
    font_size: '26px',
    line_height: '32px',
    font_weight: '600',
    letter_spacing: '-0.01em'
  },
  h3: {
    font_size: '22px',
    line_height: '28px',
    font_weight: '600',
    letter_spacing: '-0.01em'
  },
  body: {
    font_size: '16px',
    line_height: '26px',
    font_weight: 'normal'
  },
  small: {
    font_size: '14px',
    line_height: '22px',
    font_weight: 'normal'
  },
  caption: {
    font_size: '12px',
    line_height: '18px',
    font_weight: 'normal',
    letter_spacing: '0.02em'
  }
};

// Refined spacing scale
const SPACING = {
  XXS: '4px',
  XS: '8px',
  SM: '12px',
  MD: '16px',
  LG: '24px',
  XL: '32px',
  XXL: '48px',
  XXXL: '64px'
};

// Enhanced shadow system
const SHADOWS = {
  SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
};

// Common styles that can be reused across templates
export const styles = {
  container: {
    margin: '0',
    padding: '0',
    backgroundColor: COLORS.BACKGROUND,
    width: '100%',
    height: '100%',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    msTextSizeAdjust: '100%',
    webkitTextSizeAdjust: '100%'
  } as CSSProperties,
  main_table: {
    backgroundColor: COLORS.BACKGROUND,
    width: '100%',
    borderSpacing: '0',
    borderCollapse: 'separate'
  } as CSSProperties,
  content_table: {
    backgroundColor: COLORS.SURFACE,
    padding: `${SPACING.XL} ${SPACING.XL}`,
    borderRadius: '16px',
    width: '620px',
    maxWidth: '100%',
    boxShadow: SHADOWS.MD
  } as CSSProperties,
  header: {
    padding: `0 0 ${SPACING.LG} 0`,
    borderBottom: `1px solid ${COLORS.BORDER}`
  } as CSSProperties,
  logo_container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: SPACING.LG
  } as CSSProperties,
  logo: {
    width: '120px',
    height: 'auto',
    msInterpolationMode: 'bicubic',
    border: '0',
    outline: 'none',
    textDecoration: 'none',
    display: 'block'
  } as CSSProperties,
  heading: {
    ...TYPOGRAPHY.h2,
    color: COLORS.TEXT.PRIMARY,
    margin: `${SPACING.LG} 0 ${SPACING.MD} 0`,
    padding: '0'
  } as CSSProperties,
  subheading: {
    ...TYPOGRAPHY.h3,
    color: COLORS.TEXT.SECONDARY,
    margin: `${SPACING.MD} 0 ${SPACING.SM} 0`,
    padding: '0'
  } as CSSProperties,
  text: {
    ...TYPOGRAPHY.body,
    color: COLORS.TEXT.SECONDARY,
    margin: `0 0 ${SPACING.MD} 0`,
    padding: '0'
  } as CSSProperties,
  button: {
    display: 'inline-block',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: TYPOGRAPHY.body.font_size,
    color: COLORS.SURFACE,
    padding: `${SPACING.MD} ${SPACING.XL}`,
    borderRadius: '8px',
    background: COLORS.PRIMARY_GRADIENT,
    textAlign: 'center',
    msoPaddingAlt: '0',
    msoBackgroundAlt: COLORS.PRIMARY,
    boxShadow: SHADOWS.SM,
    border: 'none',
    transition: 'all 0.2s ease'
  } as CSSProperties,
  secondary_button: {
    display: 'inline-block',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: TYPOGRAPHY.body.font_size,
    color: COLORS.PRIMARY,
    padding: `${SPACING.MD} ${SPACING.XL}`,
    borderRadius: '8px',
    border: `1px solid ${COLORS.PRIMARY}`,
    background: COLORS.SURFACE,
    textAlign: 'center',
    boxShadow: SHADOWS.SM,
    transition: 'all 0.2s ease'
  } as CSSProperties,
  card: {
    backgroundColor: COLORS.SURFACE,
    padding: SPACING.LG,
    borderRadius: '12px',
    border: `1px solid ${COLORS.BORDER}`,
    marginBottom: SPACING.LG
  } as CSSProperties,
  highlight_card: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
    padding: SPACING.LG,
    borderRadius: '12px',
    border: `1px solid ${COLORS.PRIMARY}`,
    marginBottom: SPACING.LG
  } as CSSProperties,
  footer: {
    ...TYPOGRAPHY.small,
    color: COLORS.TEXT.MUTED,
    textAlign: 'center',
    padding: `${SPACING.LG} ${SPACING.MD}`,
    borderTop: `1px solid ${COLORS.BORDER}`,
    marginTop: SPACING.XL
  } as CSSProperties,
  footer_link: {
    color: COLORS.PRIMARY, 
    textDecoration: 'none',
    fontWeight: '500'
  } as CSSProperties,
  divider: {
    borderTop: `1px solid ${COLORS.BORDER}`,
    margin: `${SPACING.LG} 0`
  } as CSSProperties,
  badge: {
    display: 'inline-block',
    backgroundColor: COLORS.PRIMARY_LIGHT,
    color: COLORS.PRIMARY,
    padding: `${SPACING.XXS} ${SPACING.XS}`,
    borderRadius: '4px',
    fontSize: TYPOGRAPHY.caption.font_size,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  } as CSSProperties,
  code: {
    fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    backgroundColor: COLORS.BACKGROUND,
    padding: `${SPACING.XXS} ${SPACING.XS}`,
    borderRadius: '4px',
    fontSize: TYPOGRAPHY.small.font_size,
    color: COLORS.TEXT.PRIMARY
  } as CSSProperties
};

// Base layout component that will be used by all email templates
export const generateBaseLayout = (content: string, title: string) => `
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
  <body style="${convertStyleToString(styles.container)}">
    <!--[if mso]>
    <table role="presentation" width="100%">
    <tr>
    <td>
    <![endif]-->
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="${convertStyleToString(styles.main_table)}">
      <tr>
        <td align="center" style="padding: ${SPACING.XL} ${SPACING.MD};">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="${convertStyleToString(styles.content_table)}">
            <tr>
              <td>
                <!-- Header with Logo -->
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="${convertStyleToString(styles.header)}">
                  <tr>
                    <td align="left">
                      <img 
                        src="https://multinex.app/logo.png" 
                        alt="Multinex" 
                        style="${convertStyleToString(styles.logo)}" 
                        width="120"
                      />
                    </td>
                  </tr>
                </table>
                
                <!-- Main Content -->
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="padding-top: ${SPACING.LG}">
                  <tr>
                    <td>
                      ${content}
                    </td>
                  </tr>
                </table>
                
                <!-- Footer -->
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="${convertStyleToString(styles.footer)}">
                  <tr>
                    <td>
                      <p style="margin: 0 0 ${SPACING.SM} 0;">Type, write, listen. In one AI-powered workspace.</p>
                      <p style="margin: 0 0 ${SPACING.SM} 0;">
                        <a href="https://multinex.app/public-courses" style="${convertStyleToString(styles.footer_link)}">Community Courses</a> • 
                        <a href="https://multinex.app/pricing" style="${convertStyleToString(styles.footer_link)}">Pricing</a> • 
                        <a href="https://multinex.app/about" style="${convertStyleToString(styles.footer_link)}">About</a>
                      </p>
                      <p style="margin: ${SPACING.SM} 0 0 0; color: ${COLORS.TEXT.LIGHT};">
                        © ${new Date().getFullYear()} Multinex. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
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
export const convertStyleToString = (style: CSSProperties): string => {
  return Object.entries(style)
    .map(([key, value]) => `${convertToKebabCase(key)}: ${value}`)
    .join('; ');
};

// Helper function to convert camelCase to kebab-case
const convertToKebabCase = (str: string): string => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

// Enhanced components with more professional styling
export const components = {
  button: (text: string, link: string, variant: 'primary' | 'secondary' = 'primary') => text && link ? `
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
      <tr>
        <td align="center" style="padding: ${SPACING.LG} 0;">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${link}" style="height:50px;v-text-anchor:middle;width:240px;" arcsize="10%" stroke="f" fillcolor="${variant === 'primary' ? COLORS.PRIMARY : COLORS.SURFACE}">
            <w:anchorlock/>
            <center style="color:${variant === 'primary' ? COLORS.SURFACE : COLORS.PRIMARY};font-family:sans-serif;font-size:16px;font-weight:600;">${text}</center>
          </v:roundrect>
          <![endif]-->
          <a href="${link}" target="_blank" style="${convertStyleToString(variant === 'primary' ? styles.button : styles.secondary_button)}">${text}</a>
        </td>
      </tr>
    </table>
  ` : '',
  
  heading: (text: string) => text ? `
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
      <tr>
        <td style="${convertStyleToString(styles.heading)}">${text}</td>
      </tr>
    </table>
  ` : '',
  
  subheading: (text: string) => text ? `
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
      <tr>
        <td style="${convertStyleToString(styles.subheading)}">${text}</td>
      </tr>
    </table>
  ` : '',
  
  paragraph: (text: string) => text ? `
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
      <tr>
        <td style="${convertStyleToString(styles.text)}">${text}</td>
      </tr>
    </table>
  ` : '',
  
  bullet_list: (items: string[]) => items && items.length > 0 ? `
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
      <tr>
        <td style="${convertStyleToString({ ...styles.text, paddingLeft: '0' })}">
          ${items.map(item => `
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin-bottom: ${SPACING.SM}">
              <tr valign="top">
                <td width="24" style="padding-right: ${SPACING.XS}; color: ${COLORS.PRIMARY}; font-weight: bold;">•</td>
                <td>${item}</td>
              </tr>
            </table>
          `).join('')}
        </td>
      </tr>
    </table>
  ` : '',
  
  card: (content: string) => content ? `
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin-bottom: ${SPACING.LG};">
      <tr>
        <td style="${convertStyleToString(styles.card)}">
          ${content}
        </td>
      </tr>
    </table>
  ` : '',
  
  highlight_card: (content: string) => content ? `
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="margin-bottom: ${SPACING.LG};">
      <tr>
        <td style="${convertStyleToString(styles.highlight_card)}">
          ${content}
        </td>
      </tr>
    </table>
  ` : '',
  
  divider: () => `
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
      <tr>
        <td style="${convertStyleToString(styles.divider)}"></td>
      </tr>
    </table>
  `,
  
  badge: (text: string) => text ? `
    <span style="${convertStyleToString(styles.badge)}">${text}</span>
  ` : '',
  
  code: (text: string) => text ? `
    <span style="${convertStyleToString(styles.code)}">${text}</span>
  ` : ''
};