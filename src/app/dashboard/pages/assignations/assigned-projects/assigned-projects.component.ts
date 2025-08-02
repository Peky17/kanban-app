import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/interfaces/project.interface';
import { ProjectAssignation } from 'src/app/interfaces/projectAssignation.interface';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectAssignationService } from 'src/app/services/project-assignation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assigned-projects',
  templateUrl: './assigned-projects.component.html',
  styleUrls: ['./assigned-projects.component.css'],
})
export class AssignedProjectsComponent {
  currentUser!: User;
  projects: Project[] = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private projectAssignationService: ProjectAssignationService
  ) {}

  ngOnInit(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while we fetch your assigned projects.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.authService.getUserRole().subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.getProjectsAssignation(user.id);
      },
      error: () => {
        Swal.fire('Error', 'Failed to load user role.', 'error');
      },
    });
  }

  getProjectsAssignation(currentUserId: number): void {
    this.projectAssignationService
      .getAssignationsByUserId(currentUserId)
      .subscribe(
        (projects: Project[]) => {
          this.projects = projects;
          Swal.close(); // Close the loader
        },
        (error) => {
          Swal.fire('Error', 'Failed to load assigned projects.', 'error');
        }
      );
  }

  redirectToProjectBoards(project: Project): void {
    // Send data an redirect
    this.router.navigate(['/dashboard/project-boards', project]);
  }
}
