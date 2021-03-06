import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { authServiceMock } from '../../test-utilities/test-mocks';
import { AuthService } from '../state/auth.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        providers: [
          {
            provide: AuthService,
            useValue: authServiceMock
          }
        ],
        declarations: [HomeComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should navigate to the add route when the + button is clicked', () => {
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigateByUrl').mockImplementation();

    const addButton = fixture.debugElement.query(By.css('.add-button'));
    addButton.triggerEventHandler('click', null);

    expect(router.navigateByUrl).toHaveBeenCalledWith(`${router.url}/add`);
  });

  test('should navigate to the add route when the + button is clicked', () => {
    const authService = TestBed.inject(AuthService);
    jest.spyOn(authService, 'signOut');
    const signOutButton = fixture.debugElement.query(By.css('.sign-out-button'));
    signOutButton.triggerEventHandler('click', null);

    expect(authService.signOut).toHaveBeenCalled();
  });

  describe('Render', () => {
    test('should have a link for the movies feature', () => {
      const movieFeatureLink = fixture.debugElement.queryAll(By.css('.movies-link'));

      expect(movieFeatureLink.length).toBe(1);
    });

    test('should have a link for the tv-shows feature', () => {
      const movieFeatureLink = fixture.debugElement.queryAll(By.css('.tv-shows-link'));

      expect(movieFeatureLink.length).toBe(1);
    });

    test('should have a link for the places feature', () => {
      const movieFeatureLink = fixture.debugElement.queryAll(By.css('.places-link'));

      expect(movieFeatureLink.length).toBe(1);
    });
  });
});
