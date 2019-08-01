export interface Movie {
  key: string;
  id: string;
  genre_ids: number[];
  listId: string;
  overview: string;
  poster_path: string;
  release_date: Date;
  title: string;
  vote_average: number;
  vote_count: number;
}
