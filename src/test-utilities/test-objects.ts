import { MovieSearchResult } from '../app/movies-lists/movie-search/state/models/movie-search-results';
import { Movie } from '../app/movies-lists/movies/state/models/movie';
import { MoviesList } from '../app/movies-lists/state/models/movies-list';
import { User } from '../app/state/models/user';
import firebase from 'firebase';

export const testUser: User = {
  displayName: 'Batman',
  email: 'bruce_wayne@gotham.dc',
  userId: '1'
};

export const testFirebaseUser = {
  displayName: 'Batman',
  email: 'bruce_wayne@gotham.dc',
  uid: '1'
} as firebase.User;

export const testMoviesLists: MoviesList[] = [
  {
    id: '1',
    name: 'to see',
    userId: 'batman',
    moviesCount: 34,
    recentMovies: [
      {
        id: '1',
        added_on: '2019-08-10T22:24:07.722Z',
        key: 'key-3',
        genre_ids: [1],
        listId: '1',
        overview: 'I am batman',
        poster_path: 'batman-poster-path',
        release_date: new Date(),
        title: 'Batman begins',
        vote_average: 5,
        vote_count: 20033
      }
    ]
  },
  {
    id: '2',
    name: 'seen',
    userId: 'joker',
    moviesCount: 3,
    recentMovies: [
      {
        id: '2',
        added_on: '2019-08-10T22:24:07.722Z',
        key: 'key-1',
        genre_ids: [1],
        listId: '1',
        overview: 'I am batman again',
        poster_path: 'batman-second-poster-path',
        release_date: new Date(),
        title: 'Batman continues',
        vote_average: 4.9,
        vote_count: 2433
      },
      {
        id: '3',
        added_on: '2019-08-10T22:24:07.722Z',
        key: 'key-1',
        genre_ids: [1],
        listId: '2',
        overview: 'I am joker',
        poster_path: 'joker-poster-path',
        release_date: new Date(),
        title: 'Joker begins',
        vote_average: 4.6,
        vote_count: 343
      }
    ]
  }
];

export const testMovies: Movie[] = [
  {
    id: '1',
    added_on: '2019-08-10T22:24:07.722Z',
    key: 'key-2',
    genre_ids: [1],
    listId: '1',
    overview: 'I am batman',
    poster_path: 'batman-poster-path',
    release_date: new Date(),
    title: 'Batman begins',
    vote_average: 5,
    vote_count: 20033
  },
  {
    id: '2',
    added_on: '2019-08-10T22:24:07.722Z',
    key: 'key-1',
    genre_ids: [1],
    listId: '1',
    overview: 'I am batman again',
    poster_path: 'batman-second-poster-path',
    release_date: new Date(),
    title: 'Batman continues',
    vote_average: 4.9,
    vote_count: 2433
  },
  {
    id: '3',
    added_on: '2019-08-10T22:24:07.722Z',
    key: 'key-3',
    genre_ids: [1],
    listId: '2',
    overview: 'I am joker',
    poster_path: 'joker-poster-path',
    release_date: new Date(),
    title: 'Joker begins',
    vote_average: 4.6,
    vote_count: 343
  }
];

export const testMovieSearchResults: MovieSearchResult[] = [
  {
    id: 1,
    genre_ids: [1],
    overview: 'I am batman',
    poster_path: 'batman-poster-path',
    title: 'Batman begins',
    vote_average: 5,
    vote_count: 20033,
    adult: false,
    backdrop_path: 'batman-backdrop-path',
    original_language: 'en',
    original_title: 'I am batman',
    popularity: 3432,
    release_date: '2342423',
    video: false
  },
  {
    id: 2,
    genre_ids: [1],
    overview: 'I am batman again',
    poster_path: 'batman-second-poster-path',
    title: 'Batman continues',
    vote_average: 4.9,
    vote_count: 2433,
    adult: false,
    backdrop_path: 'batman-second-backdrop-path',
    original_language: 'ro',
    original_title: 'Batman continues',
    popularity: 4524422,
    release_date: '432',
    video: true
  },
  {
    id: 3,
    genre_ids: [1],
    overview: 'I am joker',
    poster_path: 'joker-poster-path',
    title: 'Joker begins',
    vote_average: 4.6,
    vote_count: 343,
    adult: false,
    backdrop_path: 'joker-backdrop-path',
    original_language: 'nl',
    original_title: 'Joker begins',
    popularity: 11,
    release_date: '8778989',
    video: false
  }
];
