import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';
import { CommonModule, DatePipe } from '@angular/common';

// Interfaces para tipar los datos de la API
export interface User {
  first_name: string;
  last_name: string;
}

export interface DetalleVenta {
  id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: string;
  subtotal: string;
}

export interface Venta {
  id: number;
  usuario: User;
  fecha: string;
  descuento: string;
  total_bruto: string;
  total_neto: string;
  detalles: DetalleVenta[];
  detallesVisibles?: boolean; // Propiedad para controlar la visibilidad
}

@Component({
  selector: 'app-historial-ventas',
  templateUrl: './historial-ventas.html',
  styleUrls: ['./historial-ventas.css'],
  standalone: true, // Es recomendable usar componentes standalone
  imports: [CommonModule, DatePipe]
})
export class HistorialVentasComponent implements OnInit {

  ventas: Venta[] = [];

  constructor(private api: Api) { }

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.api.get<Venta[]>('/ventas/').subscribe({
      next: (data) => {
        this.ventas = data.map(venta => ({ ...venta, detallesVisibles: false }));
        console.log('Ventas cargadas:', this.ventas);
      },
      error: (error) => {
        console.error('Error al cargar el historial de ventas', error);
      }
    });
  }

  toggleDetalles(venta: Venta): void {
    venta.detallesVisibles = !venta.detallesVisibles;
  }
}