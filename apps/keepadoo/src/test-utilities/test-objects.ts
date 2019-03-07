import { User as FirebaseUser } from 'firebase';
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
    userId: 'batman'
  },
  {
    id: '2',
    name: 'seen',
    userId: 'joker'
  }
];
