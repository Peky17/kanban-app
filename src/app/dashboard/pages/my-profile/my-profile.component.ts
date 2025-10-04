import { Component } from '@angular/core';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdministratorService } from 'src/app/services/administrator.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
})
export class MyProfileComponent {
  user: User | undefined;
  profileForm: FormGroup;
  isEditing = false;
  loading = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private administratorService: AdministratorService
  ) {
    this.profileForm = this.fb.group({
      name: [{ value: '', disabled: true }, Validators.required],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      cellphone: [{ value: '', disabled: true }],
      won: [{ value: '', disabled: true }],
      employeeNumber: [{ value: '', disabled: true }],
    });
  }

  ngOnInit() {
    this.authService.getUserInSession().subscribe((user) => {
      this.user = user;
      this.profileForm.patchValue({
        name: user.name,
        email: user.email,
        cellphone: user.cellphone,
        won: user.won,
        employeeNumber: user.employeeNumber,
      });
    });
  }

  enableEdit() {
    this.isEditing = true;
    this.profileForm.enable();
  }

  cancelEdit() {
    this.isEditing = false;
    this.profileForm.patchValue({
      name: this.user?.name,
      email: this.user?.email,
      cellphone: this.user?.cellphone,
      won: this.user?.won,
      employeeNumber: this.user?.employeeNumber,
    });
    this.profileForm.disable();
  }

  updateProfile() {
    if (!this.user) return;
    if (this.profileForm.invalid) return;
    this.loading = true;
    const updatedData = {
      ...this.user,
      ...this.profileForm.value,
    };
    this.administratorService
      .updateAdministrator(this.user.id.toString(), updatedData)
      .subscribe({
        next: (_res: any) => {
          this.user = { ...this.user, ...this.profileForm.value };
          this.cancelEdit();
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Profile updated',
            text: 'Your changes have been saved successfully.',
            confirmButtonText: 'Ok',
          });
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
