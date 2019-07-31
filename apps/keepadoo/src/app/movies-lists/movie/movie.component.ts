import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { Movie } from '../movies/state/models/movie';

@Component({
  selector: 'keepadoo-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieComponent implements OnInit {
  @Input() editMode = false;
  @Input() movie: Movie;
  @Output() delete = new EventEmitter<Movie>();

  constructor() {}

  ngOnInit() {}

  onDelete(): void {
    this.delete.emit(this.movie);
  }
}
