import { ChangeDetectionStrategy } from '@angular/core';
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

const moviesServiceMock = {
  enableEditMode: jest.fn(),
  disableEditMode: jest.fn(),
  deleteMovie: jest.fn()
};

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
    })
      .overrideComponent(MoviesListDetailsComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesListDetailsComponent);
    component = fixture.componentInstance;
    moviesQueryMock.select.mockReturnValue(of({ editMode: false }));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the active movies list', () => {
    expect(moviesListsServiceMock.setActive).toHaveBeenCalledWith(listIdToUse);
  });

  describe('Render', () => {
    it('should show the movies in store', () => {
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
      expect(title.nativeElement.textContent.trim()).toBe(moviesListToUse.name);
    });
  });

  describe('EditMode is on', () => {
    beforeEach(() => {
      moviesQueryMock.selectAll.mockReturnValue(of(testMovies));
      moviesQueryMock.select.mockReturnValue(of({ editMode: true }));

      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should show the movies in edit mode', () => {
      const movieComponents = childComponents<MovieComponent>(
        fixture,
        MovieComponent
      );
      movieComponents.forEach(movieComponent => {
        expect(movieComponent.editMode).toBe(true);
      });
    });

    it('should not show the edit button', () => {
      const editButtons = fixture.debugElement.queryAll(
        By.css('button.edit-button')
      );

      expect(editButtons.length).toBe(0);
    });

    it('should delete a movie when the delete event is triggered', () => {
      const moviesService: MoviesService = TestBed.get(MoviesService);
      const movieComponents = childComponents<MovieComponent>(
        fixture,
        MovieComponent
      );
      const movieToDelete = testMovies[0];

      movieComponents[0].delete.emit(movieToDelete);

      expect(moviesService.deleteMovie).toHaveBeenCalledWith(movieToDelete);
    });

    it('should disable edit mode when done button is clicked', () => {
      const doneButton = fixture.debugElement.query(
        By.css('button.done-button')
      );
      const moviesService: MoviesService = TestBed.get(MoviesService);

      doneButton.triggerEventHandler('click', null);

      expect(moviesService.disableEditMode).toHaveBeenCalled();
    });
  });

  describe('EditMode is off', () => {
    beforeEach(() => {
      moviesQueryMock.selectAll.mockReturnValue(of(testMovies));
      moviesQueryMock.select.mockReturnValue(of({ editMode: false }));

      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not show the movies in edit mode', () => {
      const movieComponents = childComponents<MovieComponent>(
        fixture,
        MovieComponent
      );
      movieComponents.forEach(movieComponent => {
        expect(movieComponent.editMode).toBe(false);
      });
    });

    it('should not show the done button', () => {
      const doneButtons = fixture.debugElement.queryAll(
        By.css('button.done-button')
      );

      expect(doneButtons.length).toBe(0);
    });

    it('should enable edit mode when edit button is clicked', () => {
      const editButton = fixture.debugElement.query(
        By.css('button.edit-button')
      );
      const moviesService: MoviesService = TestBed.get(MoviesService);

      editButton.triggerEventHandler('click', null);

      expect(moviesService.enableEditMode).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    moviesListsServiceMock.setActive.mockClear();
  });
});
