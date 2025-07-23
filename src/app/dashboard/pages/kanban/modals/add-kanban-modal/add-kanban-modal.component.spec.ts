import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKanbanModalComponent } from './add-kanban-modal.component';

describe('AddKanbanModalComponent', () => {
  let component: AddKanbanModalComponent;
  let fixture: ComponentFixture<AddKanbanModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddKanbanModalComponent]
    });
    fixture = TestBed.createComponent(AddKanbanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
