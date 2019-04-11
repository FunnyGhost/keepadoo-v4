import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { testMovies } from '../../../test-utilities/test-objects';
import { MovieComponent } from './movie.component';

describe('MovieComponent', () => {
  const movieToUse = testMovies[0];
  let component: MovieComponent;
  let fixture: ComponentFixture<MovieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MovieComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieComponent);
    component = fixture.componentInstance;
    component.movie = movieToUse;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Render', () => {
    it('should show the movie poster', () => {
      const moviePosters = fixture.debugElement.queryAll(
        By.css('img.movie-poster')
      );

      expect(moviePosters.length).toBe(1);
      expect(moviePosters[0].nativeElement.src).toContain(
        movieToUse.poster_path
      );
    });
  });
});
