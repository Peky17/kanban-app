import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBadgeModalComponent } from './add-badge-modal.component';

describe('AddBadgeModalComponent', () => {
  let component: AddBadgeModalComponent;
  let fixture: ComponentFixture<AddBadgeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBadgeModalComponent]
    });
    fixture = TestBed.createComponent(AddBadgeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
