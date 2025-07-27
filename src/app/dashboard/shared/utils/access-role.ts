import { Injectable } from '@angular/core';
import { MenuItem } from 'src/app/interfaces/menuItem.interface';

@Injectable({
  providedIn: 'root',
})
export class AccessRole {
  items: MenuItem[] = [
    {
      title: 'Users',
      description: 'Here you can manage all the application users',
      icon: 'fa fa-users',
      roleAccess: ['Administrator'],
      redirection: '/dashboard/administrators',
    },
    {
      title: 'Projects',
      description: 'Here you can manage all the internal projects',
      icon: 'fa fa-clipboard',
      roleAccess: ['Administrator', 'Manager'],
      redirection: '/dashboard/projects',
    },
    {
      title: 'Kanban Boards',
      description: 'Here you can manage all the Kanban Boards.',
      icon: 'fa fa-table',
      roleAccess: ['Administrator', 'Manager'],
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
      roleAccess: ['Administrator', 'Manager'],
      redirection: '/dashboard/tasks',
    },
    {
      title: 'Subtasks',
      description: 'Here you can manage all the project tasks',
      icon: 'fa fa-check-circle',
      roleAccess: ['Administrator', 'Manager'],
      redirection: '/dashboard/subtasks',
    },
    {
      title: 'Project Teams',
      description: 'Monitor team members and track progress for each project',
      icon: 'fa fa-address-book',
      roleAccess: ['Administrator', 'Manager'],
      redirection: '/dashboard/project-members',
    },
    // Associate components
    {
      title: 'My Tasks',
      description: 'View my assigned tasks',
      icon: 'fa fa-tasks',
      roleAccess: ['Associate'],
      redirection: '/dashboard/my-tasks',
    },
    {
      title: 'Assigned Projects',
      description: 'View my assigned projects',
      icon: 'fa fa-clipboard',
      roleAccess: ['Associate'],
      redirection: '/dashboard/my-projects',
    },
    {
      title: 'My Profile',
      description: 'View my profile',
      icon: 'fa fa-user',
      roleAccess: ['Associate'],
      redirection: '/dashboard/my-profile',
    },
    {
      title: 'My Progress',
      description: 'View my work progress',
      icon: 'fa fa-pie-chart',
      roleAccess: ['Associate'],
      redirection: '/dashboard/my-progress',
    },
  ];

  // Get all the access items
  public getAccessItems(): MenuItem[] {
    return this.items;
  }
}
