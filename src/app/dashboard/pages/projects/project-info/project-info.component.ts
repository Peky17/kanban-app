import { Router } from '@angular/router';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Project } from 'src/app/interfaces/project.interface';
import { ProjectAssignationService } from 'src/app/services/project-assignation.service';
import { AdministratorService } from 'src/app/services/administrator.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css'],
})
export class ProjectInfoComponent implements OnInit, OnChanges {
  @Input() project!: Project;


  constructor(
    private router: Router,
    private assignationService: ProjectAssignationService,
    private administratorService: AdministratorService
  ) {}


  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }



  redirectToProjectBoards(): void {
    this.router.navigate(['/dashboard/project-boards', this.project]);
  }
}
