import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(private router: Router) {}

  // Cerrar sesión
  logOut() {
    Swal.fire({
      title: '¿Do you want to exit?',
      text: 'The application erase your session',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Exit',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        this.router.navigateByUrl('auth/login');
      }
    });
  }
}
