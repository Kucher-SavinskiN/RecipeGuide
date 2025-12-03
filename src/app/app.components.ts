import { Component, inject, OnInit } from '@angular/core';
import { GrokApiService } from './core/services/grok-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: `<h1 class="p-8 text-3xl">RecipesGuide запускається...</h1>`
})
export class AppComponents implements OnInit {
  private grok = inject(GrokApiService);

  ngOnInit() {
    this.grok.ask('Дай простий рецепт сирників на сніданок')
      .then(recipe => console.log('🍳 Рецепт з Grok:\n\n', recipe))
      .catch(err => console.error('Grok помилка:', err));
  }
}
