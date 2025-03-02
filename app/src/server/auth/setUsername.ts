import { defineUserSignupFields } from 'wasp/auth/providers/types';

export const getEmailUserFields = defineUserSignupFields({
  username: (data: any) => data.email,
  email: (data: any) => data.email,
  credits: (data: any) => data.email.endsWith('@life.hkbu.edu.hk') ? 30 : 10,
});

export const getGitHubUserFields = defineUserSignupFields({
  // NOTE: if we don't want to access users' emails, we can use scope ["user:read"]
  // instead of ["user"] and access args.profile.username instead
  email: (data: any) => data.profile.emails[0].email,
  username: (data: any) => data.profile.login,
  credits: (data: any) => data.profile.emails[0].email.endsWith('@life.hkbu.edu.hk') ? 30 : 10,
});

export function getGitHubAuthConfig() {
  return {
    scopes: ['user'],
  };
}

export const getGoogleUserFields = defineUserSignupFields({
  email: (data: any) => data.profile.email,
  username: (data: any) => data.profile.name,
  credits: (data: any) => data.profile.email.endsWith('@life.hkbu.edu.hk') ? 30 : 10,
});

export function getGoogleAuthConfig() {
  return {
    scopes: ['profile', 'email'], // must include at least 'profile' for Google
  };
}
