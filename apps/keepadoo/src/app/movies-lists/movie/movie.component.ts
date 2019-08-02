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
  readonly wiggleClasses = ['wiggle1', 'wiggle2'];

  @Input() editMode = false;
  @Input() movie: Movie;
  @Output() delete = new EventEmitter<Movie>();

  wiggleStyle = this.wiggleClasses[
    Math.floor(Math.random() * this.wiggleClasses.length)
  ];
  animationDelay = `${this.generateRandomNumber(-0.75, -0.15)}s`;
  animationDuration = `${this.generateRandomNumber(0.2, 0.35)}s`;

  constructor() {}

  ngOnInit() {}

  onDelete(): void {
    this.delete.emit(this.movie);
  }

  private generateRandomNumber(min: number, max: number): string {
    return (Math.random() * (max - min) + min).toFixed(2);
  }
}
