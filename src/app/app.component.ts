import { Component, inject, OnInit } from '@angular/core';
import { GrokApiService } from './core/services/grok-api.service';
import {Router, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  router = inject(Router);

  get isAuthPage(): boolean {
    return this.router.url === '/auth' || this.router.url === '/register';
  }
}
/*export class AppComponents implements OnInit {
  private grok = inject(GrokApiService);

  ngOnInit() {
    this.grok.ask('Дай простий рецепт сирників на сніданок')
      .then(recipe => console.log('🍳 Рецепт з Grok:\n\n', recipe))
      .catch(err => console.error('Grok помилка:', err));
  }
}*/
