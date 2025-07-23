import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateKanbanModalComponent } from './update-kanban-modal.component';

describe('UpdateKanbanModalComponent', () => {
  let component: UpdateKanbanModalComponent;
  let fixture: ComponentFixture<UpdateKanbanModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateKanbanModalComponent]
    });
    fixture = TestBed.createComponent(UpdateKanbanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
