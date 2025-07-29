import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdministratorService } from 'src/app/services/administrator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.css'],
})
export class AdministratorsComponent implements OnInit {
  administrators: any[] = [];

  constructor(
    private administratorService: AdministratorService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getAdministrators();
  }

  getAdministrators(): void {
    this.administratorService.getAdministrators().subscribe((data) => {
      this.administrators = data;
    });
  }

  isCurrentUserEmail(userEmail: string): boolean {
    let loggedEmail = localStorage.getItem('email');
    let cleanEmail = loggedEmail!.replace(/['"]/g, '');
    if (cleanEmail != userEmail) return false;
    else return true;
  }

  confirmDelete(id: string, name: string): void {
    Swal.fire({
      title: 'Are you sure you want to delete this record?',
      text: `Administrator: ${name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteAdministrator(id);
      }
    });
  }

  deleteAdministrator(id: string): void {
    this.administratorService.deleteAdministrator(id).subscribe(
      () => {
        Swal.fire(
          'Deleted',
          'The administrator has been deleted.',
          'success'
        );
        this.getAdministrators();
      },
      (error) => {
        Swal.fire(
          'Error',
          'There was a problem deleting the administrator.',
          'error'
        );
      }
    );
  }
}
