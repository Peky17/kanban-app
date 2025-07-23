import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BucketService } from './../../../../../services/bucket.service';
import { Component, Input } from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { BoardService } from 'src/app/services/board.service';
import { Board } from 'src/app/interfaces/board.interface';
import Swal from 'sweetalert2';
import { Bucket } from 'src/app/interfaces/bucket.interface';

@Component({
  selector: 'app-update-bucket-modal',
  templateUrl: './update-bucket-modal.component.html',
  styleUrls: ['./update-bucket-modal.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class UpdateBucketModalComponent {
  @Input() bucket!: Bucket;
  boards: Board[] = [];
  updateFormulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private boardService: BoardService,
    private bucketService: BucketService
  ) {}

  ngOnInit(): void {
    console.log(this.bucket);
    // get all projects
    this.getAllBoards();
    this.updateFormulario = this.fb.group({
      name: [
        this.bucket.name,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      description: [
        this.bucket.description,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(40),
        ],
      ],
      color: [this.bucket.color, [Validators.required]],
      createdAt: [
        this.bucket.createdAt,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      board: [this.bucket.board.id, [Validators.required]],
    });
  }

  updateBucket() {
    const formData = this.updateFormulario.value;
    console.log(formData);
    let boardId = this.updateFormulario.value.board;
    if (this.updateFormulario.invalid || boardId == -17) {
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
      this.bucketService.updateBucket(this.bucket.id, formData).subscribe(
        (res) => {
          this.modalService.dismissAll();
          Swal.fire({
            title: 'OPERACIÓN EXITOSA',
            text: 'Bucket updated successfully',
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

  getAllBoards() {
    this.boardService.getBoards().subscribe({
      next: (boards) => {
        this.boards = boards;
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
}
