import { Board } from 'src/app/interfaces/board.interface';
import { BoardService } from './../../../../services/board.service';
import { Component, Input } from '@angular/core';
import { Bucket } from 'src/app/interfaces/bucket.interface';
import { BucketService } from 'src/app/services/bucket.service';
import { Router } from '@angular/router';
import { TaskAssignationService } from 'src/app/services/task-assignation.service';
import {
  TaskAssignation,
  UserTaskAssignation,
} from 'src/app/interfaces/taskAssignation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.css'],
})
export class TaskInfoComponent {
  @Input() userTaskAssignation!: UserTaskAssignation;

  constructor(
    private bucketService: BucketService,
    private boardService: BoardService,
    private taskAssignationService: TaskAssignationService,
    private router: Router
  ) {}

  redirectToBoard() {
    let bucketId: number = this.userTaskAssignation.task.bucket.id;
    this.bucketService.getBucketById(bucketId).subscribe((bucket: Bucket) => {
      this.boardService
        .getBoardById(bucket.board.id)
        .subscribe((board: Board) => {
          this.router.navigate(['/dashboard/board', board]);
        });
    });
  }

  markAsDone() {
    let idAssignation: number = this.userTaskAssignation.id;
    let taskAssignation: TaskAssignation = {
      id: idAssignation,
      user: {
        id: this.userTaskAssignation.user.id,
      },
      task: {
        id: this.userTaskAssignation.task.id,
      },
      completed: true,
    };

    this.taskAssignationService
      .updateAssignation(idAssignation, taskAssignation)
      .subscribe((assignationUpdated: TaskAssignation) => {
        Swal.fire('Task completed', 'Task completed!', 'success');
        window.location.reload();
      });
  }
}
