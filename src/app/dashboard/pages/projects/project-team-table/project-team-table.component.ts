
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ProjectAssignationService } from 'src/app/services/project-assignation.service';
import { AdministratorService } from 'src/app/services/administrator.service';
import { ProjectAssignation } from 'src/app/interfaces/projectAssignation.interface';
import { User } from 'src/app/interfaces/user.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project-team-table',
  templateUrl: './project-team-table.component.html',
  styleUrls: ['./project-team-table.component.css'],
})
export class ProjectTeamTableComponent implements OnInit, OnChanges {
  @Input() projectId!: number;
  @Output() memberRemoved = new EventEmitter<void>();
  members: any[] = [];

  constructor(
    private assignationService: ProjectAssignationService,
    private administratorService: AdministratorService
  ) {}


  ngOnInit() {
    if (this.projectId) {
      this.loadMembers();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['projectId'] && this.projectId) {
      this.loadMembers();
    }
  }

  async loadMembers() {
    this.members = [];
    if (!this.projectId) return;
    this.assignationService.getAssignationsByProjectId(this.projectId).subscribe({
      next: async (assignations: ProjectAssignation[]) => {
        if (!assignations || assignations.length === 0) {
          this.members = [];
          return;
        }
        const members: any[] = [];
        for (let i = 0; i < assignations.length; i++) {
          const assignation = assignations[i];
          let userId: number | null = null;
          if (assignation && assignation.user && assignation.user.id) {
            userId = assignation.user.id;
          } else if (assignation && assignation.id) {
            userId = assignation.id;
          } else {
            continue;
          }
          if (!userId) continue;
          try {
            const user = await this.administratorService.getAdministratorById(userId.toString()).toPromise();
            if (user) {
              members.push({ ...user, assignationId: assignation.id });
            }
          } catch (error) {
            // Si falla un usuario, lo omite
          }
        }
        this.members = members;
      },
      error: () => {
        this.members = [];
      }
    });
  }

  getUserInitial(user: any): string {
    return user?.name ? user.name.charAt(0).toUpperCase() : '?';
  }

  removeMember(member: any) {
    Swal.fire({
      title: '¿Eliminar asignación?',
      text: `¿Seguro que deseas eliminar a ${member.name} del proyecto?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.assignationService
          .deleteAssignationById(member.assignationId)
          .subscribe(() => {
            Swal.fire(
              'Eliminado',
              'El usuario fue eliminado del proyecto',
              'success'
            );
            this.members = this.members.filter(
              (m) => m.assignationId !== member.assignationId
            );
            this.memberRemoved.emit();
          });
      }
    });
  }
}
