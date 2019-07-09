import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MoviesListsService } from '../state/movies-lists.service';
import { MovieSearchResult } from './state/models/movie-search-results';
import { MovieSearchQuery } from './state/movie-search.query';
import { MovieSearchService } from './state/movie-search.service';

@Component({
  selector: 'keepadoo-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieSearchComponent implements OnInit {
  movieToSearchFor = new FormControl('');
  movieResults$: Observable<MovieSearchResult[]>;

  constructor(
    private movieSearchService: MovieSearchService,
    private movieSearchQuery: MovieSearchQuery,
    private moviesListsService: MoviesListsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.movieResults$ = this.movieSearchQuery.selectAll();

    this.movieToSearchFor.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((movieName: string) => {
        this.movieSearchService.searchMovies(movieName);
      });
  }

  addMovie(movie: MovieSearchResult): void {
    this.moviesListsService.addMovieToCurrentList(movie);
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
}
