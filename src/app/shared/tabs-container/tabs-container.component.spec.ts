import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsContainerComponent } from './tabs-container.component';
import { Component } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <app-tabs-container>
      <app-tab tabTitle="Tab 1">Tab 1</app-tab>
      <app-tab tabTitle="Tab 1">Tab 2</app-tab>
    </app-tabs-container>
  `
})

class TestHostComponent {

}

describe('TabsContainerComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabsContainerComponent, TabComponent, TestHostComponent]
    });
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 2 tabs', () => {
    // getting the template to test for tabs number
    const tabs = fixture.debugElement.queryAll(By.css('li'));
    // getting the component directive to check the tabs property in the component
    const containerComponent = fixture.debugElement.query(By.directive(TabsContainerComponent));
    const tabsProp = containerComponent.componentInstance.tabs;

    // withContext applies message on failed tests (useful for writing descriptive message about the error)
    expect(tabs.length).withContext('Tabs did not render').toBe(2);
    expect(tabsProp.length).withContext('Could not grab component property').toBe(2);
  });

});
