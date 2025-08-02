import { Component } from '@angular/core';
import { Task } from 'src/app/interfaces/task.interface';
import {
  TaskAssignation,
  UserTaskAssignation,
} from 'src/app/interfaces/taskAssignation';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { TaskAssignationService } from 'src/app/services/task-assignation.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-my-incopleted-tasks',
  templateUrl: './my-incopleted-tasks.component.html',
  styleUrls: ['./my-incopleted-tasks.component.css'],
})
export class MyIncopletedTasksComponent {
  taskCounter: number = 0;
  userTaskAssignations: UserTaskAssignation[] = [];
  currentUser!: User;
  isLoading: boolean = true; // Bootstrap loader state

  constructor(
    private taskAssignationService: TaskAssignationService,
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUserRole().subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.getTasksAssigned(user.id);
      },
      error: () => {
        this.isLoading = false; // Stop loader on error
      },
    });
  }

  getTasksAssigned(id: number) {
    this.taskAssignationService.getTaskAssignationByUserId(id).subscribe({
      next: (assignedTasks: TaskAssignation[]) => {
        this.saveTaskAssigned(assignedTasks);
        this.isLoading = false; // Stop loader after data is loaded
      },
      error: () => {
        this.isLoading = false; // Stop loader on error
      },
    });
  }

  saveTaskAssigned(assignedTasks: TaskAssignation[]) {
    assignedTasks.forEach((assignedTask: TaskAssignation) => {
      let taskId = assignedTask.task.id;
      this.taskService.getTaskById(taskId).subscribe({
        next: (task: Task) => {
          // filter the incompleted tasks
          if (assignedTask.completed === false) {
            this.taskCounter++;
            let userTaskAssignation: UserTaskAssignation = {
              id: assignedTask.id,
              task: task,
              user: this.currentUser,
              isCompleted: assignedTask.completed,
            };
            this.userTaskAssignations.push(userTaskAssignation);
            console.log(userTaskAssignation);
          }
        },
      });
    });
  }

  getPriorityColor(priority: string): number {
    let numberCode = 0;
    switch (priority) {
      case 'High':
        numberCode = 1;
        break;
      case 'Medium':
        numberCode = 2;
        break;
      case 'Low':
        numberCode = 3;
        break;
    }
    return numberCode;
  }
}
