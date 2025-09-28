import { Component } from '@angular/core';
import { BoardService } from './../../../../../services/board.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-board-modal-planner',
  templateUrl: './create-board-modal-planner.component.html',
  styleUrls: ['./create-board-modal-planner.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class CreateBoardModalPlannerComponent {
  users: User[] = [];
  addFormulario!: FormGroup;

  currentUserId: number | null = null;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private boardService: BoardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUserRole().subscribe({
      next: (user) => {
        this.currentUserId = user.id;
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10);
        this.addFormulario = this.fb.group({
          name: [
            '',
            [
              Validators.required,
              Validators.minLength(4),
              Validators.maxLength(20),
            ],
          ],
          description: [
            '',
            [
              Validators.required,
              Validators.minLength(4),
              Validators.maxLength(80),
            ],
          ],
          createdAt: [formattedDate, [Validators.required]],
          createdBy: [user.id, [Validators.required]],
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo obtener el usuario en sesión',
          icon: 'error',
        });
      },
    });
  }

  open(content: any) {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
    };

    this.modalService.open(content, modalOptions);
  }

  createBoard(): void {
    if (this.currentUserId) {
      this.addFormulario.get('createdBy')?.setValue(this.currentUserId);
    }
    const formData = this.addFormulario.value;
    if (this.addFormulario.invalid || !this.currentUserId) {
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
    } else {
      this.boardService.createBoard(formData).subscribe({
        next: (board) => {
          // Crear la asociación user-board
          this.boardService.createUserBoardAssociation(this.currentUserId!, board.id).subscribe({
            next: () => {
              this.modalService.dismissAll();
              Swal.fire({
                title: 'SUCCESS',
                text: 'Board created and associated successfully',
                icon: 'success',
              });
            },
            error: (err) => {
              Swal.fire({
                title: 'Board created, but association failed',
                text: err.error?.message || 'Error creating user-board association',
                icon: 'warning',
              });
              this.modalService.dismissAll();
            }
          });
        },
        error: (err) => {
          Swal.fire({
            title: 'FAILED ACTION!',
            text: err.error.message,
            icon: 'error',
          });
          this.modalService.dismissAll();
        }
      });
    }
  }
}
