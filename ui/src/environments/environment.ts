export const platformApiUrl = 'https://fjotj24gpk.execute-api.us-east-1.amazonaws.com/v1';
export const baseUiUrl = 'http://localhost:4200';
export const appHome = `${baseUiUrl}`;
export const platformUiUrl = 'https://localhost:4200';
export const productKey = 'template';

export const environment = {
  production: false,
  oidc: {
    clientId: '0oa1z3t2jdjbiZ2RH0h8',
    issuer: 'https://tyler-vendengine.oktapreview.com/oauth2/default',
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