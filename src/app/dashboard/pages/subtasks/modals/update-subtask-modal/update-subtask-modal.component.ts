import { TaskService } from './../../../../../services/task.service';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { Subtask } from 'src/app/interfaces/subtask.interface';
import { Task } from 'src/app/interfaces/task.interface';
import { SubtaskService } from 'src/app/services/subtask.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-subtask-modal',
  templateUrl: './update-subtask-modal.component.html',
  styleUrls: ['./update-subtask-modal.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class UpdateSubtaskModalComponent {
  @Input() subtask!: Subtask;
  tasks: Task[] = [];
  updateFormulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private subtaskService: SubtaskService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (error) => {
        console.error('Error al obtener datos:', error);
      },
    });
    this.updateFormulario = this.fb.group({
      name: [
        this.subtask.name,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      priority: [
        this.subtask.priority,
        [Validators.required, Validators.maxLength(20)],
      ],
      startdDate: [this.subtask.startdDate, [Validators.required]],
      dueDate: [this.subtask.dueDate, [Validators.required]],
      createdAt: [this.subtask.createdAt, [Validators.required]],
      task: [this.subtask.task.id, [Validators.required]],
    });
  }

  updateSubtask(): void {
    const formData = this.updateFormulario.value;
    console.log(formData);
    if (this.updateFormulario.invalid) {
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
      this.subtaskService.updateSubtask(this.subtask.id, formData).subscribe(
        (res) => {
          this.modalService.dismissAll();
          Swal.fire({
            title: 'SUCCESS',
            text: 'Subtask updated successfully',
            icon: 'success',
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

  open(content: any) {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
    };

    this.modalService.open(content, modalOptions);
  }
}
