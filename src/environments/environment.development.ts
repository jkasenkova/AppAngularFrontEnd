export const environment = {
  production: false,
  routerUrl: "https://localhost:7209/api",

  appVersion: "0.0.0",
  
  settings: {
    auth: {
      // OAuth2 credentials
      clientId: 'relayauth',
      scope: 'relayworks',
      secretId: 'fake-secret-id', // <Your auth secret id here>
      authBaseUrl: 'https://localhost:5443',
      // keys to store tokens at local storage
      accessTokenKey: 'DoPS3ZrQjM',
      refreshTokenKey: 'nmlP8PW2nb',
    },
  },
};