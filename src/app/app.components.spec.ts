import { TestBed } from '@angular/core/testing';
import { AppComponents } from './app.components';

describe('AppComponents', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponents],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponents);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(AppComponents);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, RecipesGuide');
  });
});
