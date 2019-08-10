import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { of, Subject } from 'rxjs';
import { moviesStoreMock } from '../../../../test-utilities/test-mocks';
import {
  testMovies,
  testMovieSearchResults,
  testMoviestLists,
  testUser
} from '../../../../test-utilities/test-objects';
import { SessionQuery } from '../../../state/session.query';
import { MoviesList } from '../../state/models/movies-list';
import { MoviesListsQuery } from '../../state/movies-lists.query';
import { Movie } from './models/movie';
import { MoviesService } from './movies.service';
import { MoviesStore } from './movies.store';

const firestoreMock = {
  collection() {}
};

const addSpy = jest.fn();
const deleteSpy = jest.fn();

jest.spyOn(firestoreMock, 'collection').mockReturnValue({
  valueChanges() {
    {
      return of(testMovies);
    }
  },
  add: addSpy,
  doc() {
    return {
      delete: deleteSpy
    };
  }
} as any);

const sessionQueryMock = {
  userId: () => testUser.userId,
  userId$: new Subject<string>()
};

const activeList = new Subject<MoviesList>();
const moviesListsQueryMock = {
  selectActive: () => activeList.asObservable()
};

describe('MoviesService', () => {
  let service: MoviesService;
  let moviesStore: MoviesStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MoviesService,
        {
          provide: AngularFirestore,
          useValue: firestoreMock
        },
        {
          provide: SessionQuery,
          useValue: sessionQueryMock
        },
        {
          provide: MoviesListsQuery,
          useValue: moviesListsQueryMock
        },
        {
          provide: MoviesStore,
          useValue: moviesStoreMock
        }
      ]
    });

    service = TestBed.get(MoviesService);
    moviesStore = TestBed.get(MoviesStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Listen to the selected list', () => {
    describe('User is logged in', () => {
      beforeEach(() => {
        sessionQueryMock.userId$.next(testUser.userId);
        jest.spyOn(service, 'getMoviesInList').mockReturnValue(of(testMovies));
      });

      it('should populate the store with the movies in the currently selected list', () => {
        activeList.next(testMoviestLists[0]);
        expect(moviesStore.set).toHaveBeenCalledWith(testMovies);
        expect(service.getMoviesInList).toHaveBeenCalledWith(
          testMoviestLists[0].id
        );
      });

      it('should clear the store if there is no selected list', () => {
        activeList.next(undefined);

        expect(moviesStore.set).toHaveBeenLastCalledWith([]);
      });
    });

    describe('User is not logged in', () => {
      beforeEach(() => {
        sessionQueryMock.userId$.next(undefined);
      });
      it('should clear the store', () => {
        expect(moviesStore.set).toHaveBeenLastCalledWith([]);
      });
    });
  });

  describe('getMoviesInList', () => {
    it('should get movies in list', done => {
      service.getMoviesInList('1').subscribe((data: Movie[]) => {
        expect(data).toEqual(testMovies);
        done();
      });
    });
  });

  describe('addMovieToList', () => {
    it('should add the movie to the list', async () => {
      const listId = '123';
      const movieToAdd = testMovieSearchResults[0];

      const added_on = new Date().toISOString();
      await service.addMovieToList(listId, movieToAdd);
      expect(addSpy).toHaveBeenCalledWith({ ...movieToAdd, listId, added_on });
    });
  });

  describe('deleteMovieFromList', () => {
    it('should delete the movie', async () => {
      const movieToDelete = testMovies[0];

      await service.deleteMovie(movieToDelete);
      expect(deleteSpy).toHaveBeenCalled();
      expect(moviesStoreMock.remove).toHaveBeenCalledWith(movieToDelete.id);
    });
  });

  describe('enableEditMode', () => {
    it('should set editMode to true', () => {
      service.enableEditMode();
      expect(moviesStoreMock.update).toHaveBeenCalledWith({ editMode: true });
    });
  });

  describe('disableEditMode', () => {
    it('should set editMode to false', () => {
      service.disableEditMode();
      expect(moviesStoreMock.update).toHaveBeenCalledWith({
        editMode: false
      });
    });
  });

  afterEach(() => {
    moviesStoreMock.set.mockClear();
    moviesStoreMock.update.mockClear();
  });
});
