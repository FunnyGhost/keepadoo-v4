import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Movie } from '../movies/state/models/movie';
import { MoviesQuery } from '../movies/state/movies.query';
import { MoviesService } from '../movies/state/movies.service';
import { MoviesList } from '../state/models/movies-list';
import { MoviesListsQuery } from '../state/movies-lists.query';
import { MoviesListsService } from '../state/movies-lists.service';

@Component({
  selector: 'keepadoo-movies-list-details',
  templateUrl: './movies-list-details.component.html',
  styleUrls: ['./movies-list-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviesListDetailsComponent implements OnInit {
  movies$: Observable<Movie[]>;
  selectedList$: Observable<MoviesList>;
  editMode$: Observable<boolean>;

  showConfirmationDialog: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private moviesListsService: MoviesListsService,
    private moviesService: MoviesService,
    private moviesQuery: MoviesQuery,
    private moviesListQuery: MoviesListsQuery,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const listId = params.get('id');
      this.moviesListsService.setActive(listId);
    });

    this.movies$ = this.moviesQuery.selectAll();
    this.selectedList$ = this.moviesListQuery.selectActive() as Observable<MoviesList>;
    this.editMode$ = this.moviesQuery.select().pipe(map((state) => state.editMode));
  }

  edit(): void {
    this.moviesService.enableEditMode();
  }

  done(): void {
    this.moviesService.disableEditMode();
  }

  askForDeleteConfirmation(): void {
    this.showConfirmationDialog = true;
  }

  deleteList(): void {
    this.selectedList$.pipe(take(1)).subscribe((data) => {
      this.moviesListsService.remove(data.id);
      this.showConfirmationDialog = false;
      this.goBack();
    });
  }

  cancelListDeletion(): void {
    this.showConfirmationDialog = false;
  }

  async deleteMovie(movie: Movie) {
    this.moviesService.deleteMovie(movie);
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
}
