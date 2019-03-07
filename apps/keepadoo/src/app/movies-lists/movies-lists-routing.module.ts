import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviesListsComponent } from './movies-lists/movies-lists.component';

const routes: Routes = [
  {
    path: '',
    component: MoviesListsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoviesListsRoutingModule {}
