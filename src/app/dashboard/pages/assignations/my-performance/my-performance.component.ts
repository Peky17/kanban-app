import { Component } from '@angular/core';
import { ChartOptions, ChartType, ChartData } from 'chart.js';

@Component({
  selector: 'app-my-performance',
  templateUrl: './my-performance.component.html',
  styleUrls: ['./my-performance.component.css']
})
export class MyPerformanceComponent {
  // Gráfico de tareas completadas por periodo
  periodLabels: string[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  completedTasksData: number[] = [5, 7, 6, 8, 4, 3, 9]; // Ejemplo
  barChartData: ChartData<'bar'> = {
    labels: this.periodLabels,
    datasets: [
      { data: this.completedTasksData, label: 'Tareas completadas', backgroundColor: '#42A5F5' }
    ]
  };
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: true } }
  };
  barChartType: 'bar' = 'bar';

  // Gráfico de tasa de finalización
  completed: number = 42; // Ejemplo
  assigned: number = 50; // Ejemplo
  get completionRate(): number {
    return this.assigned ? Math.round((this.completed / this.assigned) * 100) : 0;
  }
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Completadas', 'Pendientes'],
    datasets: [
      { data: [this.completed, this.assigned - this.completed], backgroundColor: ['#66BB6A', '#EF5350'] }
    ]
  };
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: { legend: { display: true } }
  };
  pieChartType: 'pie' = 'pie';

  // Promedio de tareas completadas por día
  get avgTasksPerDay(): number {
    return Math.round(this.completed / 7); // Ejemplo: semana
  }
}
