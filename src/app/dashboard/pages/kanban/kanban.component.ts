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
  filteredBoards: Board[] = [];
  paginator: Paginator<Board> = new Paginator([], 5);
  searchTerm: string = '';

  constructor(private router: Router, private boardService: BoardService) {}

  ngOnInit(): void {
    this.getBoards();
  }

  getBoards(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while we fetch the boards.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.boardService.getBoards().subscribe(
      (data) => {
        this.boards = data;
        this.filteredBoards = data;
        this.paginator.setItems(data);
        setTimeout(() => Swal.close(), 500); // Add delay before closing
      },
      (error) => {
        console.error('Error al obtener datos:', error);
        Swal.fire('Error', 'Failed to load boards.', 'error');
      }
    );
  }

  onPageChange(page: number) {
    this.paginator.goToPage(page);
  }

  filterData() {
    if (!this.searchTerm) {
      this.filteredBoards = this.boards;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredBoards = this.boards.filter(board =>
        board.name.toLowerCase().includes(term) ||
        board.id.toString().includes(term) ||
        board.project.id.toString().includes(term) ||
        (board.createdAt && board.createdAt.toLowerCase().includes(term))
      );
    }
    this.paginator.setItems(this.filteredBoards);
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
