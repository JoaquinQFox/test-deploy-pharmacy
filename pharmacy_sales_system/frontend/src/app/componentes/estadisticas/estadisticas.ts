import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Api } from '../../services/api';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

interface ChartData {
  labels: string[];
  datasets: { data: number[]; label: string; }[];
}
interface StockStatus {
  status: 'suficiente' | 'bajo' | 'critico' | 'agotado';
  count: number;
}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, CurrencyPipe],
  templateUrl: './estadisticas.html',
  styleUrls: ['./estadisticas.css']
})
export class EstadisticasComponent implements OnInit {
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  public lineChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: false };
  
  public barChartType: ChartType = 'bar';
  public barChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  public barChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: false, indexAxis: 'y' };

  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  public doughnutChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: false };

  public stockCounts = { suficiente: 0, bajo: 0, critico: 0, agotado: 0 };

  constructor(private api: Api) {}

  ngOnInit(): void {
    this.cargarVentasPorFecha('daily');
    this.cargarTopProductos('facturacion');
    this.cargarStockStatus();
  }

  cargarVentasPorFecha(periodo: string): void {
    this.api.get<ChartData>(`/ventas/estadisticas/ventas-por-fecha/?periodo=${periodo}`).subscribe(data => {
      this.lineChartData = {
        ...data,
        datasets: data.datasets.map(ds => ({
          ...ds,
          fill: 'origin',
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          tension: 0.3
        }))
      };
    });
  }

  cargarTopProductos(metrica: string): void {
    this.api.get<ChartData>(`/ventas/estadisticas/top-productos/?metrica=${metrica}`).subscribe(data => {
      this.barChartData = {
        ...data,
        datasets: data.datasets.map(ds => ({
          ...ds,
          backgroundColor: '#10b981'
        }))
      };
    });
  }

  cargarStockStatus(): void {
    this.api.get<StockStatus[]>(`/ventas/estadisticas/stock-status/`).subscribe(data => {
      this.stockCounts = { suficiente: 0, bajo: 0, critico: 0, agotado: 0 };
      data.forEach(item => this.stockCounts[item.status] = item.count);
      
      this.doughnutChartData = {
        labels: ['Suficiente', 'Bajo', 'Crítico', 'Agotado'],
        datasets: [{
          data: [
            this.stockCounts.suficiente,
            this.stockCounts.bajo,
            this.stockCounts.critico,
            this.stockCounts.agotado,
          ],
          backgroundColor: ['#22c55e', '#facc15', '#ef4444', '#6b7280'],
          hoverBackgroundColor: ['#16a34a', '#eab308', '#dc2626', '#4b5563'],
          borderWidth: 1
        }]
      };
    });
  }
}