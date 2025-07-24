import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project } from 'src/app/interfaces/project.interface';
import { User } from 'src/app/interfaces/user.interface';
import { TaskAssignation } from 'src/app/interfaces/taskAssignation';
import { ProjectAssignation } from 'src/app/interfaces/projectAssignation.interface';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectAssignationService } from 'src/app/services/project-assignation.service';
import { TaskAssignationService } from 'src/app/services/task-assignation.service';
import { AdministratorService } from 'src/app/services/administrator.service';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/interfaces/task.interface';
import { BulkTaskAssignModalComponent } from './bulk-task-assign-modal/bulk-task-assign-modal.component';

interface ProjectMember {
  user: User;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

interface ProjectProgress {
  project: Project;
  members: ProjectMember[];
  totalProjectTasks: number;
  totalCompletedTasks: number;
  overallProgress: number;
}

@Component({
  selector: 'app-project-members',
  templateUrl: './project-members.component.html',
  styleUrls: ['./project-members.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, BulkTaskAssignModalComponent]
})
export class ProjectMembersComponent implements OnInit {
  projects: Project[] = [];
  projectsProgress: ProjectProgress[] = [];
  loading: boolean = false;
  selectedProject: ProjectProgress | null = null;

  constructor(
    private projectService: ProjectService,
    private projectAssignationService: ProjectAssignationService,
    private taskAssignationService: TaskAssignationService,
    private administratorService: AdministratorService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadProjectsWithProgress();
  }

  async loadProjectsWithProgress(): Promise<void> {
    this.loading = true;
    try {
      // Get all projects
      this.projectService.getProjects().subscribe({
        next: async (projects: Project[]) => {
          console.log('Loaded projects:', projects);

          // Validate projects structure
          const validProjects = projects.filter(project =>
            project &&
            project.id &&
            typeof project.id === 'number' &&
            project.name
          );

          if (validProjects.length !== projects.length) {
            console.warn('Some projects have invalid structure:', projects);
          }

          this.projects = validProjects;
          this.projectsProgress = [];

          for (const project of validProjects) {
            try {
              const projectProgress = await this.getProjectProgress(project);
              this.projectsProgress.push(projectProgress);
            } catch (error) {
              console.error('Error processing project:', project.name, error);
              // Add project with empty progress if there's an error
              this.projectsProgress.push({
                project,
                members: [],
                totalProjectTasks: 0,
                totalCompletedTasks: 0,
                overallProgress: 0
              });
            }
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading projects:', err);
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('Error:', error);
      this.loading = false;
    }
  }

  private async getProjectProgress(project: Project): Promise<ProjectProgress> {
    return new Promise((resolve) => {
      // Get project members
      this.projectAssignationService.getAssignationsByProjectId(project.id).subscribe({
        next: async (assignations: ProjectAssignation[]) => {
          console.log('Project assignations for project', project.id, ':', assignations);
          const members: ProjectMember[] = [];
          let totalProjectTasks = 0;
          let totalCompletedTasks = 0;

          for (const assignation of assignations) {
            // Validate assignation structure
            if (!assignation || !assignation.user || !assignation.user.id) {
              console.warn('Invalid assignation structure:', assignation);
              continue;
            }

            try {
              const member = await this.getMemberProgress(assignation.user.id);
              members.push(member);
              totalProjectTasks += member.totalTasks;
              totalCompletedTasks += member.completedTasks;
            } catch (error) {
              console.error('Error getting member progress for user:', assignation.user.id, error);
            }
          }

          const overallProgress = totalProjectTasks > 0
            ? Math.round((totalCompletedTasks / totalProjectTasks) * 100)
            : 0;

          resolve({
            project,
            members,
            totalProjectTasks,
            totalCompletedTasks,
            overallProgress
          });
        },
        error: (err) => {
          console.error('Error getting project assignations:', err);
          resolve({
            project,
            members: [],
            totalProjectTasks: 0,
            totalCompletedTasks: 0,
            overallProgress: 0
          });
        }
      });
    });
  }

  private async getMemberProgress(userId: number): Promise<ProjectMember> {
    return new Promise((resolve) => {
      // Validate userId
      if (!userId || isNaN(userId)) {
        console.error('Invalid userId:', userId);
        resolve({
          user: { id: 0, name: 'Invalid User' } as User,
          totalTasks: 0,
          completedTasks: 0,
          progressPercentage: 0
        });
        return;
      }

      // Get user details
      this.administratorService.getAdministratorById(userId.toString()).subscribe({
        next: (user: User) => {
          if (!user) {
            console.error('User not found for id:', userId);
            resolve({
              user: { id: userId, name: 'User Not Found' } as User,
              totalTasks: 0,
              completedTasks: 0,
              progressPercentage: 0
            });
            return;
          }

          // Get user task assignations
          this.taskAssignationService.getTaskAssignationByUserId(userId).subscribe({
            next: (taskAssignations: TaskAssignation[]) => {
              const validAssignations = taskAssignations.filter(ta => ta && typeof ta.completed === 'boolean');
              const totalTasks = validAssignations.length;
              const completedTasks = validAssignations.filter(ta => ta.completed).length;
              const progressPercentage = totalTasks > 0
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0;

              resolve({
                user,
                totalTasks,
                completedTasks,
                progressPercentage
              });
            },
            error: (err) => {
              console.error('Error getting task assignations for user:', userId, err);
              resolve({
                user,
                totalTasks: 0,
                completedTasks: 0,
                progressPercentage: 0
              });
            }
          });
        },
        error: (err) => {
          console.error('Error getting user:', userId, err);
          resolve({
            user: { id: userId, name: 'Unknown User' } as User,
            totalTasks: 0,
            completedTasks: 0,
            progressPercentage: 0
          });
        }
      });
    });
  }

  selectProject(projectProgress: ProjectProgress): void {
    this.selectedProject = projectProgress;
  }

  getProgressBarColor(percentage: number): string {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 50) return 'bg-warning';
    return 'bg-danger';
  }

  getStatusBadgeClass(percentage: number): string {
    if (percentage >= 80) return 'badge bg-success';
    if (percentage >= 50) return 'badge bg-warning';
    return 'badge bg-danger';
  }

  getStatusText(percentage: number): string {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 50) return 'In Progress';
    return 'Needs Attention';
  }
}
