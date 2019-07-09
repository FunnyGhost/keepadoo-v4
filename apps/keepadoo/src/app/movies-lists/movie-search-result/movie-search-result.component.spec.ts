import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { testMovieSearchResults } from '../../../test-utilities/test-objects';
import { MovieSearchResultComponent } from './movie-search-result.component';

const movieSearchResultToUse = testMovieSearchResults[0];

describe('MovieSearchResultComponent', () => {
  let component: MovieSearchResultComponent;
  let fixture: ComponentFixture<MovieSearchResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MovieSearchResultComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieSearchResultComponent);
    component = fixture.componentInstance;
    component.movie = movieSearchResultToUse;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Render', () => {
    it('should show the movie title', () => {
      const movieTitleElements = fixture.debugElement.queryAll(By.css('h4'));

      expect(movieTitleElements.length).toBe(1);
      expect(movieTitleElements[0].nativeElement.innerHTML).toContain(
        movieSearchResultToUse.title
      );
    });

    it('should show the movie year', () => {
      const movieYearElements = fixture.debugElement.queryAll(
        By.css('div.year')
      );

      expect(movieYearElements.length).toBe(1);
      expect(movieYearElements[0].nativeElement.innerHTML).toContain(
        new Date(+movieSearchResultToUse.release_date).getFullYear()
      );
    });

    it('should show the movie poster', () => {
      const moviePosters = fixture.debugElement.queryAll(
        By.css('img.movie-poster')
      );

      expect(moviePosters.length).toBe(1);
      expect(moviePosters[0].nativeElement.src).toContain(
        movieSearchResultToUse.poster_path
      );
    });

    it('should show the movie overview', () => {
      const movieOverviewElements = fixture.debugElement.queryAll(
        By.css('section.movie-overview')
      );

      expect(movieOverviewElements.length).toBe(1);
      expect(movieOverviewElements[0].nativeElement.innerHTML).toContain(
        movieSearchResultToUse.overview
      );
    });
  });

  it('should emit when a movie is clicked', () => {
    jest.spyOn(component.selectedMovie, 'emit');
    const movieElement = fixture.debugElement.query(
      By.css('.search-result-container')
    );

    movieElement.triggerEventHandler('click', null);

    expect(component.selectedMovie.emit).toHaveBeenCalledWith(
      movieSearchResultToUse
    );
  });
});
