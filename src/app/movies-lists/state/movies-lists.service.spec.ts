import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, of } from 'rxjs';
import {
  moviesListsQueryMock,
  moviesListsStoreMock,
  sessionQueryMock
} from '../../../test-utilities/test-mocks';
import {
  testMovieSearchResults,
  testMoviesLists,
  testUser
} from '../../../test-utilities/test-objects';
import { SessionQuery } from '../../state/session.query';
import { MoviesService } from '../movies/state/movies.service';
import { MoviesList } from './models/movies-list';
import { MoviesListsQuery } from './movies-lists.query';
import { MoviesListsService } from './movies-lists.service';
import { MoviesListsStore } from './movies-lists.store';
import { HotToastService } from '@ngneat/hot-toast';

const docObject = {
  set: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};
const firestoreMock = {
  createId() {
  },
  collection() {
  }
};

const firestoreMockSpy = jest.spyOn(firestoreMock, 'collection').mockReturnValue({
  valueChanges() {
    return of(testMoviesLists);
  },
  doc() {
    return docObject;
  }
} as any);

const sessionStoreQueryMock = {
  userId: () => testUser.userId,
  userId$: new BehaviorSubject<string>(testUser.userId)
};

const moviesServiceMock = {
  addMovieToList: jest.fn().mockReturnValue(of({})),
  deleteMoviesInList: () => {
  }
};

const notificationServiceMock = {
  error: () => {
  },
  success: () => {
  }
};

describe('MoviesListsService', () => {
  let moviesListsService: MoviesListsService;
  let moviesListsStore: MoviesListsStore;
  let firestoreService: AngularFirestore;
  let sessionQuery: SessionQuery;
  let notificationService: HotToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MoviesListsService,
        {
          provide: MoviesListsQuery,
          useValue: moviesListsQueryMock
        },
        {
          provide: MoviesListsStore,
          useValue: moviesListsStoreMock
        },
        {
          provide: AngularFirestore,
          useValue: firestoreMock
        },
        {
          provide: SessionQuery,
          useValue: sessionStoreQueryMock
        },
        {
          provide: MoviesService,
          useValue: moviesServiceMock
        },
        {
          provide: HotToastService,
          useValue: notificationServiceMock
        }
      ],
      imports: [HttpClientTestingModule]
    });

    moviesListsService = TestBed.inject(MoviesListsService);
    moviesListsStore = TestBed.inject(MoviesListsStore);
    firestoreService = TestBed.inject(AngularFirestore);
    sessionQuery = TestBed.inject(SessionQuery);
    notificationService = TestBed.inject(HotToastService);

    firestoreMockSpy.mockClear();
  });

  test('should be created', () => {
    expect(moviesListsService).toBeDefined();
  });

  describe('fetch', () => {
    test('should get all the movies lists for the logged in user', () => {
      sessionStoreQueryMock.userId$.next('batman');
      expect(firestoreMockSpy).toHaveBeenCalledWith('movies-lists', expect.any(Function));
      expect(moviesListsStoreMock.set).toHaveBeenCalledWith(testMoviesLists);
    });

    test('should clear the store if the user logs out', () => {
      spyOn(firestoreMock, 'collection').and.callThrough();
      sessionStoreQueryMock.userId$.next('');

      expect(firestoreMockSpy).not.toHaveBeenCalledWith('movies-lists', expect.any(Function));
      expect(moviesListsStoreMock.set).toHaveBeenCalledWith([]);
    });
  });

  describe('add', () => {
    test('should add the movies list', async () => {
      sessionStoreQueryMock.userId$.next('batman');
      sessionQueryMock.userId.mockReturnValue(testUser.userId);
      const idToUse = '52';
      jest.spyOn(firestoreService, 'createId').mockReturnValue(idToUse);
      jest.spyOn(notificationService, 'success');
      const moviesListToAdd: Partial<MoviesList> = {
        name: 'awesome movies'
      };
      const expectedMoviesList = {
        id: idToUse,
        name: 'awesome movies',
        userId: testUser.userId,
        moviesCount: 0,
        recentMovies: []
      } as MoviesList;

      await moviesListsService.add(moviesListToAdd);
      expect(docObject.set).toHaveBeenCalledWith(expectedMoviesList);
      expect(moviesListsStoreMock.setLoading).toHaveBeenCalledWith(true);
      expect(moviesListsStoreMock.add).toHaveBeenCalledWith(expectedMoviesList);
      expect(moviesListsStoreMock.setLoading).toHaveBeenCalledWith(false);
      expect(moviesListsStoreMock.setError).not.toHaveBeenCalled();
      expect(notificationService.success).toHaveBeenCalledWith(
        expect.any(String), { duration: 3000 }
      );
    });

    test('should handle errors if adding a movies list fails', async () => {
      sessionStoreQueryMock.userId$.next('batman');
      sessionQueryMock.userId.mockReturnValue(testUser.userId);
      const idToUse = '52';
      jest.spyOn(firestoreService, 'createId').mockReturnValue(idToUse);
      jest.spyOn(notificationService, 'error');
      const errorToUse = new Error('HahhahahaHahAHhAh!');
      docObject.set.mockImplementationOnce(() => {
        throw errorToUse;
      });
      const moviesListToAdd: Partial<MoviesList> = {
        name: 'awesome movies'
      };

      await moviesListsService.add(moviesListToAdd);

      expect(moviesListsStoreMock.setLoading).toHaveBeenCalledWith(true);
      expect(moviesListsStoreMock.setLoading).toHaveBeenCalledWith(false);
      expect(moviesListsStoreMock.setError).toHaveBeenCalledWith(errorToUse);
      expect(notificationService.error).toHaveBeenCalledWith(
        expect.any(String), { duration: 3000 }
      );
    });
  });

  describe('update', () => {
    test('should update the movies list', async () => {
      jest.spyOn(notificationService, 'success');
      sessionStoreQueryMock.userId$.next('batman');
      sessionQueryMock.userId.mockReturnValue(testUser.userId);
      const idToUse = '52';

      const moviesListToUpdate = {
        id: idToUse,
        name: 'awesome movies',
        userId: testUser.userId,
        moviesCount: 0
      } as MoviesList;

      await moviesListsService.update(idToUse, moviesListToUpdate);

      expect(docObject.update).toHaveBeenCalledWith(moviesListToUpdate);
      expect(moviesListsStoreMock.update).toHaveBeenCalledWith(idToUse, moviesListToUpdate);
      expect(notificationService.success).toHaveBeenCalledWith(
        expect.any(String), { duration: 3000 }
      );
    });
  });

  describe('remove', () => {
    test('should remove the movies list', async () => {
      jest.spyOn(notificationService, 'success');
      const idToUse = '52';

      await moviesListsService.remove(idToUse);

      expect(docObject.delete).toHaveBeenCalled();
      expect(notificationService.success).toHaveBeenCalledWith(
        expect.any(String), { duration: 3000 }
      );
    });

    test('should remove the movies in the list', async () => {
      const moviesService: MoviesService = TestBed.inject(MoviesService);
      jest.spyOn(moviesService, 'deleteMoviesInList');
      const idToUse = '52';

      await moviesListsService.remove(idToUse);

      expect(moviesService.deleteMoviesInList).toHaveBeenCalledWith(idToUse);
    });
  });

  describe('setActive', () => {
    test('should set the passed movies list id as active', () => {
      sessionStoreQueryMock.userId$.next('batman');
      sessionQueryMock.userId.mockReturnValue(testUser.userId);
      const idToUse = '52';

      moviesListsService.setActive(idToUse);

      expect(moviesListsStoreMock.setActive).toHaveBeenCalledWith(idToUse);
    });
  });

  describe('removeActive', () => {
    test('should remove the passed movies list id as active', () => {
      sessionStoreQueryMock.userId$.next('batman');
      sessionQueryMock.userId.mockReturnValue(testUser.userId);
      const idToUse = '52';

      moviesListsService.removeActive(idToUse);

      expect(moviesListsStoreMock.removeActive).toHaveBeenCalledWith(idToUse);
    });
  });

  describe('addMovieToCurrentList', () => {
    test('should add the movie to the current list', () => {
      jest.spyOn(notificationService, 'success');
      const moviesService: MoviesService = TestBed.inject(MoviesService);
      const selectedList = '123';
      const movieToAdd = testMovieSearchResults[0];
      moviesListsQueryMock.getActive.mockReturnValue({
        id: selectedList
      } as MoviesList);
      jest.spyOn(moviesListsService, 'fetch');

      moviesListsService.addMovieToCurrentList(movieToAdd);

      expect(moviesService.addMovieToList).toHaveBeenCalledWith(selectedList, movieToAdd);
      expect(moviesListsService.fetch).toHaveBeenCalled();
      expect(notificationService.success).toHaveBeenCalledWith(
        expect.any(String), { duration: 3000 }
      );
    });
  });
});
