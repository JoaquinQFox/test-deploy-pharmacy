import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Home } from './componentes/home/home';
import { Producto } from './services/producto';
import { Csrf } from './services/csrf';  // o Auth si ahí lo tienes

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Home, CurrencyPipe],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  title = 'frontend';

  constructor(
    private producto: Producto,
    private csrf: Csrf 
  ) {}

  ngOnInit(): void {
    this.csrf.getToken().subscribe({
      next: (res : any) => {
        console.log('Token CSRF recibido:', res.csrfToken);
        console.log('Cookies actuales:', document.cookie);
      },
      error: (err : any) => {
        console.error('Error al obtener token CSRF', err);
      }
    });
  }
}
