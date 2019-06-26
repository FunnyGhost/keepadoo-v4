import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { movieSearchQueryMock } from '../../../test-utilities/test-mocks';
import { testMovieSearchResults } from '../../../test-utilities/test-objects';
import { MovieComponent } from '../movie/movie.component';
import { MovieSearchComponent } from './movie-search.component';
import { MovieSearchQuery } from './state/movie-search.query';
import { MovieSearchService } from './state/movie-search.service';

const movieSearchServiceMock = {
  searchMovies: () => {}
};

describe('MovieSearchComponent', () => {
  let component: MovieSearchComponent;
  let fixture: ComponentFixture<MovieSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [MovieSearchComponent, MockComponent(MovieComponent)],
      providers: [
        { provide: MovieSearchService, useValue: movieSearchServiceMock },
        {
          provide: MovieSearchQuery,
          useValue: movieSearchQueryMock
        }
      ]
    })
      .overrideComponent(MovieSearchComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search for movies when a user types something', () => {
    const movieToSearchFor = 'Batman';

    const searchInput = fixture.debugElement.query(By.css('input'));
    expect(searchInput).toBeTruthy();

    const movieSearchService: MovieSearchService = TestBed.get(
      MovieSearchService
    );
    jest.spyOn(movieSearchService, 'searchMovies');

    searchInput.nativeElement.value = movieToSearchFor;
    searchInput.nativeElement.dispatchEvent(new Event('input'));

    expect(movieSearchService.searchMovies).toHaveBeenCalledWith(
      movieToSearchFor
    );
  });

  it('should display the movies from the search store', () => {
    movieSearchQueryMock.selectAll.mockReturnValue(of(testMovieSearchResults));

    component.ngOnInit();
    fixture.detectChanges();

    const movieElements = fixture.debugElement.queryAll(
      By.directive(MovieComponent)
    );
    expect(movieElements.length).toBe(testMovieSearchResults.length);
  });
});
