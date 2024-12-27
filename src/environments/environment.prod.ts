export const environment = {
  production: true,
  routerUrl: "https://rw-dev-gateway.azurewebsites.net/api",

  appVersion: "0.0.0",

  settings: {
    auth: {
      // OAuth2 credentials
      clientId: 'relayauth',
      scope: 'relayworks',
      secretId: 'fake-secret-id', // <Your auth secret id here>
      authBaseUrl: 'https://rw-is-dev.azurewebsites.net',
      // keys to store tokens at local storage
      accessTokenKey: 'DoPS3ZrQjM',
      refreshTokenKey: 'nmlP8PW2nb',
    },
  },
};
