import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, of } from 'rxjs';
import {
  moviesListsStoreMock,
  sessionQueryMock
} from '../../../test-utilities/test-mocks';
import {
  testMovies,
  testMoviestLists,
  testUser
} from '../../../test-utilities/test-objects';
import { SessionQuery } from '../../state/session.query';
import { MoviesService } from '../movies/state/movie.service';
import { MoviesList } from './models/movies-list';
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

const firestoreMockSpy = jest
  .spyOn(firestoreMock, 'collection')
  .mockReturnValue({
    auditTrail() {
      {
        return of([
          {
            payload: {
              doc: {
                id: testMoviestLists[0].id,
                data: () => testMoviestLists[0]
              }
            }
          },
          {
            payload: {
              doc: {
                id: testMoviestLists[1].id,
                data: () => testMoviestLists[1]
              }
            }
          }
        ]);
      }
    },
    doc() {
      return docObject;
    }
  });

const sessionStoreQueryMock = {
  userId: () => testUser.userId,
  userId$: new BehaviorSubject<string>(testUser.userId)
};

const moviesServiceMock = {
  getMoviesInList: jest.fn().mockReturnValue(of(testMovies))
};

describe('MoviesListsService', () => {
  let moviesListsService: MoviesListsService;
  let moviesListsStore: MoviesListsStore;
  let firestoreService: AngularFirestore;
  let sessionQuery: SessionQuery;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MoviesListsService,
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
        }
      ],
      imports: [HttpClientTestingModule]
    });

    moviesListsService = TestBed.get(MoviesListsService);
    moviesListsStore = TestBed.get(MoviesListsStore);
    firestoreService = TestBed.get(AngularFirestore);
    sessionQuery = TestBed.get(SessionQuery);

    firestoreMockSpy.mockClear();
  });

  it('should be created', () => {
    expect(moviesListsService).toBeDefined();
  });

  describe('fetch', () => {
    it('should get all the movies lists for the logged in user', () => {
      const expectedLimit = 4;
      sessionStoreQueryMock.userId$.next('batman');
      expect(firestoreMockSpy).toHaveBeenCalledWith(
        'movies-lists',
        expect.any(Function)
      );
      expect(moviesListsStoreMock.set).toHaveBeenCalledWith(testMoviestLists);
      testMoviestLists.forEach((list: MoviesList) => {
        expect(moviesServiceMock.getMoviesInList).toHaveBeenCalledWith(
          list.id,
          expectedLimit
        );
        expect(moviesListsStoreMock.update).toHaveBeenCalledWith(list.id, {
          lastMovies: testMovies
        });
      });
    });

    it('should clear the store if the user logs out', () => {
      spyOn(firestoreMock, 'collection').and.callThrough();
      sessionStoreQueryMock.userId$.next('');

      expect(firestoreMockSpy).not.toHaveBeenCalledWith(
        'movies-lists',
        expect.any(Function)
      );
      expect(moviesListsStoreMock.set).toHaveBeenCalledWith([]);
    });
  });

  describe('add', () => {
    it('should add the movies list', async () => {
      sessionStoreQueryMock.userId$.next('batman');
      sessionQueryMock.userId.mockReturnValue(testUser.userId);
      const idToUse = '52';
      jest.spyOn(firestoreService, 'createId').mockReturnValue(idToUse);
      const moviesListToAdd: Partial<MoviesList> = {
        name: 'awesome movies'
      };
      const expectedMoviesList: MoviesList = {
        id: idToUse,
        name: 'awesome movies',
        userId: testUser.userId
      };

      await moviesListsService.add(moviesListToAdd);
      expect(docObject.set).toHaveBeenCalledWith(expectedMoviesList);
      expect(moviesListsStoreMock.add).toHaveBeenCalledWith(expectedMoviesList);
    });
  });

  describe('update', () => {
    it('should update the movies list', async () => {
      sessionStoreQueryMock.userId$.next('batman');
      sessionQueryMock.userId.mockReturnValue(testUser.userId);
      const idToUse = '52';

      const moviesListToUpdate: MoviesList = {
        id: idToUse,
        name: 'awesome movies',
        userId: testUser.userId
      };

      await moviesListsService.update(idToUse, moviesListToUpdate);

      expect(docObject.update).toHaveBeenCalledWith(moviesListToUpdate);
      expect(moviesListsStoreMock.update).toHaveBeenCalledWith(
        idToUse,
        moviesListToUpdate
      );
    });
  });

  describe('remove', () => {
    it('should remove the movies list', async () => {
      sessionStoreQueryMock.userId$.next('batman');
      sessionQueryMock.userId.mockReturnValue(testUser.userId);
      const idToUse = '52';

      await moviesListsService.remove(idToUse);

      expect(docObject.delete).toHaveBeenCalled();
      expect(moviesListsStoreMock.remove).toHaveBeenCalledWith(idToUse);
    });
  });

  describe('setActive', () => {
    it('should set the passed movies list id as active', () => {
      sessionStoreQueryMock.userId$.next('batman');
      sessionQueryMock.userId.mockReturnValue(testUser.userId);
      const idToUse = '52';

      moviesListsService.setActive(idToUse);

      expect(moviesListsStoreMock.setActive).toHaveBeenCalledWith(idToUse);
    });
  });

  describe('removeActive', () => {
    it('should remove the passed movies list id as active', () => {
      sessionStoreQueryMock.userId$.next('batman');
      sessionQueryMock.userId.mockReturnValue(testUser.userId);
      const idToUse = '52';

      moviesListsService.removeActive(idToUse);

      expect(moviesListsStoreMock.removeActive).toHaveBeenCalledWith(idToUse);
    });
  });
});
