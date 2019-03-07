import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MoviesListsRoutingModule } from './movies-lists-routing.module';
import { MoviesListsComponent } from './movies-lists/movies-lists.component';

@NgModule({
  declarations: [MoviesListsComponent],
  imports: [CommonModule, MoviesListsRoutingModule]
})
export class MoviesListsModule {}
