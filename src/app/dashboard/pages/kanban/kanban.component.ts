import { BoardService } from './../../../services/board.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Board } from 'src/app/interfaces/board.interface';
import Swal from 'sweetalert2';
import { Paginator } from 'src/app/shared/utils/paginator';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css'],
})
export class KanbanComponent {
  boards: Board[] = [];
  paginator: Paginator<Board> = new Paginator([], 5);

  constructor(private router: Router, private boardService: BoardService) {}

  ngOnInit(): void {
    this.boardService.getBoards().subscribe({
      next: (data) => {
        this.boards = data;
        this.paginator.setItems(data);
      },
      error: (error) => {
        console.error('Error al obtener datos:', error);
      },
    });
  }

  onPageChange(page: number) {
    this.paginator.goToPage(page);
  }

  confirmDelete(id: number, name: string): void {
    Swal.fire({
      title: 'Do you want to delete this Board?',
      text: `Board: ${name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteBoard(id);
      }
    });
  }

  deleteBoard(id: number): void {
    this.boardService.deleteBoardById(id).subscribe(
      () => {
        Swal.fire(
          'Deleted',
          'The board has been deleted successfully',
          'success'
        );
        window.location.reload();
      },
      (error) => {
        Swal.fire('Error', 'There was a problem deleting the board.', 'error');
      }
    );
  }

  redirectToBoard(board: Board): void {
    // Send data and redirect
    this.router.navigate(['/dashboard/board', board]);
  }
}
