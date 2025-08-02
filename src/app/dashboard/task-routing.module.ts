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
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { ProjectMembersComponent } from './pages/projects/project-members/project-members.component';
import { AccessGuard } from '../guards/access.guard';

const routes: Routes = [
  {
    path: '',
    component: MainTaskComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
      },
      {
        path: 'administrators',
        component: AdministratorsComponent,
        canActivate: [AuthGuard, AccessGuard],
        canLoad: [AuthGuard, AccessGuard],
      },
      {
        path: 'projects',
        component: ProjectsComponent,
        canActivate: [AuthGuard, AccessGuard],
        canLoad: [AuthGuard, AccessGuard],
      },
      {
        path: 'project-members',
        component: ProjectMembersComponent,
        canActivate: [AuthGuard, AccessGuard],
        canLoad: [AuthGuard, AccessGuard],
      },
      {
        path: 'tasks',
        component: TasksComponent,
        canActivate: [AuthGuard, AccessGuard],
        canLoad: [AuthGuard, AccessGuard],
      },
      {
        path: 'subtasks',
        component: SubtasksComponent,
        canActivate: [AuthGuard, AccessGuard],
        canLoad: [AuthGuard, AccessGuard],
      },
      {
        path: 'kanban',
        component: KanbanComponent,
        canActivate: [AuthGuard, AccessGuard],
        canLoad: [AuthGuard, AccessGuard],
      },
      {
        path: 'buckets',
        component: BucketsComponent,
        canActivate: [AuthGuard, AccessGuard],
        canLoad: [AuthGuard, AccessGuard],
      },
      {
        path: 'badges',
        component: BadgesComponent,
        canActivate: [AuthGuard, AccessGuard],
        canLoad: [AuthGuard, AccessGuard],
      },
      {
        path: 'project-boards',
        component: ProjectBoardsComponent,
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
      },
      {
        path: 'board',
        component: KanbanBoardComponent,
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
      },
      {
        path: 'my-projects',
        component: AssignedProjectsComponent,
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
      },
      {
        path: 'my-tasks',
        component: AssignedTasksComponent,
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
      },
      {
        path: 'my-profile',
        component: MyProfileComponent,
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
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
