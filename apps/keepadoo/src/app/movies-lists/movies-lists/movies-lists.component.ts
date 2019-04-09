import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerMock } from 'apps/keepadoo/src/test-utilities/test-mocks';
import { Observable } from 'rxjs';
import { MoviesList } from '../state/models/movies-list';
import { MoviesListsQuery } from '../state/movies-lists.query';

@Component({
  selector: 'keepadoo-movies-lists',
  templateUrl: './movies-lists.component.html',
  styleUrls: ['./movies-lists.component.scss']
})
export class MoviesListsComponent implements OnInit {
  moviesLists$: Observable<MoviesList[]>;

  constructor(
    private moviesListsQuery: MoviesListsQuery,
    private router: Router
  ) {}

  ngOnInit() {
    this.moviesLists$ = this.moviesListsQuery.selectAll();
  }

  goToList(listId: string): void {
    routerMock.navigate([listId]);
  }
}
