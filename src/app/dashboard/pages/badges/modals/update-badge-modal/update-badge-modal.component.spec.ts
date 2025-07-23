import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBadgeModalComponent } from './update-badge-modal.component';

describe('UpdateBadgeModalComponent', () => {
  let component: UpdateBadgeModalComponent;
  let fixture: ComponentFixture<UpdateBadgeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateBadgeModalComponent]
    });
    fixture = TestBed.createComponent(UpdateBadgeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
