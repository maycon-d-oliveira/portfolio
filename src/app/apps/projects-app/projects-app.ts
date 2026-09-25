import { Component } from '@angular/core';
import { ProjectCategory, ProjectEntry } from '../../models/window.model';

interface CategoryGroup {
  category: ProjectCategory;
  projects: ProjectEntry[];
}

const CATEGORY_ORDER: ProjectCategory[] = ['BI', 'Desenvolvimento', 'Infraestrutura de TI'];

const PROJECTS: ProjectEntry[] = [
  {
    title: 'Starbucks-clone',
    description: 'Clone do site do Starbucks. Projeto desenvolvido na graduação de Analise e Desenvolvimento de Sistemas no Instituto Federal de São Paulo',
    repoUrl: 'https://github.com/maycon-d-oliveira/starbucks-clone',
    category: 'Desenvolvimento',
  },
  {
    title: 'Inventário de TI',
    description:
      'Aplicação web para controle de aparelhos, chips, estoque, devoluções, descarte e manutenções. Desenvolvida com Flask, compatível com SQLite e PostgreSQL.',
    repoUrl: 'https://github.com/maycon-d-oliveira/Inventario-ti',
    category: 'Desenvolvimento',
  },
];

@Component({
  selector: 'app-projects-app',
  standalone: true,
  template: `
    <h2>Projetos</h2>

    @for (group of categoryGroups; track group.category) {
      <div class="category">
        <h3>{{ group.category }}</h3>

        @if (group.projects.length) {
          <div class="folder-grid">
            @for (project of group.projects; track project.repoUrl) {
              <button
                type="button"
                class="shortcut"
                (dblclick)="openRepo(project.repoUrl)"
                (keydown.enter)="openRepo(project.repoUrl)"
              >
                <span class="shortcut-icon">📄</span>
                <span class="shortcut-label">{{ project.title }}</span>
              </button>
            }
          </div>
        } @else {
          <p class="empty">Em breve.</p>
        }
      </div>
    }

    @if (selected) {
      <div class="details">
        <h3>{{ selected.title }}</h3>
        <p>{{ selected.description }}</p>
        <a [href]="selected.repoUrl" target="_blank" rel="noopener">Abrir no GitHub</a>
      </div>
    }
  `,
  styles: [`
    :host { display: block; color: #d7dee6; }
    h2 { color: #ffffff; margin-bottom: 0.75rem; font-size: 1.1rem; }
    .category { margin-bottom: 1rem; }
    .category h3 { color: #8b9bb4; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
    .empty { color: #566577; font-size: 0.85rem; font-style: italic; }
    .folder-grid { display: flex; flex-wrap: wrap; gap: 1rem; }
    .shortcut {
      display: flex; flex-direction: column; align-items: center; gap: 0.35rem;
      width: 84px; background: transparent; border: 1px solid transparent; border-radius: 8px;
      padding: 0.5rem; color: #d7dee6; font-family: inherit; font-size: 0.75rem; cursor: pointer;
    }
    .shortcut:hover, .shortcut:focus-visible { background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.12); outline: none; }
    .shortcut-icon { font-size: 2rem; }
    .shortcut-label { text-align: center; word-break: break-word; }
    .details { border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 0.75rem; }
    .details h3 { color: #ffffff; margin-bottom: 0.35rem; }
    .details a { color: #38bdf8; text-decoration: underline; }
  `],
})
export class ProjectsApp {
  readonly categoryGroups: CategoryGroup[] = CATEGORY_ORDER.map((category) => ({
    category,
    projects: PROJECTS.filter((p) => p.category === category),
  }));

  selected: ProjectEntry | null = null;

  openRepo(repoUrl: string) {
    this.selected = PROJECTS.find((p) => p.repoUrl === repoUrl) ?? null;
    window.open(repoUrl, '_blank', 'noopener');
  }
}
