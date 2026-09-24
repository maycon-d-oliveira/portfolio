import { Component } from '@angular/core';

interface SkillGroup {
  category: string;
  items: string[];
}

@Component({
  selector: 'app-skills-app',
  standalone: true,
  template: `
    <h2>Habilidades técnicas</h2>
    @for (group of skillGroups; track group.category) {
      <div class="group">
        <h3>{{ group.category }}</h3>
        <div class="badges">
          @for (item of group.items; track item) {
            <span class="badge">{{ item }}</span>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; color: #d7dee6; }
    h2 { color: #ffffff; margin-bottom: 1rem; font-size: 1.1rem; }
    .group { margin-bottom: 1rem; }
    h3 { color: #8b9bb4; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
    .badges { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .badge { background: rgba(39, 201, 63, 0.12); color: #27c93f; border: 1px solid rgba(39, 201, 63, 0.3); border-radius: 999px; padding: 0.25rem 0.75rem; font-size: 0.85rem; }
  `],
})
export class SkillsApp {
  readonly skillGroups: SkillGroup[] = [
    { category: 'Frontend', items: ['Angular', 'HTML5', 'CSS3', 'TypeScript'] },
    { category: 'Ferramentas', items: ['Git', 'Docker'] },
  ];
}
