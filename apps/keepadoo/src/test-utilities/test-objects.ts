import { User as FirebaseUser } from 'firebase';
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
