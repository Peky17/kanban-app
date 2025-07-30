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

@Component({
  selector: 'app-assign-user',
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class AssignUserComponent {
  projects: Project[] = [];
  users: User[] = [];
  addFormulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private administratorService: AdministratorService,
    private projectService: ProjectService,
    private projectAssignationService: ProjectAssignationService
  ) {}

  open(content: any) {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
    };

    this.modalService.open(content, modalOptions);
  }

  ngOnInit(): void {
    // get all projects
    this.getAllProjects();
    // get all users
    this.getAllUsers();
    // init reactive form
    this.addFormulario = this.fb.group({
      project: [-17, [Validators.required]],
      user: [-17, [Validators.required]],
    });
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
      this.projectAssignationService.createAssignation(formData).subscribe(
        (res) => {
          this.modalService.dismissAll();
          Swal.fire({
            title: 'SUCCESS',
            text: 'user assigned successfully',
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

  getAllProjects() {
    this.projectService.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
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
