import { AccessRole } from './../../shared/utils/access-role';
import { AuthService } from './../../../services/auth.service';
import { Component } from '@angular/core';
import { User } from '../../../interfaces/user.interface';
import { MenuItem } from 'src/app/interfaces/menuItem.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  // All available cards
  cards: MenuItem[] = [];
  // access modules
  modules: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private accesRole: AccessRole
  ) {}

  ngOnInit(): void {
    this.cards = this.accesRole.getAccessItems();
    this.authService.getUserRole().subscribe({
      next: (data: User) => {
        this.cards.forEach((moduleAccess) => {
          moduleAccess.roleAccess.forEach((access) => {
            if (access === data.role.name) this.modules.push(moduleAccess);
          });
        });
      },
      error: (error) => {
        console.error('Error al obtener datos:', error);
      },
    });
  }
}
function next(value: any[]): void {
  throw new Error('Function not implemented.');
}
