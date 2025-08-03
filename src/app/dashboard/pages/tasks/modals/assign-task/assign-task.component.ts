import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { Project } from 'src/app/interfaces/project.interface';
import { ProjectService } from 'src/app/services/project.service';
import Swal from 'sweetalert2';
import { AdministratorService } from 'src/app/services/administrator.service';
import { User } from 'src/app/interfaces/user.interface';
import { ProjectAssignationService } from 'src/app/services/project-assignation.service';
import { TaskAssignationService } from 'src/app/services/task-assignation.service';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/interfaces/task.interface';

@Component({
  selector: 'app-assign-task',
  templateUrl: './assign-task.component.html',
  styleUrls: ['./assign-task.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class AssignTaskComponent {
  users: User[] = [];
  tasks: Task[] = [];
  addFormulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private administratorService: AdministratorService,
    private taskService: TaskService,
    private taskAssignationService: TaskAssignationService
  ) {}

  ngOnInit(): void {
    // get all projects
    this.getAllTasks();
    // get all users
    this.getAllUsers();
    // init reactive form
    this.addFormulario = this.fb.group({
      task: [-17, [Validators.required]],
      user: [-17, [Validators.required]],
    });
  }

  open(content: any) {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
    };

    this.modalService.open(content, modalOptions);
  }

  assignUser() {
    const formData = this.addFormulario.value;
    console.log(formData);
    let projectId = this.addFormulario.value.project;
    if (this.addFormulario.invalid || projectId == -17) {
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
      this.taskAssignationService.createAssignation(formData).subscribe(
        (res) => {
          this.modalService.dismissAll();
          Swal.fire({
            title: 'SUCCESS',
            text: 'user assigned successfully',
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

  getAllTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      },
    });
  }

  getAllUsers() {
    this.administratorService.getAdministrators().subscribe({
      next: (users: User[]) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      },
    });
  }
}
