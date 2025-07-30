import { Component } from '@angular/core';
import { Subtask } from 'src/app/interfaces/subtask.interface';
import { SubtaskService } from 'src/app/services/subtask.service';
import Swal from 'sweetalert2';
import { Paginator } from 'src/app/shared/utils/paginator';

@Component({
  selector: 'app-subtasks',
  templateUrl: './subtasks.component.html',
  styleUrls: ['./subtasks.component.css'],
})
export class SubtasksComponent {
  subtasks: Subtask[] = [];
  paginator: Paginator<Subtask> = new Paginator([], 5);

  constructor(private subtaskService: SubtaskService) {}

  getSubtasks(): void {
    this.subtaskService.getSubtasks().subscribe((subtasks) => {
      this.subtasks = subtasks;
      this.paginator.setItems(subtasks);
    });
  }

  onPageChange(page: number) {
    this.paginator.goToPage(page);
  }

  ngOnInit(): void {
    this.getSubtasks();
  }

  confirmDelete(id: number, name: string): void {
    Swal.fire({
      title: 'Do you want to delete this subtask?',
      text: `${name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'No, Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteSubtask(id);
      }
    });
  }

  deleteSubtask(id: number): void {
    this.subtaskService.deleteSubtaskById(id).subscribe(
      () => {
        Swal.fire('Deleted', 'Subtask deleted!', 'success');
        this.getSubtasks();
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
