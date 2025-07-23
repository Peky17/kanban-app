import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { Board } from 'src/app/interfaces/board.interface';
import { Project } from 'src/app/interfaces/project.interface';
import { BoardService } from 'src/app/services/board.service';
import { ProjectService } from 'src/app/services/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-kanban-modal',
  templateUrl: './update-kanban-modal.component.html',
  styleUrls: ['./update-kanban-modal.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class UpdateKanbanModalComponent {
  @Input() board!: Board;
  projects: Project[] = [];
  updateFormulario!: FormGroup;

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
    this.updateFormulario = this.fb.group({
      name: [
        this.board.name,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      description: [
        this.board.description,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(40),
        ],
      ],
      createdAt: [
        this.board.createdAt,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      project: [this.board.project.id, [Validators.required]],
    });
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

  open(content: any) {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
    };

    this.modalService.open(content, modalOptions);
  }

  updateBoard() {
    let formData = this.updateFormulario.value;
    console.log(formData);
    let projectId = this.updateFormulario.value.project;
    if (this.updateFormulario.invalid || projectId == -17) {
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
      this.boardService.updateBoard(this.board.id, formData).subscribe(
        (res) => {
          this.modalService.dismissAll();
          Swal.fire({
            title: 'OPERACIÓN EXITOSA',
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
}
