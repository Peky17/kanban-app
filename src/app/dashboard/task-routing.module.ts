import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainTaskComponent } from './main-task.component';
import { AuthGuard } from '../guards/auth.guard';
import { AdministratorsComponent } from './pages/administrators/administrators.component';
import { KanbanComponent } from './pages/kanban/kanban.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { RoleGuard } from '../guards/role.guard';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { BucketsComponent } from './pages/buckets/buckets.component';
import { BadgesComponent } from './pages/badges/badges.component';
import { SubtasksComponent } from './pages/subtasks/subtasks.component';
import { ProjectBoardsComponent } from './pages/projects/project-boards/project-boards.component';
import { KanbanBoardComponent } from './pages/kanban/kanban-board/kanban-board.component';
import { AssignedProjectsComponent } from './pages/assignations/assigned-projects/assigned-projects.component';
import { AssignedTasksComponent } from './pages/assignations/assigned-tasks/assigned-tasks.component';

const routes: Routes = [
  {
    path: '',
    component: MainTaskComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard, RoleGuard],
        canLoad: [AuthGuard, RoleGuard],
      },
      {
        path: 'administrators',
        component: AdministratorsComponent,
        canActivate: [AuthGuard, RoleGuard],
        canLoad: [AuthGuard, RoleGuard],
      },
      {
        path: 'projects',
        component: ProjectsComponent,
        canActivate: [AuthGuard, RoleGuard],
        canLoad: [AuthGuard, RoleGuard],
      },
      {
        path: 'tasks',
        component: TasksComponent,
        canActivate: [AuthGuard, RoleGuard],
        canLoad: [AuthGuard, RoleGuard],
      },
      {
        path: 'subtasks',
        component: SubtasksComponent,
        canActivate: [AuthGuard, RoleGuard],
        canLoad: [AuthGuard, RoleGuard],
      },
      {
        path: 'kanban',
        component: KanbanComponent,
        canActivate: [AuthGuard, RoleGuard],
        canLoad: [AuthGuard, RoleGuard],
      },
      {
        path: 'buckets',
        component: BucketsComponent,
        canActivate: [AuthGuard, RoleGuard],
        canLoad: [AuthGuard, RoleGuard],
      },
      {
        path: 'badges',
        component: BadgesComponent,
        canActivate: [AuthGuard, RoleGuard],
        canLoad: [AuthGuard, RoleGuard],
      },
      {
        path: 'project-boards',
        component: ProjectBoardsComponent,
        canActivate: [AuthGuard, RoleGuard],
        canLoad: [AuthGuard, RoleGuard],
      },
      {
        path: 'board',
        component: KanbanBoardComponent,
        canActivate: [AuthGuard, RoleGuard],
        canLoad: [AuthGuard, RoleGuard],
      },
      {
        path: 'my-projects',
        component: AssignedProjectsComponent,
        canActivate: [AuthGuard, RoleGuard],
        canLoad: [AuthGuard, RoleGuard],
      },
      {
        path: 'my-tasks',
        component: AssignedTasksComponent,
        canActivate: [AuthGuard, RoleGuard],
        canLoad: [AuthGuard, RoleGuard],
      },
      {
        path: '**',
        redirectTo: 'home',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskRoutingModule {}
