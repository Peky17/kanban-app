import { Router } from '@angular/router';
import { Component, Input } from '@angular/core';
import { Project } from 'src/app/interfaces/project.interface';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css'],
})
export class ProjectInfoComponent {
  @Input() project!: Project;

  constructor(private router: Router) {}

  redirectToProjectBoards(): void {
    // Send data an redirect
    this.router.navigate(['/dashboard/project-boards', this.project]);
  }
}
