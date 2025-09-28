// import { TaskService } from './../../../../../services/task.service';
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
import { User } from 'src/app/interfaces/user.interface';
import { UserTaskService } from 'src/app/services/user-task.service';
import { TaskService } from 'src/app/services/task.service';
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
    private taskService: TaskService,
    private userTaskService: UserTaskService
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
      return;
    }

    this.subtaskService.createSubtask(formData).subscribe(
      (subtask) => {
        const taskId = formData.task;
        this.userTaskService.getUsersByTaskId(taskId).subscribe({
          next: (users: User[]) => {
            users.forEach((user) => {
              this.subtaskService
                .assignUserToSubtask(user.id, subtask.id)
                .subscribe();
            });
            this.modalService.dismissAll();
            Swal.fire({
              title: 'SUCCESS',
              text: 'Subtask saved and assigned to all task users.',
              icon: 'success',
            });
          },
          error: () => {
            this.modalService.dismissAll();
            Swal.fire({
              title: 'FAILED ACTION!',
              text: 'No se pudieron obtener los usuarios de la tarea.',
              icon: 'error',
            });
          },
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

  open(content: any) {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
    };

    this.modalService.open(content, modalOptions);
  }
}
