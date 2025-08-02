import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from 'src/app/services/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class AddProjectComponent {
  addFormulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private projectService: ProjectService
  ) {
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
          Validators.maxLength(90),
        ],
      ],
      startDate: [formattedDate, [Validators.required]],
      dueDate: [formattedDate, [Validators.required]],
      createdAt: [formattedDate, [Validators.required]],
    });
  }

  open(content: any) {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
    };

    this.modalService.open(content, modalOptions);
  }

  createProject(): void {
    const formData = this.addFormulario.value;
    console.log(formData);
    if (this.addFormulario.invalid) {
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
      this.projectService.createProject(formData).subscribe(
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
