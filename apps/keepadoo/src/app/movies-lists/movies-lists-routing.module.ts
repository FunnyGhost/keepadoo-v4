import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviesListDetailsComponent } from './movies-list-details/movies-list-details.component';
import { MoviesListsComponent } from './movies-lists/movies-lists.component';

const routes: Routes = [
  {
    path: ':id',
    component: MoviesListDetailsComponent
  },
  {
    path: 'add',
    component: MoviesListDetailsComponent
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
