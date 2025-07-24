import { BucketTask } from './../../../../interfaces/bucketTasks.interface';
import { Task } from './../../../../interfaces/task.interface';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bucket } from 'src/app/interfaces/bucket.interface';
import { BucketService } from 'src/app/services/bucket.service';
import { TaskService } from 'src/app/services/task.service';
import { AuthService } from 'src/app/services/auth.service';
import { TaskAssignationService } from 'src/app/services/task-assignation.service';
import { TaskAssignation, UserTaskAssignation } from 'src/app/interfaces/taskAssignation';
import { User } from 'src/app/interfaces/user.interface';
import { BoardService } from 'src/app/services/board.service';
import { Board } from 'src/app/interfaces/board.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css'],
  standalone: true,
  imports: [CdkDropList, CdkDrag, NgFor],
})
export class KanbanBoardComponent implements OnInit {
  board!: any;
  buckets: Bucket[] = [];
  bucketTasks: BucketTask[] = [];
  currentUser!: User;
  userTaskAssignations: TaskAssignation[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private bucketService: BucketService,
    private authService: AuthService,
    private taskAssignationService: TaskAssignationService,
    private boardService: BoardService
  ) {}

  ngOnInit(): void {
    // Get board data
    this.route.params.subscribe({
      next: (value) => (this.board = value),
      error: (err) => console.error('Error:', err),
    });

    // Get current user and then initialize buckets and tasks
    this.authService.getUserRole().subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.getUserTaskAssignations();
      },
      error: (err) => console.error('Error getting user:', err),
    });
  }

  getUserTaskAssignations(): void {
    this.taskAssignationService.getTaskAssignationByUserId(this.currentUser.id).subscribe({
      next: (assignedTasks: TaskAssignation[]) => {
        this.userTaskAssignations = assignedTasks;
        // Get board buckets after getting user assignations
        this.bucketService.getBucketsByBoard(this.board.id).subscribe({
          next: (bucketsObtained: Bucket[]) =>
            this.initBucketsAndTasks(bucketsObtained),
          error: (err) => console.error('Error:', err),
        });
      },
      error: (err) => console.error('Error getting task assignations:', err),
    });
  }

  initBucketsAndTasks(bucketsObtained: Bucket[]): void {
    this.buckets = bucketsObtained;
    // get tasks for each bucket and save only the ones assigned to current user
    this.buckets.forEach((bucket: Bucket) => {
      let bucketTaskElement: BucketTask = this.getTasksByBucket(bucket.id);
      this.bucketTasks.push(bucketTaskElement);
    });
  }

  getTasksByBucket(bucketId: number): BucketTask {
    let tasks: Task[] = [];
    this.taskService.getTasksByBucket(bucketId).subscribe({
      next: (bucketTasks: Task[]) => {
        bucketTasks.forEach((task: Task) => {
          // Check if this task is assigned to the current user
          const isAssignedToUser = this.userTaskAssignations.some(
            (assignation: TaskAssignation) => assignation.task.id === task.id
          );
          if (isAssignedToUser) {
            tasks.push(task);
          }
        });
      },
    });
    // set the obtained values
    let bucketData: BucketTask = { id: bucketId, tasks: tasks };
    return bucketData;
  }

  getBucketPosition(bucketId: number): number {
    let index: number = 0;
    this.bucketTasks.forEach((bucketTask: BucketTask) => {
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

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Get the task that was moved
      const movedTask = event.previousContainer.data[event.previousIndex];

      // Extract bucket ID from the container ID (format: "list-{bucketId}")
      const newBucketId = parseInt(event.container.id.replace('list-', ''));

      // Update the task's bucket ID locally first
      const updatedTask: Task = {
        ...movedTask,
        bucket: {
          ...movedTask.bucket,
          id: newBucketId
        }
      };

      // Move the item in the UI
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update the task in the backend
      this.taskService.updateTask(movedTask.id, updatedTask).subscribe({
        next: (response: Task) => {
          console.log('Task updated successfully:', response);
        },
        error: (err) => {
          console.error('Error updating task:', err);
          // Revert the change if the backend update fails
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );
        }
      });
    }
  }

  // Get UserTaskAssignation for a specific task
  getUserTaskAssignationForTask(task: Task): UserTaskAssignation | null {
    const assignation = this.userTaskAssignations.find(
      (assignment: TaskAssignation) => assignment.task.id === task.id
    );

    if (assignation) {
      return {
        id: assignation.id,
        task: task,
        user: this.currentUser,
        isCompleted: assignation.completed
      };
    }
    return null;
  }

  // Mark task as completed
  markTaskAsCompleted(task: Task): void {
    const userTaskAssignation = this.getUserTaskAssignationForTask(task);

    if (!userTaskAssignation) {
      console.error('Task assignation not found');
      return;
    }

    const taskAssignation: TaskAssignation = {
      id: userTaskAssignation.id,
      user: {
        id: this.currentUser.id,
      },
      task: {
        id: task.id,
      },
      completed: true,
    };

    this.taskAssignationService
      .updateAssignation(userTaskAssignation.id, taskAssignation)
      .subscribe({
        next: (assignationUpdated: TaskAssignation) => {
          Swal.fire('Task completed', 'Task completed successfully!', 'success');
          // Remove the task from the UI
          this.removeTaskFromBuckets(task.id);
        },
        error: (err) => {
          console.error('Error marking task as completed:', err);
          Swal.fire('Error', 'Failed to mark task as completed', 'error');
        }
      });
  }

  // Remove task from buckets array after completion
  private removeTaskFromBuckets(taskId: number): void {
    this.bucketTasks.forEach((bucketTask: BucketTask) => {
      bucketTask.tasks = bucketTask.tasks.filter(task => task.id !== taskId);
    });
  }

  // Redirect to board (for the view button functionality)
  redirectToBoard(task: Task): void {
    const bucketId: number = task.bucket.id;
    this.bucketService.getBucketById(bucketId).subscribe({
      next: (bucket: Bucket) => {
        this.boardService.getBoardById(bucket.board.id).subscribe({
          next: (board: Board) => {
            this.router.navigate(['/dashboard/board', board]);
          },
          error: (err) => console.error('Error getting board:', err)
        });
      },
      error: (err) => console.error('Error getting bucket:', err)
    });
  }
}
