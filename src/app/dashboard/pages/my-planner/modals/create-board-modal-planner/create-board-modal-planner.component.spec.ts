import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBoardModalPlannerComponent } from './create-board-modal-planner.component';

describe('CreateBoardModalPlannerComponent', () => {
  let component: CreateBoardModalPlannerComponent;
  let fixture: ComponentFixture<CreateBoardModalPlannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateBoardModalPlannerComponent]
    });
    fixture = TestBed.createComponent(CreateBoardModalPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
