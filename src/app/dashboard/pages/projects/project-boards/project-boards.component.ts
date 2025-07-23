import { Component } from '@angular/core';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { Board } from 'src/app/interfaces/board.interface';
import { BoardService } from 'src/app/services/board.service';

@Component({
  selector: 'app-project-boards',
  templateUrl: './project-boards.component.html',
  styleUrls: ['./project-boards.component.css'],
})
export class ProjectBoardsComponent {
  project!: any;
  boards: Board[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService
  ) {}

  ngOnInit(): void {
    // Get project data
    this.route.params.subscribe({
      next: (value: Params) => (this.project = value),
      error: (err) => console.error('Error:', err),
    });
    // Get boards associated with the project
    this.boardService
      .getBoardsByProjectId(this.project.id)
      .subscribe((boards) => {
        this.boards = boards;
      });
  }

  redirectToBoards(board: Board): void {
    // Send data an redirect
    this.router.navigate(['/dashboard/board', board]);
  }
}
