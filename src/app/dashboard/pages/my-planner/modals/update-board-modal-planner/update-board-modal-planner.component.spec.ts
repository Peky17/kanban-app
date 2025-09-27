import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBoardModalPlannerComponent } from './update-board-modal-planner.component';

describe('UpdateBoardModalPlannerComponent', () => {
  let component: UpdateBoardModalPlannerComponent;
  let fixture: ComponentFixture<UpdateBoardModalPlannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateBoardModalPlannerComponent]
    });
    fixture = TestBed.createComponent(UpdateBoardModalPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
