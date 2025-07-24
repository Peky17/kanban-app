import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProjectsWithProgress();
  }

  async loadProjectsWithProgress(): Promise<void> {
    this.loading = true;
    this.projectsProgress = []; 
    
    this.cdr.detectChanges();
    
    try {
      this.projectService.getProjects().subscribe({
        next: async (projects: Project[]) => {
          if (!projects || projects.length === 0) {
            this.loading = false;
            this.cdr.detectChanges();
            return;
          }

          for (let i = 0; i < projects.length; i++) {
            const project = projects[i];
            
            try {
              const projectProgress = await this.getProjectProgress(project);
              this.projectsProgress.push(projectProgress);
              
              this.cdr.markForCheck();
              this.cdr.detectChanges();
              
            } catch (error) {
              console.error(`Error processing project ${project.name}:`, error);
              this.projectsProgress.push({
                project,
                members: [],
                totalProjectTasks: 0,
                totalCompletedTasks: 0,
                overallProgress: 0
              });
              this.cdr.detectChanges();
            }
          }
          
          this.loading = false;
          this.cdr.detectChanges();
          
        },
        error: (err) => {
          console.error('Error loading projects:', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
      
    } catch (error) {
      console.error('Error in loadProjectsWithProgress:', error);
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private async getProjectProgress(project: Project): Promise<ProjectProgress> {
    return new Promise((resolve) => {
      this.projectAssignationService.getAssignationsByProjectId(project.id).subscribe({
        next: async (assignations: ProjectAssignation[]) => {
          if (!assignations || assignations.length === 0) {
            resolve({
              project,
              members: [],
              totalProjectTasks: 0,
              totalCompletedTasks: 0,
              overallProgress: 0
            });
            return;
          }
          
          const members: ProjectMember[] = [];
          let totalProjectTasks = 0;
          let totalCompletedTasks = 0;

          for (let i = 0; i < assignations.length; i++) {
            const assignation: any = assignations[i];
            
            let userId: number | null = null;
            
            if (assignation && assignation.user && assignation.user.id) {
              userId = assignation.user.id;
            } else if (assignation && assignation.id && assignation.name) {
              userId = assignation.id;
            } else {
              continue;
            }

            if (!userId) {
              continue;
            }

            try {
              const member = await this.getMemberProgress(userId);
              members.push(member);
              totalProjectTasks += member.totalTasks;
              totalCompletedTasks += member.completedTasks;
            } catch (error) {
              console.error('Error getting member progress for user:', userId, error);
            }
          }

          const overallProgress = totalProjectTasks > 0
            ? Math.round((totalCompletedTasks / totalProjectTasks) * 100)
            : 0;

          const finalProgress = {
            project,
            members,
            totalProjectTasks,
            totalCompletedTasks,
            overallProgress
          };
          
          resolve(finalProgress);
        },
        error: (err) => {
          console.error(`Error getting project assignations for project: ${project.name}`, err);
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
      if (!userId || isNaN(userId)) {
        resolve({
          user: { id: 0, name: 'Invalid User' } as User,
          totalTasks: 0,
          completedTasks: 0,
          progressPercentage: 0
        });
        return;
      }

      this.administratorService.getAdministratorById(userId.toString()).subscribe({
        next: (user: User) => {
          if (!user) {
            resolve({
              user: { id: userId, name: 'User Not Found', email: '', role: { id: 0, name: 'Unknown' } } as User,
              totalTasks: 0,
              completedTasks: 0,
              progressPercentage: 0
            });
            return;
          }

          const processedUser: User = {
            ...user,
            role: user.role ? {
              id: user.role.id || 0,
              name: user.role.name || 'User'
            } : { id: 0, name: 'User' }
          };

          this.taskAssignationService.getTaskAssignationByUserId(userId).subscribe({
            next: (taskAssignations: TaskAssignation[]) => {
              const validAssignations = taskAssignations.filter(ta => ta && typeof ta.completed === 'boolean');
              const totalTasks = validAssignations.length;
              const completedTasks = validAssignations.filter(ta => ta.completed).length;
              const progressPercentage = totalTasks > 0
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0;

              resolve({
                user: processedUser,
                totalTasks,
                completedTasks,
                progressPercentage
              });
            },
            error: (err) => {
              console.error('Error getting task assignations for user:', userId, err);
              resolve({
                user: processedUser,
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
            user: {
              id: userId,
              name: 'Unknown User',
              email: '',
              role: { id: 0, name: 'User' }
            } as User,
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

  getRoleName(user: User): string {
    if (!user || !user.role) return 'User';
    return user.role.name || 'User';
  }

  getUserInitial(user: User): string {
    if (!user || !user.name) return '?';
    return user.name.charAt(0).toUpperCase();
  }

  // Utility methods
  trackByProjectId(index: number, item: ProjectProgress): number {
    return item.project.id;
  }

  trackByMemberId(index: number, item: ProjectMember): number {
    return item.user?.id || index;
  }
}
