import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MoviesListDetailsComponent } from './movies-list-details/movies-list-details.component';
import { MoviesListComponent } from './movies-list/movies-list.component';
import { MoviesListsRoutingModule } from './movies-lists-routing.module';
import { MoviesListsComponent } from './movies-lists/movies-lists.component';
import { MoviesQuery } from './movies/state/movies.query';
import { MoviesService } from './movies/state/movies.service';
import { MoviesStore } from './movies/state/movies.store';
import { MoviesListsQuery } from './state/movies-lists.query';
import { MoviesListsService } from './state/movies-lists.service';
import { MoviesListsStore } from './state/movies-lists.store';
import { MovieComponent } from './movie/movie.component';
import { MovieSearchComponent } from './movie-search/movie-search.component';

@NgModule({
  declarations: [
    MoviesListsComponent,
    MoviesListComponent,
    MoviesListDetailsComponent,
    MovieComponent,
    MovieSearchComponent
  ],
  providers: [
    MoviesListsQuery,
    MoviesListsService,
    MoviesListsStore,
    MoviesService,
    MoviesStore,
    MoviesQuery
  ],
  imports: [CommonModule, MoviesListsRoutingModule]
})
export class MoviesListsModule {}
