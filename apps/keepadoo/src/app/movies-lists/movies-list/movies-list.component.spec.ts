import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { testMoviestLists } from '../../../test-utilities/test-objects';
import { Movie } from '../movies/state/models/movie';
import { MoviesListComponent } from './movies-list.component';

describe('MoviesListComponent', () => {
  const listToUse = testMoviestLists[1];
  let component: MoviesListComponent;
  let fixture: ComponentFixture<MoviesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MoviesListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesListComponent);
    component = fixture.componentInstance;
    component.moviesList = listToUse;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Render', () => {
    it('should show the list name', () => {
      const titleElement = fixture.debugElement.query(By.css('.title'));

      expect(titleElement.nativeElement.innerHTML).toBe(listToUse.name);
    });

    it('should show the last movies in list', () => {
      const imgTags = fixture.debugElement
        .queryAll(By.css('img'))
        .map((element: DebugElement) => element.nativeElement.outerHTML);
      expect(imgTags.length).toBe(listToUse.lastMovies.length);

      listToUse.lastMovies.forEach((movie: Movie, index: number) => {
        expect(imgTags[index]).toContain(movie.poster_path);
      });
    });
  });
});
