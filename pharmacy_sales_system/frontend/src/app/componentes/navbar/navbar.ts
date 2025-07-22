import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  showMenu = signal(false);

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  user = computed(() => this.auth.user());

  toggleMenu() {
    console.log('Toggle del menú');
    this.showMenu.update(v => !v);
  }
}