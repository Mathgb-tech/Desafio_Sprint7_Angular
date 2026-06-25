import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (data) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('user', JSON.stringify(data));
        }
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Erro ao conectar com o servidor.';

        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }
}