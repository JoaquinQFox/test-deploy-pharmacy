import { Component, OnInit } from '@angular/core';
import { User } from '../../services/user';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-user-list',
  imports: [ CommonModule, RouterLink, RouterModule, Navbar],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserList implements OnInit {
  users: any[] = [];
  error: string | null = null;

  constructor(private user: User, private router: Router) {}

  ngOnInit(): void {
    this.user.getUsers().subscribe({
      next: data => this.users = data,
      error: err => this.error = err.error.detail || 'Error cargando usuarios'
    });
  }
}