import { Component } from '@angular/core';
import { Project } from 'src/app/interfaces/project.interface';
import { ProjectAssignation } from 'src/app/interfaces/projectAssignation.interface';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectAssignationService } from 'src/app/services/project-assignation.service';

@Component({
  selector: 'app-assigned-projects',
  templateUrl: './assigned-projects.component.html',
  styleUrls: ['./assigned-projects.component.css'],
})
export class AssignedProjectsComponent {
  currentUser!: User;
  projects: Project[] = [];
  projectAssignation: ProjectAssignation[] = [];
  constructor(
    private authService: AuthService,
    private projectAssignationService: ProjectAssignationService
  ) {}

  ngOnInit(): void {
    this.authService.getUserRole().subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.getProjectsAssignation(user.id);
      },
    });
  }

  getProjectsAssignation(currentUserId: number): void {
    this.projectAssignationService
      .getAssignationsByUserId(currentUserId)
      .subscribe((projectAssignation: ProjectAssignation[]) => {
        this.projectAssignation = projectAssignation;
        console.log(this.projectAssignation);
      });
  }
}
