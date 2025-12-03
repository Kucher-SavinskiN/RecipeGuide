// src/app/features/chat/chat-page.component.ts
import { Component, inject, signal, effect, viewChild, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { marked } from 'marked';
import { GrokApiService } from '../../core/services/grok-api.service';
import { RecipesStore } from '../../core/services/recipes-store.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { Router } from '@angular/router';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {}

