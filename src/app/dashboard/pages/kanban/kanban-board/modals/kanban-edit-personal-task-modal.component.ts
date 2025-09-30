import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonalTask } from 'src/app/interfaces/personalTask.interface';
import { PersonalTaskService } from 'src/app/services/personal-task.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kanban-edit-personal-task-modal',
  templateUrl: './kanban-edit-personal-task-modal.component.html',
  styleUrls: ['./kanban-edit-personal-task-modal.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class KanbanEditPersonalTaskModalComponent {
  @Input() task!: PersonalTask;

  title: string = '';
  description: string = '';
  dueDate: string = '';

  isLoading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private personalTaskService: PersonalTaskService
  ) {}

  ngOnInit() {
    if (this.task) {
      this.title = this.task.title;
      this.description = this.task.description;
      this.dueDate = this.task.dueDate;
    }
  }

  updateTask() {
    if (!this.title.trim()) {
      Swal.fire('Error', 'Title is required', 'error');
      return;
    }
    this.isLoading = true;
    const updatedTask: PersonalTask = {
      ...this.task,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate
    };
    this.personalTaskService.updateTask(this.task.id, updatedTask).subscribe({
      next: (response) => {
        Swal.fire('Updated', 'Task updated successfully!', 'success');
        this.activeModal.close('updated');
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'Failed to update task', 'error');
        this.isLoading = false;
      }
    });
  }

  closeModal() {
    this.activeModal.dismiss('cancel');
  }
}
