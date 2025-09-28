import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Project } from 'src/app/interfaces/project.interface';
import { AdministratorService } from 'src/app/services/administrator.service';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css'],
})
export class ProjectInfoComponent implements OnInit, OnChanges {
  @Input() project!: Project;

  constructor(private administratorService: AdministratorService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}
}
