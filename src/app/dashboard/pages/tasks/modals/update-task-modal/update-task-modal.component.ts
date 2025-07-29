import { BucketService } from './../../../../../services/bucket.service';
import { TaskService } from './../../../../../services/task.service';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { Bucket } from 'src/app/interfaces/bucket.interface';
import { Task } from 'src/app/interfaces/task.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-task-modal',
  templateUrl: './update-task-modal.component.html',
  styleUrls: ['./update-task-modal.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class UpdateTaskModalComponent {
  @Input() task!: Task;
  buckets: Bucket[] = [];
  updateFormulario!: FormGroup;

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
    this.updateFormulario = this.fb.group({
      name: [
        this.task.name,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      priority: [
        this.task.priority,
        [Validators.required, Validators.maxLength(20)],
      ],
      description: [
        this.task.description,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(90),
        ],
      ],
      startDate: [this.task.startDate, [Validators.required]],
      dueDate: [this.task.dueDate, [Validators.required]],
      createdAt: [this.task.createdAt, [Validators.required]],
      bucket: [this.task.bucket.id, [Validators.required]],
    });
  }

  open(content: any) {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
    };

    this.modalService.open(content, modalOptions);
  }

  updateTask(): void {
    const formData = this.updateFormulario.value;
    console.log(formData);
    if (this.updateFormulario.invalid) {
      Swal.fire({
        toast: true,
        title: 'OPERACIÓN DENEGADA',
        text: 'Por favor, complete todos los campos',
        icon: 'error',
        position: 'top-right',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else {
      this.taskService.updateTask(this.task.id, formData).subscribe(
        (res) => {
          this.modalService.dismissAll();
          Swal.fire({
            title: 'SUCCESS',
            text: 'Task updated successfully',
            icon: 'success',
          }).then(() => {
            location.reload();
          });
        },
        (err) => {
          Swal.fire({
            title: 'OPERACIÓN DENEGADA',
            text: err.error.message,
            icon: 'error',
          });
          this.modalService.dismissAll();
        }
      );
    }
  }
}
