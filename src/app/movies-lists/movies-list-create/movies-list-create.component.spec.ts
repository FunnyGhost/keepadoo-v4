import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MoviesListsQuery } from '../state/movies-lists.query';
import { MoviesListsService } from '../state/movies-lists.service';
import { MoviesListCreateComponent } from './movies-list-create.component';

const queryMock = {
  error: new BehaviorSubject<string | null>(null),
  selectError(): Observable<string | null> {
    return this.error.asObservable();
  },
  loading: new BehaviorSubject<boolean>(false),
  selectLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }
};

const moviesListsServiceMock = {
  add: () => of()
};

describe('MoviesListCreateComponent', () => {
  let component: MoviesListCreateComponent;
  let fixture: ComponentFixture<MoviesListCreateComponent>;
  let moviesListService: MoviesListsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [MoviesListCreateComponent],
      providers: [
        {
          provide: MoviesListsService,
          useValue: moviesListsServiceMock
        },
        {
          provide: MoviesListsQuery,
          useValue: queryMock
        }
      ]
    })
      .overrideComponent(MoviesListCreateComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesListCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    moviesListService = TestBed.get(MoviesListsService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should create the movies list', () => {
    const router: Router = TestBed.get(Router);
    spyOn(router, 'navigate');

    const listNameToUse = 'batman stuff';
    const nameInput = fixture.debugElement.query(By.css('input[type=text]'));
    const createButton = fixture.debugElement.query(By.css('.create-button'));
    jest.spyOn(moviesListService, 'add');

    nameInput.nativeElement.value = listNameToUse;
    nameInput.nativeElement.dispatchEvent(new Event('input'));

    createButton.triggerEventHandler('click', null);

    expect(moviesListService.add).toHaveBeenCalledWith({
      name: listNameToUse
    });
  });

  describe('list-name', () => {
    let errors = {};
    let listName: AbstractControl;

    beforeEach(() => {
      errors = {};
      listName = component.moviesListForm.controls['name'];
    });

    test('should be invalid if empty', () => {
      expect(listName.valid).toBeFalsy();

      errors = listName.errors || {};
      expect(errors['required']).toBeTruthy();
    });

    test('should be invalid if value is less than 2 characters long', () => {
      listName.setValue('t');
      errors = listName.errors || {};

      expect(errors['required']).toBeFalsy();
      expect(errors['minlength']).toBeTruthy();
    });

    test('should be valid if value is longer than 2 characters', () => {
      listName.setValue('somelongpassword');
      errors = listName.errors || {};

      expect(errors['required']).toBeFalsy();
      expect(errors['minlength']).toBeFalsy();
    });
  });

  describe('CreateButton', () => {
    test('should be enabled if the form is valid', () => {
      const email = component.moviesListForm.controls['name'];
      email.setValue('batman stuff');

      fixture.detectChanges();
      const createButton = fixture.debugElement.query(By.css('.create-button'));

      expect(createButton.nativeElement.disabled).toBeFalsy();
    });

    test('should be disabled if the form is invalid', () => {
      const email = component.moviesListForm.controls['name'];
      email.setValue('');

      fixture.detectChanges();
      const createButton = fixture.debugElement.query(By.css('.create-button'));

      expect(createButton.nativeElement.disabled).toBeTruthy();
    });
  });

  describe('Error', () => {
    test('should not be visible if there is no error', () => {
      queryMock.error.next(null);

      const errorElements = fixture.debugElement.queryAll(By.css('.error'));

      expect(errorElements.length).toBe(0);
    });

    test('should be visible if there is an error', () => {
      const errorToUse = 'Invalid username/password';
      queryMock.error.next(errorToUse);
      fixture.detectChanges();

      const errorElements = fixture.debugElement.queryAll(By.css('.error'));

      expect(errorElements.length).toBe(1);
      expect(errorElements[0].nativeElement.innerHTML).toContain(errorToUse);
    });
  });

  describe('Loading', () => {
    describe('isNotLoading', () => {
      beforeEach(() => {
        queryMock.loading.next(false);
        fixture.detectChanges();
      });

      test('should not show the loading image', () => {
        const loadingImage = fixture.debugElement.queryAll(By.css('.loading-image'));
        expect(loadingImage.length).toBe(0);
      });

      test('should show the create button text', () => {
        const createButtonText = fixture.debugElement.queryAll(By.css('.create-button-text'));
        expect(createButtonText.length).toBe(1);
      });
    });

    describe('isLoading', () => {
      beforeEach(() => {
        queryMock.loading.next(true);
        fixture.detectChanges();
      });

      test('should show the loading image', () => {
        const loadingImage = fixture.debugElement.queryAll(By.css('.loading-image'));
        expect(loadingImage.length).toBe(1);
      });

      test('should not show the create button text', () => {
        const createButtonText = fixture.debugElement.queryAll(By.css('.create-button-text'));
        expect(createButtonText.length).toBe(0);
      });
    });
  });
});
