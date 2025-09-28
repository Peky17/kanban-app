import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Board } from 'src/app/interfaces/board.interface';
import { BoardService } from 'src/app/services/board.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-board-modal-planner',
  templateUrl: './update-board-modal-planner.component.html',
  styleUrls: ['./update-board-modal-planner.component.css']
})
export class UpdateBoardModalPlannerComponent implements OnInit {
  @Input() board!: Board;
  @Output() boardUpdated = new EventEmitter<Board>();
  updateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private boardService: BoardService
  ) {}

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      name: [this.board?.name || '', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      description: [this.board?.description || '', [Validators.required, Validators.minLength(4), Validators.maxLength(80)]],
      createdAt: [this.board?.createdAt || '', [Validators.required]],
      createdBy: [this.board?.createdBy?.id || '', [Validators.required]],
    });
  }

  updateBoard(): void {
    if (this.updateForm.invalid) {
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
    const updatedData = { ...this.board, ...this.updateForm.value };
    this.boardService.updateBoard(this.board.id, updatedData).subscribe({
      next: (updatedBoard) => {
        this.boardUpdated.emit(updatedBoard);
        this.activeModal.close();
        Swal.fire({
          title: 'SUCCESS',
          text: 'Board updated successfully',
          icon: 'success',
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'FAILED ACTION!',
          text: err.error?.message || 'Error updating board',
          icon: 'error',
        });
      }
    });
  }
}
