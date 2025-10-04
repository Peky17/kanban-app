import { PersonalTask } from './../../../../interfaces/personalTask.interface';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Bucket } from 'src/app/interfaces/bucket.interface';
import { BucketService } from 'src/app/services/bucket.service';
import { PersonalTaskService } from 'src/app/services/personal-task.service';
import { AuthService } from 'src/app/services/auth.service';
import { TaskAssignation } from 'src/app/interfaces/taskAssignation';
import { User } from 'src/app/interfaces/user.interface';
import { BoardService } from 'src/app/services/board.service';
import { LoaderComponent } from 'src/app/shared/loader/loader.component';
import { Board } from 'src/app/interfaces/board.interface';
import Swal from 'sweetalert2';
import { BucketPersonalTask } from 'src/app/interfaces/bucketPersonalTasks.interface';
import { KanbanBucketModalComponent } from './modals/kanban-bucket-modal.component';
import { KanbanPersonalTaskModalComponent } from './modals/kanban-personal-task-modal.component';
import { KanbanEditPersonalTaskModalComponent } from './modals/kanban-edit-personal-task-modal.component';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css'],
  standalone: true,
  imports: [CdkDropList, CdkDrag, NgFor, NgIf, LoaderComponent],
  // Add the edit modal component to the standalone imports
  // (if using standalone components, otherwise add to module)
  // KanbanEditPersonalTaskModalComponent,
})
export class KanbanBoardComponent implements OnInit {
  showChatbot: boolean = false;
  // Método para abrir el modal de creación de bucket
  openCreateBucketModal(): void {
    const modalRef = this.modalService.open(KanbanBucketModalComponent, {
      size: 'md',
      backdrop: 'static',
    });
    modalRef.componentInstance.mode = 'create';
    modalRef.componentInstance.boardId = this.board.id;
    modalRef.result.then(
      (result) => {
        if (result === 'created') {
          this.initBucketsAndPersonalTasks();
        }
      },
      () => {}
    );
  }
  // trackBy para mejorar el rendimiento del ngFor de tareas
  trackByTaskId(index: number, task: any): number {
    return task.id;
  }
  board!: any;
  buckets: Bucket[] = [];
  bucketTasks: BucketPersonalTask[] = [];
  currentUser!: User;
  userTaskAssignations: TaskAssignation[] = [];
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personalTaskService: PersonalTaskService,
    private bucketService: BucketService,
    private authService: AuthService,
    private boardService: BoardService,
    private modalService: NgbModal
  ) {}

  // --- FAB (Floating Action Button) ---
  fabOpen = false;
  showPersonalChatbot = false;

  toggleFab(): void {
    this.fabOpen = !this.fabOpen;
  }

  closeFab(): void {
    this.fabOpen = false;
  }

  keepFabOpen(): void {
    this.fabOpen = true;
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        const boardId = +params['id'];
        // Obtener el board completo si es necesario
        this.boardService.getBoardById(boardId).subscribe({
          next: (board: Board) => {
            this.board = board;
            // Obtener usuario y luego cargar buckets/tasks
            this.authService.getUserRole().subscribe({
              next: (user: User) => {
                this.currentUser = user;
                this.initBucketsAndPersonalTasks();
              },
              error: (err) => {
                this.isLoading = false;
                console.error('Error getting user:', err);
              },
            });
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error getting board:', err);
          },
        });
      },
      error: (err) => console.error('Error:', err),
    });
  }

  initBucketsAndPersonalTasks(): void {
    this.bucketService.getBucketsByBoard(this.board.id).subscribe({
      next: (bucketsObtained: Bucket[]) => {
        this.buckets = bucketsObtained.sort((a, b) => a.id - b.id);
        this.bucketTasks = [];
        this.personalTaskService.getTasks().subscribe({
          next: (personalTasks: PersonalTask[]) => {
            this.buckets.forEach((bucket: Bucket) => {
              const tasks = personalTasks.filter(
                (task) =>
                  task.bucketId === bucket.id &&
                  task.userId === this.currentUser.id
              );
              this.bucketTasks.push({ id: bucket.id, tasks });
            });
            this.isLoading = false;
            // Bootstrap tooltips initialization
            setTimeout(() => {
              // @ts-ignore
              const tooltipTriggerList = [].slice.call(
                document.querySelectorAll('[data-bs-toggle="tooltip"]')
              );
              // @ts-ignore
              tooltipTriggerList.forEach(function (tooltipTriggerEl) {
                // @ts-ignore
                new window.bootstrap.Tooltip(tooltipTriggerEl);
              });
            }, 0);
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error loading personal tasks:', err);
          },
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading buckets:', err);
      },
    });
  }

  getBucketPosition(bucketId: number): number {
    let index: number = 0;
    this.bucketTasks.forEach((bucketTask: BucketPersonalTask) => {
      if (bucketTask.id === bucketId)
        index = this.bucketTasks.indexOf(bucketTask);
    });
    return index;
  }

  getConnectedLists(): string[] {
    const connectedListIds: string[] = [];
    // iterate over all the buckets
    this.buckets.forEach((bucket: Bucket) => {
      connectedListIds.push('list-' + bucket.id);
    });
    return connectedListIds;
  }

  drop(event: CdkDragDrop<PersonalTask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Get the task that was moved
      const movedTask = event.previousContainer.data[event.previousIndex];
      const newBucketId = parseInt(event.container.id.replace('list-', ''));
      const updatedTask: PersonalTask = {
        ...movedTask,
        bucketId: newBucketId,
      };
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.personalTaskService.updateTask(movedTask.id, updatedTask).subscribe({
        next: (response: PersonalTask) => {
          console.log('PersonalTask updated successfully:', response);
        },
        error: (err) => {
          console.error('Error updating personal task:', err);
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );
        },
      });
    }
  }

  markTaskAsCompleted(task: PersonalTask): void {
    const updatedTask: PersonalTask = {
      ...task,
      completed: true,
    };
    this.personalTaskService.updateTask(task.id, updatedTask).subscribe({
      next: (response: PersonalTask) => {
        Swal.fire('Task completed', 'Task completed successfully!', 'success');
        this.removeTaskFromBuckets(task.id);
      },
      error: (err) => {
        console.error('Error marking personal task as completed:', err);
        Swal.fire('Error', 'Failed to mark task as completed', 'error');
      },
    });
  }

  // Remove task from buckets array after completion
  private removeTaskFromBuckets(taskId: number): void {
    this.bucketTasks.forEach((bucketTask: BucketPersonalTask) => {
      bucketTask.tasks = bucketTask.tasks.filter((task) => task.id !== taskId);
    });
  }

  // Redirect to board (for the view button functionality)
  redirectToBoard(task: PersonalTask): void {
    const bucketId: number = task.bucketId;
    this.bucketService.getBucketById(bucketId).subscribe({
      next: (bucket: Bucket) => {
        this.boardService.getBoardById(bucket.board.id).subscribe({
          next: (board: Board) => {
            this.router.navigate(['/dashboard/board', board]);
          },
          error: (err) => console.error('Error getting board:', err),
        });
      },
      error: (err) => console.error('Error getting bucket:', err),
    });
  }

  // Método para abrir el modal de edición de bucket
  openEditBucketModal(bucket: any): void {
    const modalRef = this.modalService.open(KanbanBucketModalComponent, {
      size: 'md',
      backdrop: 'static',
    });
    modalRef.componentInstance.mode = 'edit';
    modalRef.componentInstance.bucket = bucket;
    modalRef.componentInstance.boardId = this.board.id;
    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.initBucketsAndPersonalTasks();
        }
      },
      () => {}
    );
  }

  // Método para confirmar y eliminar bucket
  confirmDeleteBucket(bucket: any): void {
    Swal.fire({
      title: 'Delete bucket?',
      text: `This action cannot be undone. Delete "${bucket.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bucketService.deleteBucketById(bucket.id).subscribe({
          next: () => {
            Swal.fire(
              'Deleted',
              'The bucket was deleted successfully.',
              'success'
            );
            this.initBucketsAndPersonalTasks();
          },
          error: (err) => {
            Swal.fire(
              'Error',
              err.error?.message || 'Failed to delete the bucket',
              'error'
            );
          },
        });
      }
    });
  }

  // Open modal to create a new personal task for a bucket
  openCreatePersonalTaskModal(bucket: Bucket): void {
    const modalRef = this.modalService.open(KanbanPersonalTaskModalComponent, {
      size: 'md',
      backdrop: 'static',
    });
    modalRef.componentInstance.mode = 'create';
    modalRef.componentInstance.bucketId = bucket.id;
    modalRef.componentInstance.userId = this.currentUser.id;
    modalRef.componentInstance.boardId = this.board.id;
    modalRef.result.then(
      (result) => {
        if (result === 'created') {
          this.initBucketsAndPersonalTasks();
        }
      },
      () => {}
    );
  }

  // Open modal to edit a personal task
  openEditPersonalTaskModal(task: PersonalTask): void {
    const modalRef = this.modalService.open(KanbanEditPersonalTaskModalComponent, {
      size: 'md',
      backdrop: 'static',
    });
    modalRef.componentInstance.task = task;
    modalRef.result.then(
      (result) => {
        if (result === 'updated') {
          this.initBucketsAndPersonalTasks();
        }
      },
      () => {}
    );
  }

  // Delete a personal task with confirmation
  deletePersonalTask(task: PersonalTask): void {
    Swal.fire({
      title: 'Delete personal task?',
      text: `This action cannot be undone. Delete "${task.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
  this.personalTaskService.deleteTaskById(task.id).subscribe({
          next: () => {
            Swal.fire('Deleted', 'The personal task was deleted successfully.', 'success');
            this.removeTaskFromBuckets(task.id);
          },
          error: (err) => {
            Swal.fire('Error', err.error?.message || 'Failed to delete the personal task', 'error');
          },
        });
      }
    });
  }
}
