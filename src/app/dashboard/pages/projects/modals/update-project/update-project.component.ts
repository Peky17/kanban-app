import { Component, Input } from '@angular/core';
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
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class UpdateProjectComponent {
  @Input() project: Project | undefined;

  updateFormulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.updateFormulario = this.fb.group({
      name: [
        this.project?.name,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      description: [
        this.project?.description,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(90),
        ],
      ],
      startDate: [this.project?.startDate, [Validators.required]],
      dueDate: [this.project?.dueDate, [Validators.required]],
      createdAt: [this.project?.createdAt, [Validators.required]],
    });
  }

  open(content: any) {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
    };
    this.modalService.open(content, modalOptions);
  }

  updateProject() {
    const formData = this.updateFormulario.value;
    console.log(formData);
    if (this.updateFormulario.invalid) {
      Swal.fire({
        toast: true,
        title: 'FAILED ACTION!',
        text: 'Please complete all the fields',
        icon: 'error',
        position: 'top-right',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else {
      this.projectService.updateProject(this.project!.id, formData).subscribe(
        (res) => {
          this.modalService.dismissAll();
          Swal.fire({
            title: 'SUCCESS',
            text: 'Project saved successfully',
            icon: 'success',
          });
        },
        (err) => {
          Swal.fire({
            title: 'FAILED ACTION!',
            text: err.error.message,
            icon: 'error',
          });
          this.modalService.dismissAll();
        }
      );
    }
  }
}
