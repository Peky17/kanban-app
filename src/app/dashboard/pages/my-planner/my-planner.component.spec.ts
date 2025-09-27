import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPlannerComponent } from './my-planner.component';

describe('MyPlannerComponent', () => {
  let component: MyPlannerComponent;
  let fixture: ComponentFixture<MyPlannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyPlannerComponent]
    });
    fixture = TestBed.createComponent(MyPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
