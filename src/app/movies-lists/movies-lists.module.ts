import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MovieSearchResultComponent } from './movie-search-result/movie-search-result.component';
import { MovieSearchComponent } from './movie-search/movie-search.component';
import { MovieSearchQuery } from './movie-search/state/movie-search.query';
import { MovieSearchService } from './movie-search/state/movie-search.service';
import { MovieSearchStore } from './movie-search/state/movie-search.store';
import { MovieComponent } from './movie/movie.component';
import { MoviesListCreateComponent } from './movies-list-create/movies-list-create.component';
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

@NgModule({
  imports: [CommonModule, SharedModule, MoviesListsRoutingModule, FormsModule, ReactiveFormsModule],
  declarations: [
    MoviesListsComponent,
    MoviesListComponent,
    MoviesListDetailsComponent,
    MovieComponent,
    MovieSearchComponent,
    MovieSearchResultComponent,
    MoviesListCreateComponent
  ],
  providers: [
    MoviesListsStore,
    MoviesListsQuery,
    MoviesListsService,
    MoviesStore,
    MoviesQuery,
    MoviesService,
    MovieSearchStore,
    MovieSearchQuery,
    MovieSearchService
  ]
})
export class MoviesListsModule {}
