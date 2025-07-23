import { AuthService } from './../../../services/auth.service';
import { Component } from '@angular/core';
import { User } from '../../../interfaces/user.interface';

interface MenuItem {
  title: string;
  description: string;
  icon: string;
  roleAccess: string[];
  redirection: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  // All available cards
  cards: MenuItem[] = [
    {
      title: 'Users',
      description: 'Here you can manage all the application users',
      icon: 'fa fa-users',
      roleAccess: ['Administrator', 'Manager'],
      redirection: '/dashboard/administrators',
    },
    {
      title: 'Projects',
      description: 'Here you can manage all the internal projects',
      icon: 'fa fa-clipboard',
      roleAccess: ['Administrator'],
      redirection: '/dashboard/projects',
    },
    {
      title: 'Kanban Boards',
      description: 'Here you can manage all the Kanban Boards.',
      icon: 'fa fa-table',
      roleAccess: ['Administrator', 'Manager', 'Associate'],
      redirection: '/dashboard/kanban',
    },
    {
      title: 'Kanban Buckets',
      description: 'Here you can manage all the board buckets',
      icon: 'fa fa-bookmark',
      roleAccess: ['Administrator', 'Manager'],
      redirection: '/dashboard/buckets',
    },
    {
      title: 'Badges',
      description: 'Here you can manage all the project badges',
      icon: 'fa fa-tag',
      roleAccess: ['Administrator', 'Manager'],
      redirection: '/dashboard/badges',
    },
    {
      title: 'Tasks',
      description: 'Here you can manage all the project tasks',
      icon: 'fa fa-tasks',
      roleAccess: ['Administrator', 'Manager', 'Associate'],
      redirection: '/dashboard/tasks',
    },
    {
      title: 'Subtasks',
      description: 'Here you can manage all the project tasks',
      icon: 'fa fa-check-circle',
      roleAccess: ['Administrator', 'Manager', 'Associate'],
      redirection: '/dashboard/subtasks',
    },
    {
      title: 'My Profile',
      description: 'Here you can manage your profile data',
      icon: 'fa fa-user',
      roleAccess: ['Administrator', 'Manager', 'Associate'],
      redirection: '/dashboard/administrators',
    },
  ];
  // access modules
  modules: MenuItem[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
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
