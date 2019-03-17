import { Movie } from '../../movies/state/models/movie';

export interface MoviesList {
  id: string;
  name?: string;
  userId: string;
  lastMovies?: Movie[];
  numberOfMovies: number;
}
