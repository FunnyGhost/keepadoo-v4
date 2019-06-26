import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { MovieSearchResult } from '../movie-search/state/models/movie-search-results';
import { Movie } from '../movies/state/models/movie';

@Component({
  selector: 'keepadoo-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieComponent implements OnInit {
  @Input() movie: Movie | MovieSearchResult;

  constructor() {}

  ngOnInit() {}
}
