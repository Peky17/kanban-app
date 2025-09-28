import { Component, OnInit } from '@angular/core';
import { Board } from 'src/app/interfaces/board.interface';
import { Router } from '@angular/router';
import { BoardService } from 'src/app/services/board.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserBoard } from 'src/app/interfaces/board.interface';

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
    private authService: AuthService
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
    this.router.navigate(['/dashboard/kanban', board.id]);
  }

  openCreateBoardModal() {
    // Lógica para abrir modal de creación de tablero
    alert('Abrir modal para crear tablero');
  }

  editBoard(board: Board) {
    // Lógica para editar tablero
    alert('Editar tablero: ' + board.name);
  }

  deleteBoard(board: Board) {
    if (confirm('¿Eliminar tablero: ' + board.name + '?')) {
      this.boardService.deleteBoardById(board.id).subscribe();
    }
  }

  redirectToBoards(board: Board) {
    alert('Redirigir a la vista de tableros completa');
    // this.router.navigate(['/dashboard/boards', board.id]);
  }
}
