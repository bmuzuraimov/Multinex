import { CSSProperties } from 'react';

// Base interface for all email templates
export interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

// Modern color palette
const COLORS = {
  PRIMARY: '#0CC0DF',
  PRIMARY_GRADIENT: 'linear-gradient(135deg, #0CC0DF 0%, #04D3BC 100%)',
  SECONDARY: '#1A365D', 
  ACCENT: '#04D3BC',
  BACKGROUND: '#F9FAFB',
  SURFACE: '#FFFFFF',
  TEXT: {
    PRIMARY: '#1A202C',
    SECONDARY: '#4A5568',
    MUTED: '#718096',
    LIGHT: '#A0AEC0'
  },
  BORDER: '#E2E8F0',
  SUCCESS: '#48BB78',
  WARNING: '#ECC94B',
  ERROR: '#F56565'
};

// Typography scale
const TYPOGRAPHY = {
  h1: {
    font_size: '28px',
    line_height: '34px',
    font_weight: '700'
  },
  h2: {
    font_size: '24px',
    line_height: '30px',
    font_weight: '600'
  },
  h3: {
    font_size: '20px',
    line_height: '28px',
    font_weight: '600'
  },
  body: {
    font_size: '16px',
    line_height: '24px',
    font_weight: 'normal'
  },
  small: {
    font_size: '14px',
    line_height: '20px',
    font_weight: 'normal'
  }
};

// Spacing scale
const SPACING = {
  XS: '8px',
  SM: '12px',
  MD: '16px',
  LG: '24px',
  XL: '32px',
  XXL: '48px'
};

// Common styles that can be reused across templates
export const styles = {
  container: {
    margin: '0',
    padding: '0',
    backgroundColor: COLORS.BACKGROUND,
    width: '100%',
    height: '100%',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
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
    padding: SPACING.XL,
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
    ...TYPOGRAPHY.h2,
    color: COLORS.TEXT.PRIMARY,
    margin: `0 0 ${SPACING.MD} 0`,
    padding: '0'
  } as CSSProperties,
  subheading: {
    ...TYPOGRAPHY.h3,
    color: COLORS.TEXT.SECONDARY,
    margin: `0 0 ${SPACING.SM} 0`,
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
    padding: `${SPACING.SM} ${SPACING.XL}`,
    borderRadius: '8px',
    background: COLORS.PRIMARY_GRADIENT,
    textAlign: 'center',
    msoPaddingAlt: '0',
    msoBackgroundAlt: COLORS.PRIMARY
  } as CSSProperties,
  secondary_button: {
    display: 'inline-block',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: TYPOGRAPHY.body.font_size,
    color: COLORS.PRIMARY,
    padding: `${SPACING.SM} ${SPACING.XL}`,
    borderRadius: '8px',
    border: `2px solid ${COLORS.PRIMARY}`,
    background: COLORS.SURFACE,
    textAlign: 'center'
  } as CSSProperties,
  card: {
    backgroundColor: COLORS.SURFACE,
    padding: SPACING.LG,
    borderRadius: '8px',
    border: `1px solid ${COLORS.BORDER}`,
    marginBottom: SPACING.LG
  } as CSSProperties,
  footer: {
    ...TYPOGRAPHY.small,
    color: COLORS.TEXT.MUTED,
    textAlign: 'center',
    padding: `${SPACING.LG} ${SPACING.MD}`
  } as CSSProperties,
  divider: {
    borderTop: `1px solid ${COLORS.BORDER}`,
    margin: `${SPACING.LG} 0`
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
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                  <tr>
                    <td align="left" style="padding-bottom: ${SPACING.LG};">
                      <img 
                        src="https://multinex.app/logo.png" 
                        alt="Multinex" 
                        style="${convertStyleToString(styles.logo)}" 
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
              <td style="${convertStyleToString(styles.footer)}">
                <p style="margin: 0;">Type, write, listen. In one AI-powered workspace</p>
                <p style="margin: ${SPACING.XS} 0 0 0; color: ${COLORS.TEXT.LIGHT};">
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
export const convertStyleToString = (style: CSSProperties): string => {
  return Object.entries(style)
    .map(([key, value]) => `${convertToKebabCase(key)}: ${value}`)
    .join('; ');
};

// Helper function to convert camelCase to kebab-case
const convertToKebabCase = (str: string): string => {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

// Common components that can be reused across templates
export const components = {
  button: (text: string, link: string, variant: 'primary' | 'secondary' = 'primary') => text && link ? `
    <td align="center" style="padding: ${SPACING.MD} 0;">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${link}" style="height:40px;v-text-anchor:middle;width:200px;" arcsize="10%" stroke="f" fillcolor="${variant === 'primary' ? COLORS.PRIMARY : COLORS.SURFACE}">
        <w:anchorlock/>
        <center style="color:${variant === 'primary' ? COLORS.SURFACE : COLORS.PRIMARY};font-family:sans-serif;font-size:16px;font-weight:bold;">${text}</center>
      </v:roundrect>
      <![endif]-->
      <a href="${link}" style="${convertStyleToString(variant === 'primary' ? styles.button : styles.secondary_button)}">${text}</a>
    </td>
  ` : '',
  heading: (text: string) => text ? `
    <td style="${convertStyleToString(styles.heading)}">${text}</td>
  ` : '',
  subheading: (text: string) => text ? `
    <td style="${convertStyleToString(styles.subheading)}">${text}</td>
  ` : '',
  paragraph: (text: string) => text ? `
    <td style="${convertStyleToString(styles.text)}">${text}</td>
  ` : '',
  bullet_list: (items: string[]) => items && items.length > 0 ? `
    <td style="${convertStyleToString({ ...styles.text, paddingLeft: SPACING.MD })}">
      ${items.map(item => `<div style="margin-bottom: ${SPACING.XS};">• ${item}</div>`).join('')}
    </td>
  ` : '',
  card: (content: string) => content ? `
    <td style="${convertStyleToString(styles.card)}">
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
        ${content}
      </table>
    </td>
  ` : '',
  divider: () => `
    <td style="${convertStyleToString(styles.divider)}"></td>
  `
};