import { ProjectService } from './../../../services/project.service';
import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/interfaces/project.interface';
import Swal from 'sweetalert2';
import { Paginator } from 'src/app/shared/utils/paginator';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  paginator: Paginator<Project> = new Paginator([], 5);

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects(): void {
    this.projectService.getProjects().subscribe((projects) => {
      this.projects = projects;
      this.paginator.setItems(projects);
    });
  }

  onPageChange(page: number) {
    this.paginator.goToPage(page);
  }

  confirmDelete(id: string, name: string, description: string): void {
    Swal.fire({
      title: 'Do you want to delete this project?',
      text: `${name}: ${description}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'No, Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteProject(id);
      }
    });
  }

  deleteProject(id: string): void {
    this.projectService.deleteProjectById(id).subscribe(
      () => {
        Swal.fire('Deleted', 'Project deleted', 'success');
        this.getProjects();
      },
      (error) => {
        Swal.fire('Error', 'An error has occurred', 'error');
        console.log(error);
      }
    );
  }
}
