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
import { ActivatedRoute } from '@angular/router';
import { Bucket } from 'src/app/interfaces/bucket.interface';
import { BucketService } from 'src/app/services/bucket.service';
import { TaskService } from 'src/app/services/task.service';

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
  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private bucketService: BucketService
  ) {}

  ngOnInit(): void {
    // Get board data
    this.route.params.subscribe({
      next: (value) => (this.board = value),
      error: (err) => console.error('Error:', err),
    });
    // Get board buckets
    this.bucketService.getBucketsByBoard(this.board.id).subscribe({
      next: (bucketsObtained: Bucket[]) =>
        this.initBucketsAndTasks(bucketsObtained),
      error: (err) => console.error('Error:', err),
    });
  }

  initBucketsAndTasks(bucketsObtained: Bucket[]): void {
    this.buckets = bucketsObtained;
    // get tasks for each bucket and save
    this.buckets.forEach((bucket: Bucket) => {
      let bucketTaskElement: BucketTask = this.getTasksByBucket(bucket.id);
      this.bucketTasks.push(bucketTaskElement);
    });
  }

  getTasksByBucket(bucketId: number): BucketTask {
    let taskNames: string[] = [];
    this.taskService.getTasksByBucket(bucketId).subscribe({
      next(tasks: Task[]) {
        tasks.forEach((task: Task) => {
          taskNames.push(task.name);
        });
      },
    });
    // set the obtained values
    let bucketData: BucketTask = { id: bucketId, taskNames: taskNames };
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

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
