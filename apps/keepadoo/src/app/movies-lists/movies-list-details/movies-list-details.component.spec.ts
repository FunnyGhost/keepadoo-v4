import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { moviesQueryMock } from '../../../test-utilities/test-mocks';
import { testMovies } from '../../../test-utilities/test-objects';
import { MoviesQuery } from '../movies/state/movies.query';
import { MoviesService } from '../movies/state/movies.service';
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
      declarations: [MoviesListDetailsComponent],
      providers: [
        {
          provide: MoviesQuery,
          useValue: moviesQueryMock
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

    const movieElements = fixture.debugElement.queryAll(By.css('.movie'));
    expect(moviesQueryMock.selectAll).toHaveBeenCalled();
    expect(movieElements.length).toBe(testMovies.length);
  });

  afterEach(() => {
    moviesListsServiceMock.setActive.mockClear();
  });
});
