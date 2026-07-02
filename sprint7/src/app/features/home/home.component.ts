import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  userName = '';
  sidebarOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        this.userName = user.nome;
      }
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  // Fecha a sidebar ao pressionar ESC
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeSidebar();
  }

  onLogout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('user');
    }
    this.router.navigate(['/login']);
  }
}