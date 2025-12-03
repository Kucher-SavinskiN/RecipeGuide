import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/chat', pathMatch: 'full' },

  {
    path: 'chat',
    loadComponent: () => import('./features/chat/chat-page.component').then(m => m.ChatPageComponent)
  },
  {
    path: 'recipes',
    loadComponent: () => import('./features/recipes/list/recipes-list').then(m => m.RecipesListComponent)
  },
  {
    path: 'recipe/:id',
    loadComponent: () => import('./features/recipes/detail/recipe-detail.component').then(m => m.RecipeDetailComponent)
  },
  {
    path: 'ingredients',
    loadComponent: () => import('./features/ingredients/ingredients-page.component').then(m => m.IngredientsPageComponent)
  },
  {
    path: 'saved',
    redirectTo: '/recipes'
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent)
  },
  // 404 – можна додати пізніше
  { path: '**', redirectTo: '/chat' }
];
