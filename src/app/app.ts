import { Component } from '@angular/core';
import { Window } from './components/window/window';
import { Taskbar } from './components/taskbar/taskbar';
import { Launcher } from './components/launcher/launcher';
import { AppId, DesktopIconConfig, OpenWindow } from './models/window.model';

interface AppMeta {
  title: string;
  icon: string;
  width: number;
  height: number;
}

const APP_META: Record<AppId, AppMeta> = {
  about: { title: 'Sobre Mim', icon: '🧑‍💻', width: 420, height: 300 },
  skills: { title: 'Habilidades', icon: '🛠️', width: 420, height: 320 },
  projects: { title: 'Projetos', icon: '📁', width: 460, height: 360 },
  contact: { title: 'Contato', icon: '✉️', width: 400, height: 220 },
  terminal: { title: 'Terminal', icon: '💻', width: 640, height: 420 },
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Window, Taskbar, Launcher],
  template: `
    <div class="desktop">
      <div class="icons">
        @for (icon of icons; track icon.id) {
          <div
            class="icon"
            tabindex="0"
            role="button"
            [attr.aria-label]="'Abrir ' + icon.label"
            (dblclick)="openApp(icon.id)"
            (keydown.enter)="openApp(icon.id)"
          >
            <span class="icon-glyph">{{ icon.icon }}</span>
            <span class="icon-label">{{ icon.label }}</span>
          </div>
        }
      </div>

      @for (win of windows; track win.id) {
        <app-window
          [hidden]="win.minimized"
          [win]="win"
          (close)="closeWindow($event)"
          (focus)="focusWindow($event)"
          (toggleMinimize)="toggleMinimize($event)"
          (toggleMaximize)="toggleMaximize($event)"
          (move)="moveWindow($event)"
        />
      }

      <app-taskbar
        [windows]="windows"
        (entryClick)="onTaskbarEntryClick($event)"
        (launcherToggle)="launcherOpen = !launcherOpen"
      />

      @if (launcherOpen) {
        <app-launcher
          [icons]="icons"
          (select)="onLauncherSelect($event)"
          (closed)="launcherOpen = false"
        />
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100dvh;
      width: 100vw;
      overflow: hidden;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .desktop {
      position: relative;
      height: 100%;
      width: 100%;
      background: radial-gradient(circle at 20% 15%, #123329 0%, transparent 45%),
        linear-gradient(160deg, #0c0f12 0%, #10151b 45%, #0d1a17 100%);
    }
    .icons {
      position: absolute;
      top: 1.5rem;
      left: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      width: 84px;
      padding: 0.5rem;
      border-radius: 8px;
      color: #d7dee6;
      cursor: pointer;
      user-select: none;
    }
    .icon:hover, .icon:focus-visible {
      background: rgba(255, 255, 255, 0.08);
      outline: none;
    }
    .icon-glyph { font-size: 2.25rem; }
    .icon-label {
      font-size: 0.75rem;
      text-align: center;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
    }
  `],
})
export class AppComponent {
  readonly icons: DesktopIconConfig[] = [
    { id: 'about', label: 'Sobre Mim', icon: APP_META.about.icon },
    { id: 'skills', label: 'Habilidades', icon: APP_META.skills.icon },
    { id: 'projects', label: 'Projetos', icon: APP_META.projects.icon },
    { id: 'contact', label: 'Contato', icon: APP_META.contact.icon },
    { id: 'terminal', label: 'Terminal', icon: APP_META.terminal.icon },
  ];

  windows: OpenWindow[] = [];
  launcherOpen = false;

  private nextZIndex = 1;
  private openedCount = 0;

  openApp(appId: AppId) {
    const existing = this.windows.find((w) => w.appId === appId);
    if (existing) {
      this.windows = this.windows.map((w) =>
        w.id === existing.id ? { ...w, minimized: false, zIndex: this.nextZIndex++ } : w,
      );
      return;
    }

    const meta = APP_META[appId];
    const offset = (this.openedCount % 6) * 28;
    this.openedCount++;

    this.windows = [
      ...this.windows,
      {
        id: `${appId}-${Date.now()}`,
        appId,
        title: meta.title,
        icon: meta.icon,
        x: 120 + offset,
        y: 80 + offset,
        width: meta.width,
        height: meta.height,
        zIndex: this.nextZIndex++,
        minimized: false,
        maximized: false,
      },
    ];
  }

  closeWindow(id: string) {
    this.windows = this.windows.filter((w) => w.id !== id);
  }

  focusWindow(id: string) {
    const zIndex = this.nextZIndex++;
    this.windows = this.windows.map((w) => (w.id === id ? { ...w, zIndex } : w));
  }

  toggleMinimize(id: string) {
    this.windows = this.windows.map((w) =>
      w.id === id ? { ...w, minimized: !w.minimized } : w,
    );
  }

  toggleMaximize(id: string) {
    this.windows = this.windows.map((w) =>
      w.id === id ? { ...w, maximized: !w.maximized } : w,
    );
  }

  moveWindow(event: { id: string; x: number; y: number }) {
    this.windows = this.windows.map((w) =>
      w.id === event.id ? { ...w, x: event.x, y: event.y } : w,
    );
  }

  onLauncherSelect(appId: AppId) {
    this.openApp(appId);
    this.launcherOpen = false;
  }

  onTaskbarEntryClick(id: string) {
    const win = this.windows.find((w) => w.id === id);
    if (!win) return;
    if (win.minimized) {
      this.toggleMinimize(id);
      this.focusWindow(id);
    } else {
      this.toggleMinimize(id);
    }
  }
}
