import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { MovieSearchResult } from '../movie-search/state/models/movie-search-results';

@Component({
  selector: 'keepadoo-movie-search-result',
  templateUrl: './movie-search-result.component.html',
  styleUrls: ['./movie-search-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieSearchResultComponent implements OnInit {
  @Input() movie: MovieSearchResult;
  @Output() selectedMovie = new EventEmitter<MovieSearchResult>();

  constructor() {}

  ngOnInit() {}

  selectMovie(): void {
    this.selectedMovie.emit(this.movie);
  }
}
