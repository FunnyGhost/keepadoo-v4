import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { testMovies } from 'apps/keepadoo/src/test-utilities/test-objects';
import { of } from 'rxjs';
import { Movie } from './models/movie';
import { MoviesService } from './movie.service';

const firestoreMock = {
  collection() {}
};

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
});