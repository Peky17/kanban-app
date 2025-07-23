import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBoardsComponent } from './project-boards.component';

describe('ProjectBoardsComponent', () => {
  let component: ProjectBoardsComponent;
  let fixture: ComponentFixture<ProjectBoardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectBoardsComponent]
    });
    fixture = TestBed.createComponent(ProjectBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
