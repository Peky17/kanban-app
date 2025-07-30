import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BucketService } from './../../../../../services/bucket.service';
import { Component } from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { BoardService } from 'src/app/services/board.service';
import { Board } from 'src/app/interfaces/board.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-bucket-modal',
  templateUrl: './add-bucket-modal.component.html',
  styleUrls: ['./add-bucket-modal.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class AddBucketModalComponent {
  boards: Board[] = [];
  addFormulario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private boardService: BoardService,
    private bucketService: BucketService
  ) {}

  ngOnInit(): void {
    // get all projects
    this.getAllBoards();
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
      color: ['', [Validators.required]],
      createdAt: [
        formattedDate,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      board: [-17, [Validators.required]],
    });
  }

  createBucket() {
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
      this.bucketService.createBucket(formData).subscribe(
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
            title: 'FAILED ACTION!',
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
