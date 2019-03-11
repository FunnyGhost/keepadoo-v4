import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MoviesListsRoutingModule } from './movies-lists-routing.module';
import { MoviesListsComponent } from './movies-lists/movies-lists.component';
import { MoviesService } from './movies/state/movies.service';
import { MoviesListsQuery } from './state/movies-lists.query';
import { MoviesListsService } from './state/movies-lists.service';
import { MoviesListsStore } from './state/movies-lists.store';

@NgModule({
  declarations: [MoviesListsComponent],
  providers: [
    MoviesListsQuery,
    MoviesListsService,
    MoviesListsStore,
    MoviesService
  ],
  imports: [CommonModule, MoviesListsRoutingModule]
})
export class MoviesListsModule {}
