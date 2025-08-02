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
  // English labels for days
  periodLabels: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  completedTasksData: number[] = [0, 0, 0, 0, 0, 0, 0];
  barChartData: ChartData<'bar'> = {
    labels: this.periodLabels,
    datasets: [
      { data: this.completedTasksData, label: 'Completed Tasks', backgroundColor: '#42A5F5' }
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
        this.updateCharts();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  updateCharts() {
    // Reset data
    this.completedTasksData = [0, 0, 0, 0, 0, 0, 0];
    // Count completed tasks per day (by dueDate or createdAt)
    this.completedTasks.forEach(taskAssign => {
      // For demo, use random day. Replace with real date logic as needed.
      const dayIdx = Math.floor(Math.random() * 7); // Replace with: getDayIndex(task)
      this.completedTasksData[dayIdx]++;
    });
    this.barChartData = {
      labels: this.periodLabels,
      datasets: [
        { data: this.completedTasksData, label: 'Completed Tasks', backgroundColor: '#42A5F5' }
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
