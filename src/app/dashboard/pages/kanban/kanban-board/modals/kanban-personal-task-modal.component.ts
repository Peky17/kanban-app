import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonalTaskService } from 'src/app/services/personal-task.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kanban-personal-task-modal',
  templateUrl: './kanban-personal-task-modal.component.html',
  styleUrls: ['./kanban-personal-task-modal.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class KanbanPersonalTaskModalComponent implements OnInit {
  @Input() userId!: number;
  @Input() boardId!: number;
  @Input() bucketId!: number;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() task: any = null;

  taskForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private personalTaskService: PersonalTaskService
  ) {}

  ngOnInit(): void {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    this.taskForm = this.fb.group({
      title: [this.task?.title || '', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
      description: [this.task?.description || '', [Validators.required, Validators.minLength(4), Validators.maxLength(120)]],
      dueDate: [this.task?.dueDate || '', [Validators.required]],
      createdAt: [this.task?.createdAt || formattedDate, [Validators.required]],
      bucketId: [this.bucketId, [Validators.required]],
      userId: [this.userId, [Validators.required]],
      completed: [this.task?.completed || false],
    });
  }

  saveTask() {
    if (this.taskForm.invalid) {
      Swal.fire({
        toast: true,
        title: 'FAILED ACTION!',
        text: 'Please complete all the fields',
        icon: 'error',
        position: 'top-right',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }
    const formData = this.taskForm.value;
    if (this.mode === 'create') {
      this.personalTaskService.createTask(formData).subscribe({
        next: () => {
          this.activeModal.close('created');
          Swal.fire({ title: 'SUCCESS', text: 'Task created successfully', icon: 'success' });
        },
        error: (err) => {
          Swal.fire({ title: 'FAILED ACTION!', text: err.error.message, icon: 'error' });
        }
      });
    } else if (this.mode === 'edit' && this.task) {
      this.personalTaskService.updateTask(this.task.id, { ...formData, id: this.task.id }).subscribe({
        next: () => {
          this.activeModal.close('updated');
          Swal.fire({ title: 'SUCCESS', text: 'Task updated successfully', icon: 'success' });
        },
        error: (err) => {
          Swal.fire({ title: 'FAILED ACTION!', text: err.error.message, icon: 'error' });
        }
      });
    }
  }
}
