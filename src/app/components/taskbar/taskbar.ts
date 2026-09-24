import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { OpenWindow } from '../../models/window.model';

@Component({
  selector: 'app-taskbar',
  standalone: true,
  template: `
    <div class="taskbar">
      <button
        type="button"
        class="os-button"
        (click)="launcherToggle.emit()"
        title="Pesquisar aplicativos"
        aria-label="Abrir menu de aplicativos"
      >
        🐧
      </button>
      <div class="entries">
        @for (win of windows; track win.id) {
          <button
            type="button"
            class="entry"
            [class.active]="!win.minimized"
            (click)="entryClick.emit(win.id)"
          >
            <span class="icon">{{ win.icon }}</span>
            <span class="label">{{ win.title }}</span>
          </button>
        }
      </div>
      <div class="clock">{{ time }}</div>
    </div>
  `,
  styles: [`
    .taskbar {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 48px;
      background: rgba(18, 24, 32, 0.92);
      backdrop-filter: blur(6px);
      border-top: 1px solid #2b3b4f;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.75rem;
      z-index: 10000;
    }
    .os-button {
      flex-shrink: 0;
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.06);
      font-size: 1.1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0.75rem;
    }
    .os-button:hover, .os-button:focus-visible { background: rgba(39, 201, 63, 0.16); border-color: #27c93f; outline: none; }
    .entries { display: flex; gap: 0.5rem; overflow-x: auto; }
    .entry {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      padding: 0.35rem 0.75rem;
      color: #d7dee6;
      font-size: 0.8rem;
      cursor: pointer;
      white-space: nowrap;
    }
    .entry.active { border-color: #27c93f; background: rgba(39, 201, 63, 0.12); }
    .clock { color: #8b9bb4; font-size: 0.85rem; font-variant-numeric: tabular-nums; padding-left: 1rem; }
  `],
})
export class Taskbar implements OnInit, OnDestroy {
  @Input() windows: OpenWindow[] = [];
  @Output() entryClick = new EventEmitter<string>();
  @Output() launcherToggle = new EventEmitter<void>();

  time = '';
  private intervalId?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.updateClock();
    this.intervalId = setInterval(() => this.updateClock(), 30_000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private updateClock() {
    this.time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
}
