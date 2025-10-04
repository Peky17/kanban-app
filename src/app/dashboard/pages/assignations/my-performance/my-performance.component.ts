import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartData } from 'chart.js';
import { TaskAssignationService } from 'src/app/services/task-assignation.service';
import { TaskService } from 'src/app/services/task.service';
import { AuthService } from 'src/app/services/auth.service';
import { TaskAssignation } from 'src/app/interfaces/taskAssignation';
import { User } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-my-performance',
  templateUrl: './my-performance.component.html',
  styleUrls: ['./my-performance.component.css']
})
export class MyPerformanceComponent implements OnInit {
  isLoading = true;
  userId!: number;
  assignedTasks: TaskAssignation[] = [];
  completedTasks: TaskAssignation[] = [];
  tasksMap: { [id: number]: import('src/app/interfaces/task.interface').Task } = {};
  // Priorities for mapping
  priorityLabels: string[] = ['High', 'Medium', 'Low'];
  priorityCompletedData: number[] = [0, 0, 0];
  priorityPendingData: number[] = [0, 0, 0];
  barChartData: ChartData<'bar'> = {
    labels: this.priorityLabels,
    datasets: [
      { data: this.priorityCompletedData, label: 'Completed', backgroundColor: '#66BB6A' },
      { data: this.priorityPendingData, label: 'Pending', backgroundColor: '#EF5350' }
    ]
  };
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: true } }
  };
  barChartType: 'bar' = 'bar';

  // Pie chart for completion rate
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Completed', 'Pending'],
    datasets: [
      { data: [0, 0], backgroundColor: ['#66BB6A', '#EF5350'] }
    ]
  };
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: { legend: { display: true } }
  };
  pieChartType: 'pie' = 'pie';

  constructor(
    private taskAssignationService: TaskAssignationService,
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUserRole().subscribe({
      next: (user: User) => {
        this.userId = user.id;
        this.loadAssignedTasks();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadAssignedTasks() {
    this.taskAssignationService.getTaskAssignationByUserId(this.userId).subscribe({
      next: (tasks: TaskAssignation[]) => {
        this.assignedTasks = tasks;
        this.completedTasks = tasks.filter(t => t.completed);
        // Obtener los IDs únicos de las tareas asignadas
        const taskIds = Array.from(new Set(tasks.map(t => t.task.id)));
        // Obtener detalles completos de las tareas
        this.taskService.tasks$.subscribe((allTasks) => {
          this.tasksMap = {};
          taskIds.forEach(id => {
            const found = allTasks.find(t => t.id === id);
            if (found) this.tasksMap[id] = found;
          });
          this.updateCharts();
          this.isLoading = false;
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  updateCharts() {
    // Reset priority data
    this.priorityCompletedData = [0, 0, 0];
    this.priorityPendingData = [0, 0, 0];
    // Map tasks by priority and completion
    this.assignedTasks.forEach(taskAssign => {
      // Usar la tarea completa desde tasksMap
      const task = this.tasksMap[taskAssign.task.id];
      const priority = task?.priority || '';
      const idx = this.priorityLabels.findIndex(p => p.toLowerCase() === priority.toLowerCase());
      if (idx !== -1) {
        if (taskAssign.completed) {
          this.priorityCompletedData[idx]++;
        } else {
          this.priorityPendingData[idx]++;
        }
      }
    });
    this.barChartData = {
      labels: this.priorityLabels,
      datasets: [
        { data: this.priorityCompletedData, label: 'Completed', backgroundColor: '#66BB6A' },
        { data: this.priorityPendingData, label: 'Pending', backgroundColor: '#EF5350' }
      ]
    };
    // Pie chart
    const completed = this.completedTasks.length;
    const assigned = this.assignedTasks.length;
    this.pieChartData = {
      labels: ['Completed', 'Pending'],
      datasets: [
        { data: [completed, Math.max(assigned - completed, 0)], backgroundColor: ['#66BB6A', '#EF5350'] }
      ]
    };
  }

  get completionRate(): number {
    const assigned = this.assignedTasks.length;
    return assigned ? Math.round((this.completedTasks.length / assigned) * 100) : 0;
  }

  get avgTasksPerDay(): number {
    // For demo, use 7 days. Replace with real period if needed.
    return this.completedTasks.length ? Math.round(this.completedTasks.length / 7) : 0;
  }
}
