import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyIncopletedTasksComponent } from './my-incopleted-tasks.component';

describe('MyIncopletedTasksComponent', () => {
  let component: MyIncopletedTasksComponent;
  let fixture: ComponentFixture<MyIncopletedTasksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyIncopletedTasksComponent]
    });
    fixture = TestBed.createComponent(MyIncopletedTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
