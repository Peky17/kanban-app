import { TaskService } from './../../../../../services/task.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { Task } from 'src/app/interfaces/task.interface';
import { SubtaskService } from 'src/app/services/subtask.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-subtask-modal',
  templateUrl: './add-subtask-modal.component.html',
  styleUrls: ['./add-subtask-modal.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class AddSubtaskModalComponent {
  tasks: Task[] = [];
  addFormulario!: FormGroup;

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
      priority: ['-17', [Validators.required, Validators.maxLength(20)]],
      startdDate: [formattedDate, [Validators.required]],
      dueDate: [formattedDate, [Validators.required]],
      createdAt: [formattedDate, [Validators.required]],
      task: ['-17', [Validators.required]],
    });
  }

  createSubtask(): void {
    const formData = this.addFormulario.value;
    console.log(formData);
    if (this.addFormulario.invalid) {
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
      this.subtaskService.createSubtask(formData).subscribe(
        (res) => {
          this.modalService.dismissAll();
          Swal.fire({
            title: 'SUCCESS',
            text: 'Subtask saved successfully',
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

  open(content: any) {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
    };

    this.modalService.open(content, modalOptions);
  }
}
