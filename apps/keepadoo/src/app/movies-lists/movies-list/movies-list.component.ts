import { Component, Input, OnInit } from '@angular/core';
import { MoviesList } from '../state/models/movies-list';

@Component({
  selector: 'keepadoo-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss']
})
export class MoviesListComponent implements OnInit {
  @Input() moviesList: MoviesList;

  constructor() {}

  ngOnInit() {}
}
