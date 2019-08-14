import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieSearchComponent } from './movie-search/movie-search.component';
import { MoviesListCreateComponent } from './movies-list-create/movies-list-create.component';
import { MoviesListDetailsComponent } from './movies-list-details/movies-list-details.component';
import { MoviesListsComponent } from './movies-lists/movies-lists.component';

const routes: Routes = [
  {
    path: 'add',
    component: MoviesListCreateComponent
  },
  {
    path: ':id',
    pathMatch: 'full',
    component: MoviesListDetailsComponent
  },
  {
    path: ':id/add',
    component: MovieSearchComponent
  },
  {
    path: '',
    pathMatch: 'full',
    component: MoviesListsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoviesListsRoutingModule {}
