// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  routerUrl: 'https://localhost:7209/api',

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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
