// src/app/core/services/supabase.service.ts
import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { secrets } from '../../../environments/environment.secrets';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;
  private _currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this._currentUser.asObservable();

  constructor() {
    const url = (secrets as any).supabaseUrl;
    const key = (secrets as any).supabaseAnonKey;

    this.supabase = createClient(url, key);

    // Відстежуємо стан авторизації (навіть після оновлення сторінки)
    this.supabase.auth.getSession().then(({ data }) => {
      this._currentUser.next(data.session?.user ?? null);
    });

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this._currentUser.next(session?.user ?? null);
    });
  }

  // Реєстрація email/password
  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data.user;
  }

  // Логін email/password
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  }

  // Google login
  async signInWithGoogle() {
    const { error } = await this.supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) throw error;
  }

  // Вихід
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  // Поточний користувач (синхронно, якщо треба)
  get currentUser() {
    return this._currentUser.value;
  }

  // Методи для рецептів (поки без таблиці – додамо пізніше з RLS)
  // saveRecipe, loadRecipes тощо – додамо в наступному повідомленні, коли створиш таблицю
}
