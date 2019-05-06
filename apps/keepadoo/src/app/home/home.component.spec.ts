import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [],
      declarations: [HomeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the add route when the + button is clicked', () => {
    const router: Router = TestBed.get(Router);
    jest.spyOn(router, 'navigateByUrl').mockImplementation(() => {});

    const addButton = fixture.debugElement.query(By.css('.add-button'));
    addButton.triggerEventHandler('click', null);

    expect(router.navigateByUrl).toHaveBeenCalledWith(`${router.url}/add`);
  });

  describe('Render', () => {
    it('should have a link for the movies feature', () => {
      const movieFeatureLink = fixture.debugElement.queryAll(
        By.css('.movies-link')
      );

      expect(movieFeatureLink.length).toBe(1);
    });

    it('should have a link for the tv-shows feature', () => {
      const movieFeatureLink = fixture.debugElement.queryAll(
        By.css('.tv-shows-link')
      );

      expect(movieFeatureLink.length).toBe(1);
    });

    it('should have a link for the places feature', () => {
      const movieFeatureLink = fixture.debugElement.queryAll(
        By.css('.places-link')
      );

      expect(movieFeatureLink.length).toBe(1);
    });
  });
});
