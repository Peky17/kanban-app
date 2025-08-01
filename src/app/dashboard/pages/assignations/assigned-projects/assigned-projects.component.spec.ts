import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedProjectsComponent } from './assigned-projects.component';

describe('AssignedProjectsComponent', () => {
  let component: AssignedProjectsComponent;
  let fixture: ComponentFixture<AssignedProjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignedProjectsComponent]
    });
    fixture = TestBed.createComponent(AssignedProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
