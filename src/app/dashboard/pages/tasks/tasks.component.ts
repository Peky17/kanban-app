import { Component } from '@angular/core';
import { Task } from 'src/app/interfaces/task.interface';
import { TaskService } from 'src/app/services/task.service';
import Swal from 'sweetalert2';
import { Paginator } from 'src/app/shared/utils/paginator';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent {
  tasks: Task[] = [];
  paginator: Paginator<Task> = new Paginator([], 5);

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
      this.paginator.setItems(tasks);
    });
  }

  onPageChange(page: number) {
    this.paginator.goToPage(page);
  }

  confirmDelete(id: number, name: string, description: string): void {
    Swal.fire({
      title: 'Do you want to delete this task?',
      text: `${name}: ${description}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'No, Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteTask(id);
      }
    });
  }

  deleteTask(id: number): void {
    this.taskService.deleteTaskById(id).subscribe(
      () => {
        Swal.fire('Deleted', 'Task deleted!', 'success');
        this.getTasks();
      },
      (error) => {
        Swal.fire('Error', 'An error has occurred', 'error');
        console.log(error);
      }
    );
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
