import { Component, OnInit } from '@angular/core';
// Para el evento beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  deferredPrompt: BeforeInstallPromptEvent | null = null;
  showInstallButton = false;

  ngOnInit(): void {
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      event.preventDefault();
      this.deferredPrompt = event as BeforeInstallPromptEvent;
      this.showInstallButton = true;
    });
  }

  installPWA() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          // Usuario aceptó la instalación
        }
        this.deferredPrompt = null;
        this.showInstallButton = false;
      });
    }
  }
  miFormulario: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(12)],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    this.authService.login(this.miFormulario.value).subscribe({
      next: (res) => {
        // Guardar token en localStorage
        localStorage.setItem('token', JSON.stringify(res.token));
        // Guardar usuario en localStorage
        localStorage.setItem(
          'email',
          JSON.stringify(this.miFormulario.value.email)
        );
        // Mostrar mensaje de éxito
        Swal.fire({
          title: 'LOGIN SUCCESSFUL',
          text: 'Welcome ' + this.miFormulario.value.email,
          icon: 'success',
        });
        // Redireccionar
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          Swal.fire({
            title: 'Invalid credentials',
            text: 'The email or password is incorrect.',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        }
      }
    });
  }
}
