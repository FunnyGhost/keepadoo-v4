import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { childComponents } from '../../../test-utilities/test-functions';
import {
  moviesListsQueryMock,
  moviesQueryMock
} from '../../../test-utilities/test-mocks';
import {
  testMovies,
  testMoviestLists
} from '../../../test-utilities/test-objects';
import { MovieComponent } from '../movie/movie.component';
import { MoviesQuery } from '../movies/state/movies.query';
import { MoviesService } from '../movies/state/movies.service';
import { MoviesListsQuery } from '../state/movies-lists.query';
import { MoviesListsService } from '../state/movies-lists.service';
import { MoviesListDetailsComponent } from './movies-list-details.component';

const moviesListsServiceMock = {
  setActive: jest.fn()
};

const moviesServiceMock = {};

const listIdToUse = 'dc-movies';
const activatedRouteMock = {
  paramMap: of({
    get: (key: string) => listIdToUse
  })
};

describe('MoviesListDetailsComponent', () => {
  let component: MoviesListDetailsComponent;
  let fixture: ComponentFixture<MoviesListDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MoviesListDetailsComponent, MockComponent(MovieComponent)],
      providers: [
        {
          provide: MoviesQuery,
          useValue: moviesQueryMock
        },
        {
          provide: MoviesListsQuery,
          useValue: moviesListsQueryMock
        },
        {
          provide: MoviesService,
          useValue: moviesServiceMock
        },
        {
          provide: MoviesListsService,
          useValue: moviesListsServiceMock
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the active movies list', () => {
    expect(moviesListsServiceMock.setActive).toHaveBeenCalledWith(listIdToUse);
  });

  it('should show the movies in in store', () => {
    moviesQueryMock.selectAll.mockReturnValue(of(testMovies));

    component.ngOnInit();
    fixture.detectChanges();

    expect(moviesQueryMock.selectAll).toHaveBeenCalled();
    const movieComponents = childComponents<MovieComponent>(
      fixture,
      MovieComponent
    );
    expect(movieComponents.length).toBe(testMovies.length);
    testMovies.forEach(movie => {
      const element = movieComponents.find(
        movieComponent => movieComponent.movie.id === movie.id
      );
      expect(element).toBeTruthy();
    });
  });

  it('should show the selected list title', () => {
    const moviesListToUse = testMoviestLists[0];
    moviesListsQueryMock.selectActive.mockReturnValue(of(moviesListToUse));

    component.ngOnInit();
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.textContent).toBe(moviesListToUse.name);
  });

  afterEach(() => {
    moviesListsServiceMock.setActive.mockClear();
  });
});
