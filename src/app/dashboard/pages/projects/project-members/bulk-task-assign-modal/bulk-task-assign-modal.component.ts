import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project } from 'src/app/interfaces/project.interface';
import { Task } from 'src/app/interfaces/task.interface';
import { User } from 'src/app/interfaces/user.interface';
import { TaskAssignation } from 'src/app/interfaces/taskAssignation';
import { ProjectAssignation } from 'src/app/interfaces/projectAssignation.interface';
import { TaskService } from 'src/app/services/task.service';
import { ProjectAssignationService } from 'src/app/services/project-assignation.service';
import { TaskAssignationService } from 'src/app/services/task-assignation.service';
import { AdministratorService } from 'src/app/services/administrator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bulk-task-assign-modal',
  templateUrl: './bulk-task-assign-modal.component.html',
  styleUrls: ['./bulk-task-assign-modal.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BulkTaskAssignModalComponent implements OnInit {
  @Input() projects: Project[] = [];
  @Output() taskAssigned = new EventEmitter<void>();

  selectedProjectId: number | null = null;
  selectedTaskId: number | null = null;
  availableTasks: Task[] = [];
  projectMembers: User[] = [];
  loading: boolean = false;
  submitting: boolean = false;

  constructor(
    private taskService: TaskService,
    private projectAssignationService: ProjectAssignationService,
    private taskAssignationService: TaskAssignationService,
    private administratorService: AdministratorService
  ) {}

  ngOnInit(): void {
    console.log('Modal initialized with projects:', this.projects);
    this.loadAllTasks();
  }

  loadAllTasks(): void {
    console.log('Loading all tasks...');
    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        console.log('Tasks loaded:', tasks);
        this.availableTasks = tasks;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
      }
    });
  }

  onProjectChange(): void {
    console.log('Project changed to:', this.selectedProjectId);
    if (this.selectedProjectId) {
      this.loadProjectMembers();
    } else {
      this.projectMembers = [];
    }
    this.selectedTaskId = null;
  }

  loadProjectMembers(): void {
    if (!this.selectedProjectId) return;

    console.log('Loading members for project ID:', this.selectedProjectId);
    this.loading = true;
    this.projectAssignationService.getAssignationsByProjectId(this.selectedProjectId).subscribe({
      next: async (assignations: ProjectAssignation[]) => {
        console.log('Received assignations:', assignations);
        this.projectMembers = [];

        for (const assignation of assignations) {
          try {
            let userId: number | null = null;

            // Handle different assignation structures
            if ((assignation as any).user && (assignation as any).user.id) {
              // Standard format: {id: X, user: {id: Y}}
              userId = (assignation as any).user.id;
              console.log('Standard format - User ID:', userId);
            } else if ((assignation as any).id && (assignation as any).name) {
              // Direct user format: {id: X, name: Y, email: Z, ...}
              userId = (assignation as any).id;
              console.log('Direct format - User ID:', userId, 'Name:', (assignation as any).name);
            }

            if (userId) {
              const user = await this.getUserById(userId);
              console.log('User loaded:', user);
              this.projectMembers.push(user);
            }
          } catch (error) {
            console.error('Error loading user:', error);
          }
        }
        console.log('Final project members:', this.projectMembers);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading project members:', err);
        this.loading = false;
      }
    });
  }

  private getUserById(userId: number): Promise<User> {
    return new Promise((resolve, reject) => {
      this.administratorService.getAdministratorById(userId.toString()).subscribe({
        next: (user: User) => resolve(user),
        error: (err) => reject(err)
      });
    });
  }

  assignTaskToAllMembers(): void {
    if (!this.selectedProjectId || !this.selectedTaskId) {
      Swal.fire('Error', 'Please select both a project and a task', 'error');
      return;
    }

    if (this.projectMembers.length === 0) {
      Swal.fire('Error', 'No members found in the selected project', 'error');
      return;
    }

    this.submitting = true;

    // Create task assignations for all project members
    const assignmentPromises = this.projectMembers.map(member => {
      const taskAssignation: TaskAssignation = {
        id: 0, // Will be set by backend
        user: {
          id: member.id
        },
        task: {
          id: this.selectedTaskId!
        },
        completed: false
      };

      return new Promise<void>((resolve, reject) => {
        this.taskAssignationService.createAssignation(taskAssignation).subscribe({
          next: () => resolve(),
          error: (err) => reject(err)
        });
      });
    });

    Promise.all(assignmentPromises)
      .then(() => {
        this.submitting = false;
        Swal.fire(
          'Success!',
          `Task assigned to ${this.projectMembers.length} team members successfully!`,
          'success'
        );
        this.resetForm();
        this.taskAssigned.emit();
        // Close modal programmatically
        const modalElement = document.getElementById('bulkTaskAssignModal');
        if (modalElement) {
          const modal = (window as any).bootstrap?.Modal?.getInstance(modalElement);
          modal?.hide();
        }
      })
      .catch((error) => {
        this.submitting = false;
        console.error('Error assigning tasks:', error);
        Swal.fire(
          'Error',
          'Failed to assign task to some team members. Please try again.',
          'error'
        );
      });
  }

  resetForm(): void {
    this.selectedProjectId = null;
    this.selectedTaskId = null;
    this.projectMembers = [];
  }

  getSelectedProject(): Project | null {
    if (!this.selectedProjectId) return null;
    return this.projects.find(p => p.id === this.selectedProjectId) || null;
  }

  getSelectedTask(): Task | null {
    if (!this.selectedTaskId) return null;
    return this.availableTasks.find(t => t.id === this.selectedTaskId) || null;
  }
}
