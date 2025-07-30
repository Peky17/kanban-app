import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Badge } from 'src/app/interfaces/badge.interface';
import { BadgeService } from 'src/app/services/badge.service';

@Component({
  selector: 'app-add-badge-modal',
  templateUrl: './add-badge-modal.component.html',
  styleUrls: ['./add-badge-modal.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class AddBadgeModalComponent {
  addFormulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private badgeService: BadgeService
  ) {}

  ngOnInit(): void {
    this.addFormulario = this.fb.group({
      text: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(13),
        ],
      ],
      color: ['', [Validators.required]],
    });
  }

  createBadge() {
    const formData = this.addFormulario.value;
    console.log(formData);
    let boardId = this.addFormulario.value.board;
    if (this.addFormulario.invalid || boardId == -17) {
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
      this.badgeService.createBadge(formData).subscribe(
        (res) => {
          this.modalService.dismissAll();
          Swal.fire({
            title: 'SUCCESS',
            text: 'Badge created successfully',
            icon: 'success',
          }).then(() => {
            location.reload();
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

  open(content: any) {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
    };

    this.modalService.open(content, modalOptions);
  }
}
