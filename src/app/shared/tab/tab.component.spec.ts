import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabComponent } from './tab.component';
import { By } from '@angular/platform-browser';

describe('TabComponent', () => {
  let component: TabComponent;
  let fixture: ComponentFixture<TabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabComponent]
    });
    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have .hidden class', () => {
    // best solution to get template element
    const element = fixture.debugElement.query(
      By.css('.hidden')
    );
    // access template through browser api (doesnt work if the app is not run through browser)
    const element2 = fixture.nativeElement.querySelector('.hidden');
    // access via dom element
    const element3 = document.querySelector('.hidden');

    expect(element).toBeTruthy();
  });

  it('should not have .hidden class', () => {
    component.active = true;
    fixture.detectChanges();

    const element = fixture.debugElement.query(
      By.css('.hidden')
    );
    const element2 = fixture.nativeElement.querySelector('.hidden');
    const element3 = document.querySelector('.hidden');

    expect(element).not.toBeTruthy();
  });

});
