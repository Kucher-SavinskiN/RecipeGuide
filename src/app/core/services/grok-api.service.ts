import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

interface Message { role: 'system' | 'user' | 'assistant'; content: string; }

@Injectable({ providedIn: 'root' })
export class GrokApiService {
  private url = 'https://api.x.ai/v1/chat/completions';

  constructor(private http: HttpClient) {}

  async send(messages: Message[], model = 'grok-4-1-fast-non-reasoning', temperature = 0.8): Promise<string> {
    const body = { messages, model, temperature, stream: false };

    const res: any = await lastValueFrom(this.http.post(this.url, body));
    return res.choices[0]?.message?.content ?? '';
  }

  // зручний метод
  async ask(prompt: string, system = 'Ти шеф-кухар. Відповідай тільки рецептом українською в Markdown.'): Promise<string> {
    return this.send([
      { role: 'system', content: system },
      { role: 'user', content: prompt }
    ]);
  }
}
