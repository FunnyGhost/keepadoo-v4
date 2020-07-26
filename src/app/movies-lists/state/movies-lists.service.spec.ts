import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgxNotificationMsgService, NgxNotificationStatusMsg } from 'ngx-notification-msg';
import { BehaviorSubject, of } from 'rxjs';
import {
  moviesListsQueryMock,
  moviesListsStoreMock,
  sessionQueryMock
} from '../../../test-utilities/test-mocks';
import {
  testMovieSearchResults,
  testMoviestLists,
  testUser
} from '../../../test-utilities/test-objects';
import { SessionQuery } from '../../state/session.query';
import { MoviesService } from '../movies/state/movies.service';
import { MoviesList } from './models/movies-list';
import { MoviesListsQuery } from './movies-lists.query';
import { MoviesListsService } from './movies-lists.service';
import { MoviesListsStore } from './movies-lists.store';

const docObject = {
  set: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};
const firestoreMock = {
  createId() {},
  collection() {}
};

const firestoreMockSpy = jest.spyOn(firestoreMock, 'collection').mockReturnValue({
  valueChanges() {
    return of(testMoviestLists);
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
  deleteMoviesInList: () => {}
};

const notificationServiceMock = {
  open: () => {}
};

describe('MoviesListsService', () => {
  let moviesListsService: MoviesListsService;
  let moviesListsStore: MoviesListsStore;
  let firestoreService: AngularFirestore;
  let sessionQuery: SessionQuery;
  let notificationService: NgxNotificationMsgService;

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
          provide: NgxNotificationMsgService,
          useValue: notificationServiceMock
        }
      ],
      imports: [HttpClientTestingModule]
    });

    moviesListsService = TestBed.get(MoviesListsService);
    moviesListsStore = TestBed.get(MoviesListsStore);
    firestoreService = TestBed.get(AngularFirestore);
    sessionQuery = TestBed.get(SessionQuery);
    notificationService = TestBed.get(NgxNotificationMsgService);

    firestoreMockSpy.mockClear();
  });

  test('should be created', () => {
    expect(moviesListsService).toBeDefined();
  });

  describe('fetch', () => {
    test('should get all the movies lists for the logged in user', () => {
      sessionStoreQueryMock.userId$.next('batman');
      expect(firestoreMockSpy).toHaveBeenCalledWith('movies-lists', expect.any(Function));
      expect(moviesListsStoreMock.set).toHaveBeenCalledWith(testMoviestLists);
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
      jest.spyOn(notificationService, 'open');
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
      expect(notificationService.open).toHaveBeenCalledWith({
        status: NgxNotificationStatusMsg.SUCCESS,
        header: expect.any(String),
        msg: expect.any(String)
      });
    });

    test('should handle errors if adding a movies list fails', async () => {
      sessionStoreQueryMock.userId$.next('batman');
      sessionQueryMock.userId.mockReturnValue(testUser.userId);
      const idToUse = '52';
      jest.spyOn(firestoreService, 'createId').mockReturnValue(idToUse);
      jest.spyOn(notificationService, 'open');
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
      expect(notificationService.open).toHaveBeenCalledWith({
        status: NgxNotificationStatusMsg.FAILURE,
        header: expect.any(String),
        msg: expect.any(String)
      });
    });
  });

  describe('update', () => {
    test('should update the movies list', async () => {
      jest.spyOn(notificationService, 'open');
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
      expect(notificationService.open).toHaveBeenCalledWith({
        status: NgxNotificationStatusMsg.SUCCESS,
        header: expect.any(String),
        msg: expect.any(String)
      });
    });
  });

  describe('remove', () => {
    test('should remove the movies list', async () => {
      jest.spyOn(notificationService, 'open');
      const idToUse = '52';

      await moviesListsService.remove(idToUse);

      expect(docObject.delete).toHaveBeenCalled();
      expect(notificationService.open).toHaveBeenCalledWith({
        status: NgxNotificationStatusMsg.SUCCESS,
        header: expect.any(String),
        msg: expect.any(String)
      });
    });

    test('should remove the movies in the list', async () => {
      const moviesService: MoviesService = TestBed.get(MoviesService);
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
      jest.spyOn(notificationService, 'open');
      const moviesService: MoviesService = TestBed.get(MoviesService);
      const selectedList = '123';
      const movieToAdd = testMovieSearchResults[0];
      moviesListsQueryMock.getActive.mockReturnValue({
        id: selectedList
      } as MoviesList);
      jest.spyOn(moviesListsService, 'fetch');

      moviesListsService.addMovieToCurrentList(movieToAdd);

      expect(moviesService.addMovieToList).toHaveBeenCalledWith(selectedList, movieToAdd);
      expect(moviesListsService.fetch).toHaveBeenCalled();
      expect(notificationService.open).toHaveBeenCalledWith({
        status: NgxNotificationStatusMsg.SUCCESS,
        header: expect.any(String),
        msg: expect.any(String)
      });
    });
  });
});
