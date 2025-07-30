import { BucketService } from './../../../../../services/bucket.service';
import { TaskService } from './../../../../../services/task.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { Bucket } from 'src/app/interfaces/bucket.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class AddTaskModalComponent {
  buckets: Bucket[] = [];
  addFormulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private taskService: TaskService,
    private bucketService: BucketService
  ) {}

  ngOnInit(): void {
    this.bucketService.getBuckets().subscribe({
      next: (buckets) => {
        this.buckets = buckets;
      },
      error: (error) => {
        console.error('Error al obtener datos:', error);
      },
    });
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    this.addFormulario = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      priority: [
        '-17',
        [
          Validators.required,
          Validators.maxLength(20),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(90),
        ],
      ],
      startDate: [formattedDate, [Validators.required]],
      dueDate: [formattedDate, [Validators.required]],
      createdAt: [formattedDate, [Validators.required]],
      bucket: ['-17', [Validators.required]],
    });
  }

  open(content: any) {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
    };

    this.modalService.open(content, modalOptions);
  }

  createTask(): void {
    const formData = this.addFormulario.value;
    console.log(formData);
    if (this.addFormulario.invalid) {
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
    } else {
      this.taskService.createTask(formData).subscribe(
        (res) => {
          this.modalService.dismissAll();
          Swal.fire({
            title: 'SUCCESS',
            text: 'Task saved successfully',
            icon: 'success',
          }).then(() => {
            location.reload();
          });
        },
        (err) => {
          Swal.fire({
            title: 'FAILED ACTION!',
            text: err.error.message,
            icon: 'error',
          });
          this.modalService.dismissAll();
        }
      );
    }
  }
}
