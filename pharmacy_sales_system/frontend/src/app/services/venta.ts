import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VentaCreada {
  id: number;
  usuario: {
    first_name: string;
    last_name: string;
  };
  fecha: string;
  descuento: string;
  total_bruto: string;
  total_neto: string;
  detalles: any[];
}

export interface VentaD {
  descuento: number;
  detalles: {
    producto: number;
    cantidad: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class Venta {
  
}
