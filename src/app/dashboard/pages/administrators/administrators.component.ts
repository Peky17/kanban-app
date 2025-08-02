import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdministratorService } from 'src/app/services/administrator.service';
import Swal from 'sweetalert2';
import { Paginator } from 'src/app/shared/utils/paginator';

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.css'],
})
export class AdministratorsComponent implements OnInit {
  administrators: any[] = [];
  paginator: Paginator<any> = new Paginator([], 5);

  searchTerm: string = '';
  filteredAdministrators: any[] = [];

  constructor(
    private administratorService: AdministratorService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while we fetch the administrators.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.administratorService.getAdministrators().subscribe({
      next: (data) => {
        this.administrators = data;
        this.filterData();
        setTimeout(() => Swal.close(), 500);
      },
      error: () => {
        Swal.fire('Error', 'Failed to load administrators.', 'error');
      }
    });
  }

  // getAdministrators eliminado, ya no es necesario

  filterData(): void {
    if (!this.searchTerm) {
      this.filteredAdministrators = this.administrators;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredAdministrators = this.administrators.filter((admin) =>
        Object.values(admin).some((val) =>
          val && val.toString().toLowerCase().includes(term)
        )
      );
    }
    this.paginator.setItems(this.filteredAdministrators);
    this.paginator.goToPage(1);
  }

  onPageChange(page: number) {
    this.paginator.goToPage(page);
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
        // Ya no es necesario llamar a getAdministrators(), el servicio lo actualiza automáticamente
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
