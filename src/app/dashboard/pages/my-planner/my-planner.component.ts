
import { Component, OnInit } from '@angular/core';
import { Board } from 'src/app/interfaces/board.interface';
import { Router } from '@angular/router';
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: 'app-my-planner',
  templateUrl: './my-planner.component.html',
  styleUrls: ['./my-planner.component.css']
})

export class MyPlannerComponent implements OnInit {
  personalBoards: Board[] = [];

  constructor(
    private router: Router,
    private boardService: BoardService
  ) {}

  ngOnInit(): void {
    this.boardService.getBoards().subscribe((boards) => {
      this.personalBoards = boards;
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
