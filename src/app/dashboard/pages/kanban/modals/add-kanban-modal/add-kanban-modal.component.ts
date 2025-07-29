import { Board } from 'src/app/interfaces/board.interface';
import { BoardService } from './../../../../../services/board.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { Project } from 'src/app/interfaces/project.interface';
import { ProjectService } from 'src/app/services/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-kanban-modal',
  templateUrl: './add-kanban-modal.component.html',
  styleUrls: ['./add-kanban-modal.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class AddKanbanModalComponent {
  projects: Project[] = [];
  addFormulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private boardService: BoardService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    // get all projects
    this.getAllProjects();
    // init reactive form
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    this.addFormulario = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(40),
        ],
      ],
      createdAt: [
        formattedDate,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      project: [-17, [Validators.required]],
    });
  }

  open(content: any) {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
    };

    this.modalService.open(content, modalOptions);
  }

  createBoard(): void {
    const formData = this.addFormulario.value;
    console.log(formData);
    let projectId = this.addFormulario.value.project;
    if (this.addFormulario.invalid || projectId == -17) {
      Swal.fire({
        toast: true,
        title: 'OPERACIÓN DENEGADA',
        text: 'Por favor, complete todos los campos',
        icon: 'error',
        position: 'top-right',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else {
      this.boardService.createBoard(formData).subscribe(
        (res) => {
          this.modalService.dismissAll();
          Swal.fire({
            title: 'SUCCESS',
            text: 'Board created successfully',
            icon: 'success',
          }).then(() => {
            location.reload();
          });
        },
        (err) => {
          Swal.fire({
            title: 'OPERACIÓN DENEGADA',
            text: err.error.message,
            icon: 'error',
          });
          this.modalService.dismissAll();
        }
      );
    }
  }

  getAllProjects() {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      },
    });
  }
}
