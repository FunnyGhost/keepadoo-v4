import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MoviesList } from '../state/models/movies-list';
import { MoviesListsQuery } from '../state/movies-lists.query';
import { MoviesListsService } from '../state/movies-lists.service';

@Component({
  selector: 'keepadoo-movies-lists',
  templateUrl: './movies-lists.component.html',
  styleUrls: ['./movies-lists.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviesListsComponent implements OnInit {
  moviesLists$: Observable<MoviesList[]>;

  constructor(
    private moviesListsQuery: MoviesListsQuery,
    private moviesListsService: MoviesListsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.moviesLists$ = this.moviesListsQuery.selectAll();
  }

  goToList(listId: string): void {
    this.router.navigate([`/home/movies-lists/${listId}`]);
  }
}
