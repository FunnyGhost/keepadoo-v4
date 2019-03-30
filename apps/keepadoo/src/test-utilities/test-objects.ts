import { User as FirebaseUser } from 'firebase';
import { Movie } from '../app/movies-lists/movies/state/models/movie';
import { MoviesList } from '../app/movies-lists/state/models/movies-list';
import { User } from '../app/state/models/user';

export const testUser: User = {
  displayName: 'Batman',
  email: 'bruce_wayne@gotham.dc',
  userId: '1'
};

export const testFirebaseUser: FirebaseUser = {
  displayName: 'Batman',
  email: 'bruce_wayne@gotham.dc',
  uid: '1'
} as FirebaseUser;

export const testMoviestLists: MoviesList[] = [
  {
    id: '1',
    name: 'to see',
    userId: 'batman',
    numberOfMovies: 34,
    lastMovies: [
      {
        id: '1',
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
    numberOfMovies: 3,
    lastMovies: [
      {
        id: '2',
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
