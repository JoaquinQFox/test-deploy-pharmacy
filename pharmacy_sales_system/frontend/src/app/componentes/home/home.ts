import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Producto } from '../../services/producto';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Navbar } from '../navbar/navbar';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { Venta, VentaD, VentaCreada } from '../../services/venta';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, FormsModule, Navbar],
  templateUrl: 'home.html',
  styleUrl: 'home.css'
})
export class Home implements OnInit {
  productos: any[] = [];
  carrito: any[] = [];
  total: number = 0;
  codigoInput: string = '';
  descuento: number = 0;
  totalNeto: number = 0;
  totalBruto: number = 0;
  ultimaVentaId: number | null = null;
  carritoVendido: any[] = [];
  ventaBruto: number = 0;
  ventaDescuento: number = 0;
  ventaNeto: number = 0;

  constructor(
    private productoService: Producto,
    private auth: Auth,
    private ventaService: Venta
  ) {}
    
  ngOnInit(): void {
    this.productoService.listarProductos().subscribe(data => {
      this.productos = data;
    });
  }

  get currentUser() {
    return this.auth.user();
  }

  escanearProducto() {
    if (this.ultimaVentaId !== null) {
        this.ultimaVentaId = null;
        this.carritoVendido = [];
        this.ventaBruto = 0;
        this.ventaDescuento = 0;
        this.ventaNeto = 0;
    }

    const codigo = this.codigoInput.trim();
    if (!codigo) return;

    const producto = this.productos.find(p => p.codigo == codigo || p.id == codigo);
    if (!producto) {
      alert('Producto no encontrado');
      return;
    }

    if (producto.cantidad <= 0) {
      alert('No hay suficiente stock');
      return;
    }

    const itemCarrito = this.carrito.find(p => p.id == producto.id);
    if (itemCarrito) {
      if (itemCarrito.cantidad < producto.cantidad) {
        itemCarrito.cantidad += 1;
      } else {
        alert('No hay suficiente stock para agregar más');
      }
    } else {
      this.carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: Number(producto.precio),
        cantidad: 1
      });
    }

    this.calcularTotal();
    this.codigoInput = '';
  }

  calcularTotal() {
    this.totalBruto = this.carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const montoDescuento = this.totalBruto * (this.descuento / 100);
    this.totalNeto = this.totalBruto - montoDescuento;
  }
  
  resetearCarrito() {
    this.carrito = [];
    this.descuento = 0;
    this.calcularTotal();
  }

  eliminarItem(item: any) {
    this.carrito = this.carrito.filter(p => p.id !== item.id);
    this.calcularTotal();
  }

  agregarDescuento() {
    const inputDescuento = prompt('Ingrese el porcentaje de descuento (0-100):', this.descuento.toString());
    
    if (inputDescuento === null) return;

    const nuevoDescuento = parseFloat(inputDescuento);

    if (isNaN(nuevoDescuento) || nuevoDescuento < 0 || nuevoDescuento > 100) {
      alert('Por favor, ingrese un número válido entre 0 y 100.');
      return;
    }

    this.descuento = nuevoDescuento;
    this.calcularTotal();
  }

  procederCompra(): void {
    if (this.carrito.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    const ventaData: VentaD = {
      descuento: this.descuento,
      detalles: this.carrito.map(item => ({
        producto: item.id,
        cantidad: item.cantidad
      }))
    };

    this.ventaService.crearVenta(ventaData).subscribe({
      next: (ventaCreada: VentaCreada) => {
        alert(`Venta #${ventaCreada.id} realizada con éxito!`);
        this.ultimaVentaId = ventaCreada.id;
        this.carritoVendido = [...this.carrito];
        this.ventaBruto = this.totalBruto;
        this.ventaDescuento = this.descuento;
        this.ventaNeto = this.totalNeto;
        this.resetearCarrito();
        this.productoService.listarProductos().subscribe(data => this.productos = data);
      },
      error: (err) => {
        console.error('Error al crear la venta:', err);
        const errorMessage = err.error?.detail ?? 'No se pudo procesar la venta. Verifique el stock o inténtelo más tarde.';
        alert(`Error: ${errorMessage}`);
      }
    });
  }

  generarComprobante() {
    alert('Funcionalidad de comprobante no implementada');
  }
}