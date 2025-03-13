import { defineUserSignupFields } from 'wasp/auth/providers/types';

// Constants
const HKBU_EMAIL_DOMAIN = '@life.hkbu.edu.hk';
const DEFAULT_CREDITS = 10;
const HKBU_CREDITS = 30;

export const getEmailUserFields = defineUserSignupFields({
  username: (data: any) => data.email,
  email: (data: any) => data.email,
  credits: (data: any) => data.email.endsWith(HKBU_EMAIL_DOMAIN) ? HKBU_CREDITS : DEFAULT_CREDITS,
});

export const getGithubUserFields = defineUserSignupFields({
  // NOTE: if we don't want to access users' emails, we can use scope ["user:read"]
  // instead of ["user"] and access args.profile.username instead
  email: (data: any) => data.profile.emails[0].email,
  username: (data: any) => data.profile.login,
  credits: (data: any) => data.profile.emails[0].email.endsWith(HKBU_EMAIL_DOMAIN) ? HKBU_CREDITS : DEFAULT_CREDITS,
});

export function getGithubAuthConfig() {
  return {
    scopes: ['user'],
  };
}

export const getGoogleUserFields = defineUserSignupFields({
  email: (data: any) => data.profile.email,
  username: (data: any) => data.profile.name,
  credits: (data: any) => data.profile.email.endsWith(HKBU_EMAIL_DOMAIN) ? HKBU_CREDITS : DEFAULT_CREDITS,
});

export function getGoogleAuthConfig() {
  return {
    scopes: ['profile', 'email'], // must include at least 'profile' for Google
  };
}
