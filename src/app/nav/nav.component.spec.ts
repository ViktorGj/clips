import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavComponent } from './nav.component';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  // Mocking auth service - mock methods and properties (isAuthenticated$)
  const mockedAuthService = jasmine.createSpyObj('AuthService', [
    'createUser', 'logout'
  ], {
    isAuthenticated$: of(true)
  })


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [ NavComponent ],
      providers: [
        {
          provide: AuthService, useValue: mockedAuthService
        }
      ]
    });

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout user', () => {
    const logoutLink = fixture.debugElement.query(
      By.css('li:nth-child(3) a')
    );

    expect(logoutLink).withContext('Not logged in').toBeTruthy();

    // simulate click event on link element
    // with fixture.debugElement we are not selecting dom element so we need to simulate the action
    logoutLink.triggerEventHandler('click');

    const service = TestBed.inject(AuthService);

    expect(service.logout)
      .withContext('Could not click logout link')
      .toHaveBeenCalledTimes(1);
  });

});
