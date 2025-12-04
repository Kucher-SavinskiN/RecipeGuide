import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { secrets } from '../../../environments/environment.secrets';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  private _currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this._currentUser.asObservable();

  constructor(private router: Router) {
    const url = (secrets as any).supabaseUrl;
    const key = (secrets as any).supabaseAnonKey;

    this.supabase = createClient(url, key);

    // Відстежуємо стан авторизації
    this.supabase.auth.getSession().then(({ data }) => {
      this._currentUser.next(data.session?.user ?? null);
    });

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this._currentUser.next(session?.user ?? null);
    });
  }

  // Реєстрація з автоматичним надсиланням email підтвердження
  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
      }
    });

    if (error) throw error;
    return data.user;
  }

  // Логін
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Перевіряємо чи підтверджено email
    if (data.user && !data.user.email_confirmed_at) {
      await this.supabase.auth.signOut();
      throw new Error('Email not confirmed');
    }

    return data.user;
  }

  // Повторне надсилання листа підтвердження
  async resendConfirmationEmail(email: string) {
    const { error } = await this.supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
      }
    });

    if (error) throw error;
  }

  // Вихід
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  // Поточний користувач
  get currentUser() {
    return this._currentUser.value;
  }
}
