import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { testMoviestLists } from '../../../test-utilities/test-objects';
import { Movie } from '../movies/state/models/movie';
import { MoviesListComponent } from './movies-list.component';

describe('MoviesListComponent', () => {
  const listToUse = testMoviestLists[1];
  let component: MoviesListComponent;
  let fixture: ComponentFixture<MoviesListComponent>;

  beforeEach(waitForAsync(() => {
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

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Render', () => {
    test('should show the list name', () => {
      const titleElement = fixture.debugElement.query(By.css('.title'));

      expect(titleElement.nativeElement.innerHTML).toBe(listToUse.name);
    });

    test('should show the list size', () => {
      const sizeElement = fixture.debugElement.query(By.css('.list-size'));

      expect(sizeElement.nativeElement.innerHTML).toContain(listToUse.moviesCount);
    });

    test('should show the last movies in list', () => {
      const imgTags = fixture.debugElement
        .queryAll(By.css('img'))
        .map((element: DebugElement) => element.nativeElement.outerHTML);
      expect(imgTags.length).toBe(listToUse.recentMovies.length);

      listToUse.recentMovies.forEach((movie: Movie, index: number) => {
        expect(imgTags[index]).toContain(movie.poster_path);
      });
    });
  });

  test('should emit when the list is clicked', done => {
    const title = fixture.debugElement.query(By.css('button.movies-list'));
    component.listClick.subscribe(listId => {
      expect(listId).toEqual(listToUse.id);
      done();
    });

    title.triggerEventHandler('click', null);
  });
});
