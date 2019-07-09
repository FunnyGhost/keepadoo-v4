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

const listSizeToUse = 34;
const addSpy = jest.fn();

jest.spyOn(firestoreMock, 'collection').mockReturnValue({
  snapshotChanges() {
    {
      return of([
        {
          payload: {
            doc: {
              id: testMovies[0].id,
              data: () => testMovies[0]
            }
          }
        },
        {
          payload: {
            doc: {
              id: testMovies[1].id,
              data: () => testMovies[1]
            }
          }
        }
      ]);
    }
  },
  get() {
    return of({ size: listSizeToUse });
  },
  add: addSpy
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
      service.getMoviesInList('1', 2).subscribe((data: Movie[]) => {
        expect(data.length).toBe(2);
        expect(data[0]).toEqual(testMovies[0]);
        expect(data[1]).toEqual(testMovies[1]);
        done();
      });
    });
  });

  describe('getNumberOfMoviesInList', () => {
    it('should return the number of movies in list', done => {
      service.getNumberOfMoviesInList('1').subscribe((data: number) => {
        expect(data).toBe(listSizeToUse);
        done();
      });
    });
  });

  describe('addMovieToList', () => {
    it('should add the movie to the list', async () => {
      const listId = '123';
      const movieToAdd = testMovieSearchResults[0];

      await service.addMovieToList(listId, movieToAdd);
      expect(addSpy).toHaveBeenCalledWith({ ...movieToAdd, listId });
    });
  });

  afterEach(() => {
    moviesStoreMock.set.mockClear();
  });
});
