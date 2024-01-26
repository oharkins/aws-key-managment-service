export const platformApiUrl = 'https://justice-api.tylerapis.com';
export const baseUiUrl = '';
export const appHome = `${baseUiUrl}/template`;
export const platformUiUrl = 'https://justice.tylerapis.com';
export const productKey = 'template';

export const environment = {
  production: false,
  oidc: {
    clientId: '0oa6oepgu0BbABkXv1d5',
    issuer: 'https://login.warrants.cloud/oauth2/default',
    redirectUri: `${appHome}/callback`,
    scopes: ['openid', 'profile', 'email', 'offline_access'],
    pkce: true
  },
  appHomeUrl: appHome,
  portalHomeUrl: platformUiUrl,
  productHomeUrl: '',
  userApiUrl: `${platformApiUrl}/user`,
  sessionTimeoutSettings: {
    warningDurationMs: 5 * 60 * 1000, // 5 minutes
    inactivityDurationMs: 30 * 60 * 1000 // 30 minutes
  }
};