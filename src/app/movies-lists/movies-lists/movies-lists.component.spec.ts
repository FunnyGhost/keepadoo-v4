import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { moviesListsQueryMock, routerMock } from '../../../test-utilities/test-mocks';
import { testMoviestLists } from '../../../test-utilities/test-objects';
import { MoviesListComponent } from '../movies-list/movies-list.component';
import { MoviesListsQuery } from '../state/movies-lists.query';
import { MoviesListsService } from '../state/movies-lists.service';
import { MoviesListsComponent } from './movies-lists.component';

const moviesListsServiceMock = {};

describe('MoviesListsComponent', () => {
  let component: MoviesListsComponent;
  let fixture: ComponentFixture<MoviesListsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MoviesListsComponent, MockComponent(MoviesListComponent)],
      providers: [
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: MoviesListsQuery,
          useValue: moviesListsQueryMock
        },
        {
          provide: MoviesListsService,
          useValue: moviesListsServiceMock
        }
      ]
    })
      .overrideComponent(MoviesListsComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should show all lists', () => {
    moviesListsQueryMock.selectAll.mockReturnValue(of(testMoviestLists));

    component.ngOnInit();
    fixture.detectChanges();

    const moviesListsElements = fixture.debugElement.queryAll(By.directive(MoviesListComponent));
    expect(moviesListsElements.length).toBe(testMoviestLists.length);
    const helperText = fixture.debugElement.query(By.css('.helper-text'));
    expect(helperText).toBeFalsy();
  });

  test('should show a helper text if the user has no lists', () => {
    moviesListsQueryMock.selectAll.mockReturnValue(of([]));

    component.ngOnInit();
    fixture.detectChanges();

    const helperText = fixture.debugElement.query(By.css('.helper-text'));

    expect(helperText).toBeTruthy();
  });

  test('should navigate to the list details', () => {
    moviesListsQueryMock.selectAll.mockReturnValue(of(testMoviestLists));

    component.ngOnInit();
    fixture.detectChanges();

    const listId = testMoviestLists[0].id;
    const moviesListsElements = fixture.debugElement
      .queryAll(By.directive(MoviesListComponent))
      .map(el => el.componentInstance);
    (moviesListsElements[0] as MoviesListComponent).listClick.emit(listId);

    expect(routerMock.navigate).toHaveBeenCalledWith([`/home/movies-lists/${listId}`]);
  });
});
