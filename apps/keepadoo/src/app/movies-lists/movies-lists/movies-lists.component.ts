import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MoviesList } from '../state/models/movies-list';
import { MoviesListsQuery } from '../state/movies-lists.query';
import { MoviesListsService } from '../state/movies-lists.service';

@Component({
  selector: 'keepadoo-movies-lists',
  templateUrl: './movies-lists.component.html',
  styleUrls: ['./movies-lists.component.scss']
})
export class MoviesListsComponent implements OnInit {
  moviesLists$: Observable<MoviesList[]>;

  constructor(
    moviesListsQuery: MoviesListsQuery,
    moviesListsService: MoviesListsService
  ) {
    this.moviesLists$ = moviesListsQuery.selectAll();
  }

  ngOnInit() {}
}
