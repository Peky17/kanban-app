import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCompletedTasksComponent } from './my-completed-tasks.component';

describe('MyCompletedTasksComponent', () => {
  let component: MyCompletedTasksComponent;
  let fixture: ComponentFixture<MyCompletedTasksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyCompletedTasksComponent]
    });
    fixture = TestBed.createComponent(MyCompletedTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
