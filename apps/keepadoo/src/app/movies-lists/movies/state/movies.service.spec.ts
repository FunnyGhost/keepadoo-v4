import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { testMovies } from '../../../../test-utilities/test-objects';
import { Movie } from './models/movie';
import { MoviesService } from './movies.service';

const firestoreMock = {
  collection() {}
};

const listSizeToUse = 34;

const firestoreMockSpy = jest
  .spyOn(firestoreMock, 'collection')
  .mockReturnValue({
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
    }
  });

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MoviesService,
        {
          provide: AngularFirestore,
          useValue: firestoreMock
        }
      ]
    });

    service = TestBed.get(MoviesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
});
