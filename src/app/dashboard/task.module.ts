import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TaskRoutingModule } from './task-routing.module';
import { MainTaskComponent } from './main-task.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AdministratorsComponent } from './pages/administrators/administrators.component';
import { AddAdminModalComponent } from './pages/administrators/modals/add-admin-modal/add-admin-modal.component';
import { KanbanComponent } from './pages/kanban/kanban.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { AddKanbanModalComponent } from './pages/kanban/modals/add-kanban-modal/add-kanban-modal.component';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { AddProjectComponent } from './pages/projects/modals/add-project/add-project.component';
import { UpdateProjectComponent } from './pages/projects/modals/update-project/update-project.component';
import { UpdateKanbanModalComponent } from './pages/kanban/modals/update-kanban-modal/update-kanban-modal.component';
import { BucketsComponent } from './pages/buckets/buckets.component';
import { AddBucketModalComponent } from './pages/buckets/modals/add-bucket-modal/add-bucket-modal.component';
import { UpdateBucketModalComponent } from './pages/buckets/modals/update-bucket-modal/update-bucket-modal.component';
import { BadgesComponent } from './pages/badges/badges.component';
import { AddBadgeModalComponent } from './pages/badges/modals/add-badge-modal/add-badge-modal.component';
import { UpdateBadgeModalComponent } from './pages/badges/modals/update-badge-modal/update-badge-modal.component';
import { AddTaskModalComponent } from './pages/tasks/modals/add-task-modal/add-task-modal.component';
import { UpdateTaskModalComponent } from './pages/tasks/modals/update-task-modal/update-task-modal.component';
import { SubtasksComponent } from './pages/subtasks/subtasks.component';
import { AddSubtaskModalComponent } from './pages/subtasks/modals/add-subtask-modal/add-subtask-modal.component';
import { UpdateSubtaskModalComponent } from './pages/subtasks/modals/update-subtask-modal/update-subtask-modal.component';
import { ProjectInfoComponent } from './pages/projects/project-info/project-info.component';
import { ProjectBoardsComponent } from './pages/projects/project-boards/project-boards.component';
import { AssignUserComponent } from './pages/kanban/modals/assign-user/assign-user.component';
import { AssignTaskComponent } from './pages/tasks/modals/assign-task/assign-task.component';
import { AssignedProjectsComponent } from './pages/assignations/assigned-projects/assigned-projects.component';
import { AssignedTasksComponent } from './pages/assignations/assigned-tasks/assigned-tasks.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { MyCompletedTasksComponent } from './pages/assignations/assigned-tasks/my-completed-tasks/my-completed-tasks.component';
import { MyIncopletedTasksComponent } from './pages/assignations/assigned-tasks/my-incopleted-tasks/my-incopleted-tasks.component';
import { TaskInfoComponent } from './pages/tasks/task-info/task-info.component';
import { ProjectTeamTableComponent } from './pages/projects/project-team-table/project-team-table.component';
import { MyPerformanceComponent } from './pages/assignations/my-performance/my-performance.component';
import { NgChartsModule } from 'ng2-charts';
import { LoaderComponent } from '../shared/loader/loader.component';
@NgModule({
  declarations: [
    MainTaskComponent,
    NavbarComponent,
    FooterComponent,
    AdministratorsComponent,
    AddAdminModalComponent,
    KanbanComponent,
    TasksComponent,
    AddKanbanModalComponent,
    HomeComponent,
    ProjectsComponent,
    AddProjectComponent,
    UpdateProjectComponent,
    UpdateKanbanModalComponent,
    BucketsComponent,
    AddBucketModalComponent,
    UpdateBucketModalComponent,
    BadgesComponent,
    AddBadgeModalComponent,
    UpdateBadgeModalComponent,
    AddTaskModalComponent,
    UpdateTaskModalComponent,
    SubtasksComponent,
    AddSubtaskModalComponent,
    UpdateSubtaskModalComponent,
    ProjectInfoComponent,
    ProjectBoardsComponent,
    AssignUserComponent,
    AssignTaskComponent,
    AssignedProjectsComponent,
    AssignedTasksComponent,
    MyProfileComponent,
    MyCompletedTasksComponent,
    MyIncopletedTasksComponent,
    TaskInfoComponent,
    ProjectTeamTableComponent,
    MyPerformanceComponent,
  ],
  imports: [CommonModule, TaskRoutingModule, ReactiveFormsModule, FormsModule, NgChartsModule, LoaderComponent],
  exports: [MainTaskComponent, NavbarComponent, FooterComponent],
})
export class TaskModule {}
