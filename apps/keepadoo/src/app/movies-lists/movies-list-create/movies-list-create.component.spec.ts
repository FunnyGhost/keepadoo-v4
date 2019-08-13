import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviesListCreateComponent } from './movies-list-create.component';

describe('MoviesListCreateComponent', () => {
  let component: MoviesListCreateComponent;
  let fixture: ComponentFixture<MoviesListCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MoviesListCreateComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesListCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
