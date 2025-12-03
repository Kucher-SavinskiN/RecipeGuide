
import { Component, inject } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  supabase = inject(SupabaseService);
  router = inject(Router);

  async signUp(email: string, password: string) {
    if (!email || !password) return;
    await this.supabase.signUp(email, password);
  }

  async signIn(email: string, password: string) {
    if (!email || !password) return;
    await this.supabase.signIn(email, password);
    this.router.navigate(['/chat']);
  }

  async logout() {
    await this.supabase.signOut();
    this.router.navigate(['/auth']);
  }
}
