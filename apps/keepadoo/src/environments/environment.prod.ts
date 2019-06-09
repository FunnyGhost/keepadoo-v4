import { TMDBConfig } from './tmdb.config';

const tmdbConfig: TMDBConfig = {
  api_key: 'd7c178b732e89a3e82d70f43186af535',
  apiUrl: 'https://api.themoviedb.org/3'
};

export const environment = {
  production: true,
  tmdbConfig
};
