import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { MoviesList } from '../state/models/movies-list';

@Component({
  selector: 'keepadoo-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviesListComponent implements OnInit {
  @Input() moviesList: MoviesList;
  @Output() listClick = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  listClicked(): void {
    this.listClick.emit(this.moviesList.id);
  }
}
