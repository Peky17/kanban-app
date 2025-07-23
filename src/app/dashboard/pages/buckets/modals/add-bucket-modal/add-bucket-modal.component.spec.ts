import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBucketModalComponent } from './add-bucket-modal.component';

describe('AddBucketModalComponent', () => {
  let component: AddBucketModalComponent;
  let fixture: ComponentFixture<AddBucketModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddBucketModalComponent]
    });
    fixture = TestBed.createComponent(AddBucketModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
