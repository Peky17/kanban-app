import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { Board } from 'src/app/interfaces/board.interface';
import { BoardService } from 'src/app/services/board.service';
import Swal from 'sweetalert2';
import { AdministratorService } from 'src/app/services/administrator.service';
import { User } from 'src/app/interfaces/user.interface';
import { ProjectAssignationService } from 'src/app/services/project-assignation.service';

@Component({
  selector: 'app-assign-user',
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class AssignUserComponent {
  boards: Board[] = [];
  users: User[] = [];
  addFormulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private administratorService: AdministratorService,
  private boardService: BoardService,
  private projectAssignationService: ProjectAssignationService
  ) {}

  open(content: any) {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
    };

    this.modalService.open(content, modalOptions);
  }

  ngOnInit(): void {
  // get all boards
  this.getAllBoards();
    // get all users
    this.getAllUsers();
    // init reactive form
    this.addFormulario = this.fb.group({
      board: [-17, [Validators.required]],
      user: [-17, [Validators.required]],
    });
  }

  assignUser() {
    const formData = this.addFormulario.value;
    console.log(formData);
  let boardId = this.addFormulario.value.board;
  if (this.addFormulario.invalid || boardId == -17) {
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
  this.projectAssignationService.createAssignation(formData).subscribe(
        (res) => {
          this.modalService.dismissAll();
          Swal.fire({
            title: 'SUCCESS',
            text: 'user assigned successfully',
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

  getAllBoards() {
    this.boardService.getBoards().subscribe({
      next: (boards: Board[]) => {
        this.boards = boards;
      },
      error: (error) => {
        console.error('Error fetching boards:', error);
      },
    });
  }

  getAllUsers() {
    this.administratorService.getAdministrators().subscribe({
      next: (users: User[]) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      },
    });
  }
}
