import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { Board } from 'src/app/interfaces/board.interface';
import { BoardService } from 'src/app/services/board.service';
import { User } from 'src/app/interfaces/user.interface';
import { AdministratorService } from 'src/app/services/administrator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-kanban-modal',
  templateUrl: './update-kanban-modal.component.html',
  styleUrls: ['./update-kanban-modal.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class UpdateKanbanModalComponent {
  @Input() board!: Board;
  users: User[] = [];
  updateFormulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private boardService: BoardService,
    private administratorService: AdministratorService
  ) {}

  ngOnInit(): void {
    // get all projects
    this.getAllUsers();
    // init reactive form
    this.updateFormulario = this.fb.group({
      name: [
        this.board.name,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      description: [
        this.board.description,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(100),
        ],
      ],
      createdAt: [this.board.createdAt, [Validators.required]],
      createdBy: [this.board.createdBy?.id, [Validators.required]],
    });
  }

  getAllUsers() {
    this.administratorService.getAdministrators().subscribe({
      next: (users: User[]) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
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

  updateBoard() {
    let formData = this.updateFormulario.value;
    console.log(formData);
    let createdById = this.updateFormulario.value.createdBy;
    if (this.updateFormulario.invalid || createdById == -17) {
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
      this.boardService.updateBoard(this.board.id, formData).subscribe(
        (res) => {
          this.modalService.dismissAll();
          Swal.fire({
            title: 'SUCCESS',
            text: 'Board created successfully',
            icon: 'success',
          });
        },
        (err) => {
          Swal.fire({
            title: 'FAILED ACTION!',
            text: err.error.message,
            icon: 'error',
          });
          this.modalService.dismissAll();
        }
      );
    }
  }
}
