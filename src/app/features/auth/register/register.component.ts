import { Component, inject } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  supabase = inject(SupabaseService);
  router = inject(Router);

  errorMessage: string | null = null;
  successMessage: string | null = null;
  registeredEmail: string | null = null;

  async signUp(email: string, password: string, confirmPassword: string) {
    if (!email || !password || !confirmPassword) {
      this.showError('Будь ласка, заповніть всі поля');
      return;
    }

    if (password !== confirmPassword) {
      this.showError('Паролі не співпадають');
      return;
    }

    if (password.length < 6) {
      this.showError('Пароль має містити мінімум 6 символів');
      return;
    }

    try {
      await this.supabase.signUp(email, password);
      this.registeredEmail = email;
      this.showSuccess('Реєстрацію завершено! Перевірте пошту та підтвердіть email');
    } catch (error: any) {
      this.showError(this.getErrorMessage(error));
    }
  }

  async resendEmail() {
    if (!this.registeredEmail) return;

    try {
      await this.supabase.resendConfirmationEmail(this.registeredEmail);
      this.showSuccess('Лист підтвердження відправлено повторно');
    } catch (error: any) {
      this.showError('Помилка при відправці листа');
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
  }

  private getErrorMessage(error: any): string {
    const message = error?.message?.toLowerCase() || '';

    if (message.includes('user already registered')) {
      return 'Користувач з таким email вже існує';
    }
    if (message.includes('invalid email')) {
      return 'Невірний формат email';
    }
    if (message.includes('password')) {
      return 'Пароль занадто короткий або слабкий';
    }

    return 'Сталася помилка. Спробуйте ще раз';
  }
}
