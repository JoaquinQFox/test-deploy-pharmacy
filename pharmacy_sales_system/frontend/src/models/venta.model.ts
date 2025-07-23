// frontend/app/models/venta.model.ts

export interface UserInfo {
  first_name: string;
  last_name: string;
}

export interface DetalleVenta {
  id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: string; // Django DecimalField se recibe como string
  subtotal: string;       // Django DecimalField se recibe como string
}

export interface Venta {
  id: number;
  usuario: UserInfo;
  fecha: string;          // Django DateTimeField se recibe como string
  descuento: string;      // Django DecimalField se recibe como string
  total_bruto: string;    // Django DecimalField se recibe como string
  total_neto: string;     // Django DecimalField se recibe como string
  detalles: DetalleVenta[];
  detallesVisibles?: boolean; // Propiedad opcional para controlar la UI
}