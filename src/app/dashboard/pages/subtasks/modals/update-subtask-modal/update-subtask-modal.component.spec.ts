import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSubtaskModalComponent } from './update-subtask-modal.component';

describe('UpdateSubtaskModalComponent', () => {
  let component: UpdateSubtaskModalComponent;
  let fixture: ComponentFixture<UpdateSubtaskModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSubtaskModalComponent]
    });
    fixture = TestBed.createComponent(UpdateSubtaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
