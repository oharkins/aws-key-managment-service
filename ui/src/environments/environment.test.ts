export const platformApiUrl = 'https://test-justice-api.tylerhost.net';
export const baseUiUrl = '';
export const appHome = `${baseUiUrl}/template`;
export const platformUiUrl= 'https://test-justice.tylerapis.com';
export const productKey = 'template';

export const environment = {
  production: false,
  oidc: {
    clientId: '0oa8uub7chZOh0h3X357',
    issuer: 'https://justice-login.tylerhost.net/oauth2/aus7d89dlzGXEsibK357',
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