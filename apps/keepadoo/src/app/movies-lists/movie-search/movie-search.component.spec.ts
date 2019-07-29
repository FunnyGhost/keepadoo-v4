import { ChangeDetectionStrategy } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { movieSearchQueryMock } from '../../../test-utilities/test-mocks';
import { testMovieSearchResults } from '../../../test-utilities/test-objects';
import { MovieSearchResultComponent } from '../movie-search-result/movie-search-result.component';
import { MoviesListsService } from '../state/movies-lists.service';
import { MovieSearchComponent } from './movie-search.component';
import { MovieSearchQuery } from './state/movie-search.query';
import { MovieSearchService } from './state/movie-search.service';

const movieSearchServiceMock = {
  searchMovies: () => {}
};

const movieListServiceMock = {
  addMovieToCurrentList: () => {}
};

describe('MovieSearchComponent', () => {
  let component: MovieSearchComponent;
  let fixture: ComponentFixture<MovieSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [
        MovieSearchComponent,
        MockComponent(MovieSearchResultComponent)
      ],
      providers: [
        { provide: MovieSearchService, useValue: movieSearchServiceMock },
        { provide: MoviesListsService, useValue: movieListServiceMock },
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

  it('should wait 500ms when a user types something and then search', fakeAsync(() => {
    const movieToSearchFor = 'Batman';

    const searchInput = fixture.debugElement.query(By.css('input'));
    expect(searchInput).toBeTruthy();

    const movieSearchService: MovieSearchService = TestBed.get(
      MovieSearchService
    );
    jest.spyOn(movieSearchService, 'searchMovies');

    searchInput.nativeElement.value = movieToSearchFor;
    searchInput.nativeElement.dispatchEvent(new Event('input'));
    expect(movieSearchService.searchMovies).not.toHaveBeenCalledWith(
      movieToSearchFor
    );

    tick(500);

    expect(movieSearchService.searchMovies).toHaveBeenCalledWith(
      movieToSearchFor
    );
  }));

  it('should display the movies from the search store', () => {
    movieSearchQueryMock.selectAll.mockReturnValue(of(testMovieSearchResults));

    component.ngOnInit();
    fixture.detectChanges();

    const movieElements = fixture.debugElement.queryAll(
      By.directive(MovieSearchResultComponent)
    );
    expect(movieElements.length).toBe(testMovieSearchResults.length);
  });

  it('should add a movie to the list when selected', () => {
    const movieListService: MoviesListsService = TestBed.get(
      MoviesListsService
    );
    jest.spyOn(movieListService, 'addMovieToCurrentList');
    const router: Router = TestBed.get(Router);
    spyOn(router, 'navigate');

    movieSearchQueryMock.selectAll.mockReturnValue(of(testMovieSearchResults));

    component.ngOnInit();
    fixture.detectChanges();

    const movieElement = fixture.debugElement.queryAll(
      By.directive(MovieSearchResultComponent)
    )[0].componentInstance as MovieSearchResultComponent;
    movieElement.selectedMovie.emit(testMovieSearchResults[0]);
    expect(movieListService.addMovieToCurrentList).toHaveBeenCalledWith(
      testMovieSearchResults[0]
    );
  });

  it('should go up one level when a movie is added', () => {
    const router: Router = TestBed.get(Router);
    spyOn(router, 'navigate').and.callFake(() => {});
    movieSearchQueryMock.selectAll.mockReturnValue(of(testMovieSearchResults));

    component.ngOnInit();
    fixture.detectChanges();

    const movieElement = fixture.debugElement.queryAll(
      By.directive(MovieSearchResultComponent)
    )[0].componentInstance as MovieSearchResultComponent;
    movieElement.selectedMovie.emit(testMovieSearchResults[0]);

    expect(router.navigate).toHaveBeenCalled();
  });

  it('should go up one level when the cancel button is hit', () => {
    const router: Router = TestBed.get(Router);
    spyOn(router, 'navigate').and.callFake(() => {});
    const cancelButton = fixture.debugElement.query(
      By.css('button.cancel-button')
    );

    cancelButton.triggerEventHandler('click', null);

    expect(router.navigate).toHaveBeenCalled();
  });
});
