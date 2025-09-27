import { Board } from 'src/app/interfaces/board.interface';
import { BoardService } from './../../../../services/board.service';
import { Component, Input, OnInit } from '@angular/core';
import { Bucket } from 'src/app/interfaces/bucket.interface';
import { BucketService } from 'src/app/services/bucket.service';
import { Router } from '@angular/router';
import { TaskAssignationService } from 'src/app/services/task-assignation.service';
import { SubtaskService } from 'src/app/services/subtask.service';
import { UserSubtaskAssign } from 'src/app/interfaces/userSubtaskAssign.interface';
import { Subtask } from 'src/app/interfaces/subtask.interface';
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
export class TaskInfoComponent implements OnInit {
  getChecked(event: Event): boolean {
    return !!(event.target && (event.target as HTMLInputElement).checked);
  }
  allSubtasksCompleted(): boolean {
    return this.userSubtasks.length > 0 && this.userSubtasks.every(s => s.completed === true);
  }
  @Input() userTaskAssignation!: UserTaskAssignation;
  userSubtasks: UserSubtaskAssign[] = [];
  subtaskDetails: { [subtaskId: string]: Subtask } = {};
  loadingSubtasks = false;
  subtasks: any[] = [];

  constructor(
    private bucketService: BucketService,
    private boardService: BoardService,
    private taskAssignationService: TaskAssignationService,
    private subtaskService: SubtaskService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchUserAssignedSubtasks();
  }

  fetchUserAssignedSubtasks() {
    this.loadingSubtasks = true;
    const userId = this.userTaskAssignation.user.id;
    console.log('[fetchUserAssignedSubtasks] userId:', userId);
    this.taskAssignationService.getUserSubtasksByUserId(userId).subscribe({
      next: (subtasks: any[]) => {
        console.log('[fetchUserAssignedSubtasks] subtasks asignadas:', subtasks);
        // Filtrar subtasks por la tarea actual
        // Obtener detalles de cada subtask y filtrar por tarea
        this.userSubtasks = [];
        let pending = (subtasks || []).length;
        if (pending === 0) {
          this.loadingSubtasks = false;
        }
        (subtasks || []).forEach((us: any) => {
          this.subtaskService.getSubtaskById(Number(us.subtaskId)).subscribe({
            next: (subtask: Subtask) => {
              this.subtaskDetails[us.subtaskId] = subtask;
              // Solo agregar si pertenece a la tarea actual
              if (subtask.task && subtask.task.id === this.userTaskAssignation.task.id) {
                this.userSubtasks.push(us);
              }
              pending--;
              if (pending === 0) {
                this.loadingSubtasks = false;
              }
            },
            error: (err: any) => {
              console.error('[fetchUserAssignedSubtasks] Error obteniendo detalle de subtask:', err);
              pending--;
              if (pending === 0) {
                this.loadingSubtasks = false;
              }
            }
          });
        });
      },
      error: (err: any) => {
        console.error('[fetchUserAssignedSubtasks] Error obteniendo subtasks:', err);
        this.userSubtasks = [];
        this.loadingSubtasks = false;
      }
    });
  }

  onSubtaskCheckChange(userSubtask: any, checked: boolean) {
    this.taskAssignationService
      .updateUserSubtaskStatus(userSubtask.id, checked)
      .subscribe({
        next: () => {
          userSubtask.completed = checked;
          this.checkAllSubtasksCompleted();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo actualizar la subtask', 'error');
        }
      });
  }

  checkAllSubtasksCompleted() {
    if (this.userSubtasks.length > 0 && this.userSubtasks.every(s => s.completed)) {
      // Todas las subtasks están completas, puedes permitir marcar la tarea como completada
      // Aquí podrías mostrar un botón o marcar automáticamente la tarea
    }
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
