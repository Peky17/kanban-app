import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BucketService } from 'src/app/services/bucket.service';
import Swal from 'sweetalert2';

import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-kanban-bucket-modal',
  templateUrl: './kanban-bucket-modal.component.html',
  styleUrls: ['./kanban-bucket-modal.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class KanbanBucketModalComponent implements OnInit {
  @Input() boardId!: number;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() bucket: any = null;

  bucketForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private bucketService: BucketService
  ) {}

  ngOnInit(): void {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    this.bucketForm = this.fb.group({
      name: [
        this.bucket?.name || '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      description: [
        this.bucket?.description || '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(40),
        ],
      ],
      color: [this.bucket?.color || '', [Validators.required]],
      createdAt: [
        this.bucket?.createdAt || formattedDate,
        [Validators.required],
      ],
      board: [this.boardId, [Validators.required]],
    });
  }

  saveBucket() {
    if (this.bucketForm.invalid) {
      Swal.fire({
        toast: true,
        title: 'FAILED ACTION!',
        text: 'Please complete all the fields',
        icon: 'error',
        position: 'top-right',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }
    const formData = this.bucketForm.value;
    if (this.mode === 'create') {
      this.bucketService.createBucket(formData).subscribe({
        next: () => {
          this.activeModal.close('created');
          Swal.fire({
            title: 'SUCCESS',
            text: 'Bucket created successfully',
            icon: 'success',
          });
        },
        error: (err) => {
          Swal.fire({
            title: 'FAILED ACTION!',
            text: err.error.message,
            icon: 'error',
          });
        },
      });
    } else if (this.mode === 'edit' && this.bucket) {
      this.bucketService
        .updateBucket(this.bucket.id, { ...formData, id: this.bucket.id })
        .subscribe({
          next: () => {
            this.activeModal.close('updated');
            Swal.fire({
              title: 'SUCCESS',
              text: 'Bucket updated successfully',
              icon: 'success',
            });
          },
          error: (err) => {
            Swal.fire({
              title: 'FAILED ACTION!',
              text: err.error.message,
              icon: 'error',
            });
          },
        });
    }
  }
}
