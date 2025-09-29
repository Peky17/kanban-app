import { Component, OnInit } from '@angular/core';
import { Board } from 'src/app/interfaces/board.interface';
import { Router } from '@angular/router';
import { BoardService } from 'src/app/services/board.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserBoard } from 'src/app/interfaces/board.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateBoardModalPlannerComponent } from './modals/update-board-modal-planner/update-board-modal-planner.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-planner',
  templateUrl: './my-planner.component.html',
  styleUrls: ['./my-planner.component.css']
})


export class MyPlannerComponent implements OnInit {
  personalBoards: Board[] = [];
  userId: number | null = null;

  constructor(
    private router: Router,
    private boardService: BoardService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  onBoardCreated(board: Board) {
    if (board) {
      this.personalBoards = [board, ...this.personalBoards];
    }
  }

  ngOnInit(): void {
    // 1. Obtener el usuario en sesión
    this.authService.getUserRole().subscribe({
      next: (user) => {
        this.userId = user.id;
        // 2. Obtener asociaciones user-board por userId
        this.boardService.getUserBoardAssociationByUserId(this.userId).subscribe({
          next: (userBoardAssociations) => {
            // Si el endpoint regresa un array:
            const associations = Array.isArray(userBoardAssociations) ? userBoardAssociations : [userBoardAssociations];
            // 3. Por cada asociación, obtener el board
            const boardRequests = associations.map((assoc: UserBoard) =>
              this.boardService.getBoardById(assoc.boardId)
            );
            // Esperar a que todas las peticiones de boards terminen
            Promise.all(boardRequests.map(obs => obs.toPromise())).then((boards: (Board | undefined)[]) => {
              this.personalBoards = boards.filter((b): b is Board => !!b);
            });
          },
          error: (err) => {
            this.personalBoards = [];
          }
        });
      },
      error: (err) => {
        this.personalBoards = [];
      }
    });
  }

  goToBoard(board: Board) {
    this.router.navigate(['/dashboard/board', board.id]);
  }

  openCreateBoardModal() {
    // Lógica para abrir modal de creación de tablero
    alert('Abrir modal para crear tablero');
  }

  editBoard(board: Board) {
    const modalRef = this.modalService.open(UpdateBoardModalPlannerComponent, {
      backdrop: 'static',
      keyboard: true,
    });
    modalRef.componentInstance.board = board;
    modalRef.componentInstance.boardUpdated.subscribe((updatedBoard: Board) => {
      // Actualizar la lista local de boards
      this.personalBoards = this.personalBoards.map(b => b.id === updatedBoard.id ? updatedBoard : b);
    });
  }

  deleteBoard(board: Board) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the board "${board.name}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.boardService.deleteBoardById(board.id).subscribe({
          next: () => {
            this.personalBoards = this.personalBoards.filter(b => b.id !== board.id);
            Swal.fire('Deleted!', 'The board has been deleted.', 'success');
          },
          error: (err) => {
            Swal.fire('Error', err.error?.message || 'Could not delete the board.', 'error');
          }
        });
      }
    });
  }

  redirectToBoards(board: Board) {
    alert('Redirigir a la vista de tableros completa');
    // this.router.navigate(['/dashboard/boards', board.id]);
  }
}
