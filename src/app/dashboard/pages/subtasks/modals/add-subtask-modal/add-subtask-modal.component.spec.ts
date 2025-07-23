import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubtaskModalComponent } from './add-subtask-modal.component';

describe('AddSubtaskModalComponent', () => {
  let component: AddSubtaskModalComponent;
  let fixture: ComponentFixture<AddSubtaskModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSubtaskModalComponent]
    });
    fixture = TestBed.createComponent(AddSubtaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
