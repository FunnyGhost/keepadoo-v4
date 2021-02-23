import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { of, Subject } from 'rxjs';
import { moviesStoreMock } from '../../../../test-utilities/test-mocks';
import {
  testMovies,
  testMovieSearchResults,
  testMoviesLists,
  testUser
} from '../../../../test-utilities/test-objects';
import { SessionQuery } from '../../../state/session.query';
import { MoviesList } from '../../state/models/movies-list';
import { MoviesListsQuery } from '../../state/movies-lists.query';
import { Movie } from './models/movie';
import { MoviesService } from './movies.service';
import { MoviesStore } from './movies.store';
import { HotToastService } from '@ngneat/hot-toast';

const firestoreMock = {
  collection() {}
};

const addSpy = jest.fn();
const deleteSpy = jest.fn();

const deleteMovieInListSpy = jest.fn().mockReturnValue(of());
jest.spyOn(firestoreMock, 'collection').mockReturnValue({
  valueChanges() {
    {
      return of(testMovies);
    }
  },
  snapshotChanges() {
    {
      return of([
        {
          payload: {
            doc: {
              ref: {
                delete: deleteMovieInListSpy
              }
            }
          }
        }
      ]);
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

const notificationServiceMock = {
  error: () => {},
  success: () => {}
};

describe('MoviesService', () => {
  let service: MoviesService;
  let moviesStore: MoviesStore;
  let notificationService: HotToastService;

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
        },
        {
          provide: HotToastService,
          useValue: notificationServiceMock
        }
      ]
    });

    service = TestBed.inject(MoviesService);
    moviesStore = TestBed.inject(MoviesStore);
    notificationService = TestBed.inject(HotToastService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Listen to the selected list', () => {
    describe('User is logged in', () => {
      beforeEach(() => {
        sessionQueryMock.userId$.next(testUser.userId);
        jest.spyOn(service, 'getMoviesInList').mockReturnValue(of(testMovies));
      });

      test('should populate the store with the movies in the currently selected list', () => {
        activeList.next(testMoviesLists[0]);
        expect(moviesStore.set).toHaveBeenCalledWith(testMovies);
        expect(service.getMoviesInList).toHaveBeenCalledWith(testMoviesLists[0].id);
      });

      test('should clear the store if there is no selected list', () => {
        activeList.next(undefined);

        expect(moviesStore.set).toHaveBeenCalledWith([]);
      });
    });

    describe('User is not logged in', () => {
      beforeEach(() => {
        sessionQueryMock.userId$.next(undefined);
      });
      test('should clear the store', () => {
        expect(moviesStore.set).toHaveBeenCalledWith([]);
      });
    });
  });

  describe('getMoviesInList', () => {
    test('should get movies in list', (done) => {
      service.getMoviesInList('1').subscribe((data: Movie[]) => {
        expect(data).toEqual(testMovies);
        done();
      });
    });
  });

  describe('addMovieToList', () => {
    test('should add the movie to the list', async () => {
      const listId = '123';
      const movieToAdd = testMovieSearchResults[0];

      await service.addMovieToList(listId, movieToAdd);
      expect(addSpy).toHaveBeenCalledWith({
        ...movieToAdd,
        listId,
        added_on: expect.any(String)
      });
    });
  });

  describe('deleteMovie', () => {
    test('should delete the movie', async () => {
      jest.spyOn(notificationService, 'success');
      const movieToDelete = testMovies[0];

      await service.deleteMovie(movieToDelete);
      expect(deleteSpy).toHaveBeenCalled();
      expect(moviesStoreMock.remove).toHaveBeenCalledWith(movieToDelete.id);
      expect(notificationService.success).toHaveBeenCalledWith(expect.any(String), {
        duration: 3000
      });
    });
  });

  describe('deleteMoviesInList', () => {
    test('should delete the movies in the list', async () => {
      const listId = 'list-id-here';

      await service.deleteMoviesInList(listId);
      expect(deleteMovieInListSpy).toHaveBeenCalled();
    });
  });

  describe('enableEditMode', () => {
    test('should set editMode to true', () => {
      service.enableEditMode();
      expect(moviesStoreMock.update).toHaveBeenCalledWith({ editMode: true });
    });
  });

  describe('disableEditMode', () => {
    test('should set editMode to false', () => {
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
