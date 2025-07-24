// frontend/app/componentes/estadisticas/estadisticas.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Api } from '../../services/api';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartOptions, ChartType, registerables } from 'chart.js';
import { RouterLink } from '@angular/router'; // <-- IMPORTAR RouterLink

// --- NUEVA INTERFAZ PARA LOS PRODUCTOS DEL MODAL ---
interface ProductoInfo {
  nombre: string;
  cantidad: number;
  stock_minimo: number;
}
// (otras interfaces se mantienen igual)
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
  imports: [CommonModule, BaseChartDirective, CurrencyPipe, RouterLink], // <-- AÑADIR RouterLink
  templateUrl: './estadisticas.html',
  styleUrls: ['./estadisticas.css']
})
export class EstadisticasComponent implements OnInit {
  // (propiedades de los gráficos existentes se mantienen igual)
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

  // --- NUEVAS PROPIEDADES PARA EL MODAL ---
  public modalTitulo = '';
  public productosModal: ProductoInfo[] = [];
  public isLoadingModal = false;

  constructor(private api: Api) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.cargarVentasPorFecha('daily');
    this.cargarTopProductos('facturacion');
    this.cargarStockStatus();
  }

  // --- NUEVA FUNCIÓN PARA MOSTRAR LOS DETALLES DEL STOCK ---
  verDetalleStock(estado: 'suficiente' | 'bajo' | 'critico' | 'agotado'): void {
    this.productosModal = []; // Limpiamos la lista anterior
    this.isLoadingModal = true;

    // Asignamos un título amigable para el modal
    switch (estado) {
      case 'suficiente': this.modalTitulo = 'Productos con Stock Suficiente'; break;
      case 'bajo': this.modalTitulo = 'Productos con Stock Bajo'; break;
      case 'critico': this.modalTitulo = 'Productos con Stock Crítico'; break;
      case 'agotado': this.modalTitulo = 'Productos Agotados'; break;
    }

    // Llamamos al nuevo endpoint del backend
    this.api.get<ProductoInfo[]>(`/estadisticas/productos-por-estado/?estado=${estado}`).subscribe({
      next: (data) => {
        this.productosModal = data;
        this.isLoadingModal = false;
      },
      error: (err) => {
        console.error(`Error al cargar productos con estado ${estado}`, err);
        this.isLoadingModal = false;
        // Aquí podrías añadir una alerta de error si lo deseas
      }
    });
  }

  cargarVentasPorFecha(periodo: string): void {
    this.api.get<ChartData>(`/estadisticas/ventas-por-fecha/?periodo=${periodo}`).subscribe(data => {
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
    this.api.get<ChartData>(`/estadisticas/top-productos/?metrica=${metrica}`).subscribe(data => {
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
    this.api.get<StockStatus[]>(`/estadisticas/stock-status/`).subscribe(data => {
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