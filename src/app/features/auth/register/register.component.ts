
import { Component, inject } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface PasswordStrength {
  score: number; // 0-100
  level: 'weak' | 'fair' | 'good' | 'strong';
  label: string;
  color: string;
  checks: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

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
  passwordStrength: PasswordStrength | null = null;

  checkPasswordStrength(password: string): PasswordStrength {
    const checks = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    // Підрахунок балів
    let score = 0;
    if (checks.minLength) score += 20;
    if (checks.hasUpperCase) score += 20;
    if (checks.hasLowerCase) score += 20;
    if (checks.hasNumber) score += 20;
    if (checks.hasSpecialChar) score += 20;

    // Бонус за довжину
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;

    // Обмеження максимуму
    score = Math.min(score, 100);

    // Визначення рівня
    let level: 'weak' | 'fair' | 'good' | 'strong';
    let label: string;
    let color: string;

    if (score < 40) {
      level = 'weak';
      label = 'Слабкий';
      color = '#e87a7a';
    } else if (score < 60) {
      level = 'fair';
      label = 'Задовільний';
      color = '#f0ad4e';
    } else if (score < 80) {
      level = 'good';
      label = 'Добрий';
      color = '#5bc0de';
    } else {
      level = 'strong';
      label = 'Надійний';
      color = '#68d391';
    }

    return { score, level, label, color, checks };
  }

  onPasswordInput(password: string) {
    if (password.length > 0) {
      this.passwordStrength = this.checkPasswordStrength(password);
    } else {
      this.passwordStrength = null;
    }
  }

  async signUp(email: string, password: string, confirmPassword: string) {
    if (!email || !password || !confirmPassword) {
      this.showError('Будь ласка, заповніть всі поля');
      return;
    }

    if (password !== confirmPassword) {
      this.showError('Паролі не співпадають');
      return;
    }

    // Перевірка мінімальних вимог
    const strength = this.checkPasswordStrength(password);

    if (!strength.checks.minLength) {
      this.showError('Пароль має містити мінімум 8 символів');
      return;
    }

    if (!strength.checks.hasUpperCase) {
      this.showError('Пароль має містити хоча б одну велику літеру');
      return;
    }

    if (!strength.checks.hasLowerCase) {
      this.showError('Пароль має містити хоча б одну малу літеру');
      return;
    }

    if (!strength.checks.hasNumber) {
      this.showError('Пароль має містити хоча б одну цифру');
      return;
    }

    if (strength.level === 'weak') {
      this.showError('Пароль занадто слабкий. Використайте спеціальні символи та збільште довжину');
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
