import { TMDBConfig } from './tmdb.config';

const tmdbConfig: TMDBConfig = {
  api_key: 'd7c178b732e89a3e82d70f43186af535',
  apiUrl: 'https://api.themoviedb.org/3'
};

const firebase = {
  apiKey: 'AIzaSyCmdoGjhIkg5Xz2okqrX4dEZZZlCOPGAjA',
  authDomain: 'keepadoo.firebaseapp.com',
  databaseURL: 'https://keepadoo.firebaseio.com',
  projectId: 'keepadoo',
  storageBucket: '',
  messagingSenderId: '516267612124'
};

export const environment = {
  production: true,
  firebase,
  tmdbConfig
};
