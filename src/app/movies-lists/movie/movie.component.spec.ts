import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { testMovies } from '../../../test-utilities/test-objects';
import { MovieComponent } from './movie.component';

describe('MovieComponent', () => {
  const movieToUse = testMovies[0];
  let component: MovieComponent;
  let fixture: ComponentFixture<MovieComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({ declarations: [MovieComponent] })
        .overrideComponent(MovieComponent, {
          set: { changeDetection: ChangeDetectionStrategy.Default }
        })
        .compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieComponent);
    component = fixture.componentInstance;
    component.movie = movieToUse;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Render', () => {
    test('should show the movie poster', () => {
      const moviePosters = fixture.debugElement.queryAll(By.css('img.movie-poster'));

      expect(moviePosters.length).toBe(1);
      expect(moviePosters[0].nativeElement.src).toContain(movieToUse.poster_path);
    });
  });

  describe('Edit mode enabled', () => {
    beforeEach(() => {
      component.editMode = true;
      fixture.detectChanges();
    });

    test('should have a delete button', () => {
      const deleteButtons = fixture.debugElement.queryAll(By.css('button.delete-button'));

      expect(deleteButtons.length).toBe(1);
    });

    test('should emit the delete event when the delete button is clicked', () => {
      const deleteButton = fixture.debugElement.query(By.css('button.delete-button'));
      jest.spyOn(component.delete, 'emit');

      deleteButton.triggerEventHandler('click', null);

      expect(component.delete.emit).toHaveBeenCalledWith(component.movie);
    });
  });

  describe('Edit mode disabled', () => {
    beforeEach(() => {
      component.editMode = false;
      fixture.detectChanges();
    });

    test('should not have a delete button', () => {
      const deleteButtons = fixture.debugElement.queryAll(By.css('button.delete-button'));

      expect(deleteButtons.length).toBe(0);
    });
  });
});
