import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  miFormulario: FormGroup = this.fb.group({
    email: ['kike17@gmail.com', [Validators.required, Validators.email]],
    password: [
      'peky20011',
      [Validators.required, Validators.minLength(6), Validators.maxLength(12)],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    this.authService.login(this.miFormulario.value).subscribe((res) => {
      // Guardar token en localStorage
      localStorage.setItem('token', JSON.stringify(res.token));
      // Guardar usuario en localStorage
      localStorage.setItem(
        'email',
        JSON.stringify(this.miFormulario.value.email)
      );
      // Mostrar mensaje de éxito
      Swal.fire({
        title: 'SESIÓN INICIADA CON ÉXITO',
        text: 'Bienvenido ' + this.miFormulario.value.email,
        icon: 'success',
      });
      // Redireccionar
      this.router.navigateByUrl('/dashboard');
    });
  }
}
