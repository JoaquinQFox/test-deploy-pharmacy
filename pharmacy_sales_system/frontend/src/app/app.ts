import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Home } from './componentes/home/home';
import { Producto } from './services/producto';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Home, CurrencyPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'frontend';
  constructor(private Producto: Producto) {
  }
}
