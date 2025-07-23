import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBucketModalComponent } from './update-bucket-modal.component';

describe('UpdateBucketModalComponent', () => {
  let component: UpdateBucketModalComponent;
  let fixture: ComponentFixture<UpdateBucketModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateBucketModalComponent]
    });
    fixture = TestBed.createComponent(UpdateBucketModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
