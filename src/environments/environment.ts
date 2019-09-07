import { TMDBConfig } from './tmdb.config';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const tmdbConfig: TMDBConfig = {
  api_key: 'd7c178b732e89a3e82d70f43186af535',
  apiUrl: 'https://api.themoviedb.org/3'
};

const firebase = {
  apiKey: 'AIzaSyCmdoGjhIkg5Xz2okqrX4dEZZZlCOPGAjA',
  authDomain: 'keepadoo.firebaseapp.com',
  databaseURL: 'https://keepadoo.firebaseio.com',
  projectId: 'keepadoo',
  storageBucket: 'keepadoo.appspot.com',
  messagingSenderId: '516267612124',
  appId: '1:516267612124:web:6dcff203983d3260'
};
export const environment = {
  production: false,
  firebase,
  tmdbConfig
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
