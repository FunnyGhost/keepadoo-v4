import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import {
  moviesListsQueryMock,
  routerMock
} from '../../../test-utilities/test-mocks';
import { testMoviestLists } from '../../../test-utilities/test-objects';
import { MoviesListComponent } from '../movies-list/movies-list.component';
import { MoviesListsQuery } from '../state/movies-lists.query';
import { MoviesListsService } from '../state/movies-lists.service';
import { MoviesListsComponent } from './movies-lists.component';

const moviesListsServiceMock = {};

describe('MoviesListsComponent', () => {
  let component: MoviesListsComponent;
  let fixture: ComponentFixture<MoviesListsComponent>;

  beforeEach(async(() => {
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
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show all lists', () => {
    moviesListsQueryMock.selectAll.mockReturnValue(of(testMoviestLists));

    component.ngOnInit();
    fixture.detectChanges();

    const moviesListsElements = fixture.debugElement.queryAll(
      By.directive(MoviesListComponent)
    );
    expect(moviesListsElements.length).toBe(testMoviestLists.length);
  });

  it('should navigate to the list details', () => {
    moviesListsQueryMock.selectAll.mockReturnValue(of(testMoviestLists));

    component.ngOnInit();
    fixture.detectChanges();

    const listId = testMoviestLists[0].id;
    const moviesListsElements = fixture.debugElement
      .queryAll(By.directive(MoviesListComponent))
      .map(el => el.componentInstance);
    (moviesListsElements[0] as MoviesListComponent).listClick.emit(listId);

    expect(routerMock.navigate).toHaveBeenCalledWith([
      `/home/movies-lists/${listId}`
    ]);
  });
});
