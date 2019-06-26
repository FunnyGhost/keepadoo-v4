import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MovieSearchService } from './state/movie-search.service';

@Component({
  selector: 'keepadoo-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.scss']
})
export class MovieSearchComponent implements OnInit {
  movieToSearchFor = new FormControl('');

  constructor(private movieSearchService: MovieSearchService) {}

  ngOnInit() {
    this.movieToSearchFor.valueChanges.subscribe((movieName: string) => {
      this.movieSearchService.searchMovies(movieName);
    });
  }
}
