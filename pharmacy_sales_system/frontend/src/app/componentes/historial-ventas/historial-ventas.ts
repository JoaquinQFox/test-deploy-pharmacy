// frontend/app/componentes/historial-ventas/historial-ventas.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- IMPORTANTE: Añadir FormsModule
import { Api } from '../../services/api';
import { Venta } from '../../../models/venta.model';

@Component({
  selector: 'app-historial-ventas',
  standalone: true,
  // Asegúrate de importar FormsModule para usar ngModel
  imports: [CommonModule, DatePipe, CurrencyPipe, FormsModule], 
  templateUrl: './historial-ventas.html',
  styleUrls: ['./historial-ventas.css']
})
export class HistorialVentas implements OnInit {

  ventas: Venta[] = [];
  isLoading = true;

  // --- Propiedades para los filtros ---
  filtroAnio: number | null = null;
  filtroMes: number | null = null;
  filtroDia: number | null = null;

  // --- Opciones para los menús desplegables ---
  opcionesAnio: number[] = [];
  opcionesMes: { valor: number, nombre: string }[] = [];
  opcionesDia: number[] = [];

  constructor(private api: Api) { }

  ngOnInit(): void {
    this.cargarVentas();
    this.inicializarOpcionesMes();
  }

  cargarVentas(params?: any): void {
    this.isLoading = true;
    let endpoint = '/ventas/';

    if (params) {
      // Construimos los parámetros de la URL para el filtrado
      const query = new URLSearchParams(params).toString();
      endpoint += `?${query}`;
    }

    this.api.get<Venta[]>(endpoint).subscribe({
      next: (data) => {
        this.ventas = data.map(venta => ({ ...venta, detallesVisibles: false }));
        // Si es la carga inicial, generamos las opciones de años
        if (!params) {
          this.generarOpcionesAnio();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar el historial de ventas:', err);
        this.isLoading = false;
      }
    });
  }

  private generarOpcionesAnio(): void {
    // Extraemos los años únicos de las fechas de las ventas
    const anios = this.ventas.map(v => new Date(v.fecha).getFullYear());
    // Usamos Set para obtener valores únicos y luego lo convertimos a array
    this.opcionesAnio = [...new Set(anios)].sort((a, b) => b - a); // Orden descendente
  }

  private inicializarOpcionesMes(): void {
    this.opcionesMes = [
      { valor: 1, nombre: 'Enero' }, { valor: 2, nombre: 'Febrero' },
      { valor: 3, nombre: 'Marzo' }, { valor: 4, nombre: 'Abril' },
      { valor: 5, nombre: 'Mayo' }, { valor: 6, nombre: 'Junio' },
      { valor: 7, nombre: 'Julio' }, { valor: 8, nombre: 'Agosto' },
      { valor: 9, nombre: 'Septiembre' }, { valor: 10, nombre: 'Octubre' },
      { valor: 11, nombre: 'Noviembre' }, { valor: 12, nombre: 'Diciembre' }
    ];
  }

  onAnioChange(): void {
    // Cuando cambia el año, reseteamos mes y día
    this.filtroMes = null;
    this.filtroDia = null;
    this.opcionesDia = [];
  }

  onMesChange(): void {
    this.filtroDia = null;
    if (this.filtroAnio && this.filtroMes) {
      // Calculamos los días del mes seleccionado
      const diasEnMes = new Date(this.filtroAnio, this.filtroMes, 0).getDate();
      // Llenamos el array de días desde 1 hasta el número de días del mes
      this.opcionesDia = Array.from({ length: diasEnMes }, (_, i) => i + 1);
    } else {
      this.opcionesDia = [];
    }
  }

  aplicarFiltro(): void {
    const params: any = {};
    if (this.filtroAnio) params.year = this.filtroAnio;
    if (this.filtroMes) params.month = this.filtroMes;
    if (this.filtroDia) params.day = this.filtroDia;

    this.cargarVentas(params);
  }

  limpiarFiltros(): void {
    this.filtroAnio = null;
    this.filtroMes = null;
    this.filtroDia = null;
    this.opcionesDia = [];
    this.cargarVentas(); // Carga todas las ventas de nuevo
  }

  toggleDetalles(ventaId: number): void {
    const venta = this.ventas.find(v => v.id === ventaId);
    if (venta) {
      venta.detallesVisibles = !venta.detallesVisibles;
    }
  }
}