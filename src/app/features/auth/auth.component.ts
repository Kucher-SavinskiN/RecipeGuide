
import { Component, inject } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  supabase = inject(SupabaseService);
  router = inject(Router);

  errorMessage: string | null = null;
  successMessage: string | null = null;

  async signIn(email: string, password: string) {
    if (!email || !password) {
      this.showError('Будь ласка, заповніть всі поля');
      return;
    }

    try {
      await this.supabase.signIn(email, password);
      this.showSuccess('Вхід успішний!');
      setTimeout(() => {
        this.router.navigate(['/chat']);
      }, 500);
    } catch (error: any) {
      this.showError(this.getErrorMessage(error));
    }
  }

  async logout() {
    try {
      await this.supabase.signOut();
      this.router.navigate(['/auth']);
    } catch (error: any) {
      this.showError('Помилка при виході з акаунту');
    }
  }

  private showError(message: string) {
    this.errorMessage = message;
    this.successMessage = null;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    this.errorMessage = null;
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }

  private getErrorMessage(error: any): string {
    const message = error?.message?.toLowerCase() || '';

    if (message.includes('invalid login credentials') || message.includes('invalid credentials')) {
      return 'Невірний email або пароль';
    }
    if (message.includes('user not found')) {
      return 'Користувача не знайдено';
    }
    if (message.includes('email not confirmed')) {
      return 'Підтвердіть email перед входом';
    }
    if (message.includes('invalid email')) {
      return 'Невірний формат email';
    }

    return 'Сталася помилка. Спробуйте ще раз';
  }
}
