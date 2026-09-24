import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OpenWindow } from '../../models/window.model';
import { AboutApp } from '../../apps/about-app/about-app';
import { SkillsApp } from '../../apps/skills-app/skills-app';
import { ProjectsApp } from '../../apps/projects-app/projects-app';
import { ContactApp } from '../../apps/contact-app/contact-app';
import { TerminalApp } from '../../apps/terminal-app/terminal-app';

@Component({
  selector: 'app-window',
  standalone: true,
  imports: [AboutApp, SkillsApp, ProjectsApp, ContactApp, TerminalApp],
  template: `
    <div
      class="window"
      [class.maximized]="win.maximized"
      [style.left.px]="win.x"
      [style.top.px]="win.y"
      [style.width.px]="win.width"
      [style.height.px]="win.height"
      [style.zIndex]="win.zIndex"
    >
      <div
        class="titlebar"
        (pointerdown)="onDragStart($event)"
        (pointermove)="onDragMove($event)"
        (pointerup)="onDragEnd()"
        (pointercancel)="onDragEnd()"
      >
        <div class="buttons" (pointerdown)="$event.stopPropagation()">
          <button type="button" class="btn close" (click)="close.emit(win.id)" title="Fechar" aria-label="Fechar janela">
            <span class="glyph">×</span>
          </button>
          <button type="button" class="btn minimize" (click)="toggleMinimize.emit(win.id)" title="Minimizar" aria-label="Minimizar janela">
            <span class="glyph">－</span>
          </button>
          <button type="button" class="btn maximize" (click)="toggleMaximize.emit(win.id)" title="Maximizar" aria-label="Maximizar janela">
            <span class="glyph">□</span>
          </button>
        </div>
        <div class="title">{{ win.icon }} {{ win.title }}</div>
      </div>

      <div class="body" (pointerdown)="focus.emit(win.id)">
        @switch (win.appId) {
          @case ('about') { <app-about-app /> }
          @case ('skills') { <app-skills-app /> }
          @case ('projects') { <app-projects-app /> }
          @case ('contact') { <app-contact-app /> }
          @case ('terminal') { <app-terminal-app /> }
        }
      </div>
    </div>
  `,
  styles: [`
    .window {
      position: absolute;
      display: flex;
      flex-direction: column;
      background-color: #121820;
      border: 1px solid #2b3b4f;
      border-radius: 8px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      overflow: hidden;
    }
    .window.maximized {
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      height: 100% !important;
      border-radius: 0 !important;
    }
    .titlebar {
      background-color: #1a2332;
      padding: 10px 15px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #2b3b4f;
      cursor: grab;
      touch-action: none;
      user-select: none;
    }
    .buttons { display: flex; gap: 8px; }
    .btn {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: none;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      line-height: 1;
    }
    .btn .glyph {
      font-size: 9px;
      color: rgba(0, 0, 0, 0.55);
      font-family: system-ui, sans-serif;
    }
    .close { background-color: #ff5f56; }
    .minimize { background-color: #ffbd2e; }
    .maximize { background-color: #27c93f; }
    .btn:hover { filter: brightness(1.15); }
    .title {
      flex-grow: 1;
      text-align: center;
      color: #8b9bb4;
      font-size: 0.85rem;
      font-family: 'Courier New', Courier, monospace;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .body {
      flex-grow: 1;
      overflow: auto;
      padding: 1.25rem;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    app-terminal-app .body,
    .body:has(app-terminal-app) { padding: 0; }
  `],
})
export class Window {
  @Input({ required: true }) win!: OpenWindow;
  @Output() close = new EventEmitter<string>();
  @Output() focus = new EventEmitter<string>();
  @Output() toggleMinimize = new EventEmitter<string>();
  @Output() toggleMaximize = new EventEmitter<string>();
  @Output() move = new EventEmitter<{ id: string; x: number; y: number }>();

  private dragging = false;
  private dragOffsetX = 0;
  private dragOffsetY = 0;

  onDragStart(event: PointerEvent) {
    if (this.win.maximized) return;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this.dragging = true;
    this.dragOffsetX = event.clientX - this.win.x;
    this.dragOffsetY = event.clientY - this.win.y;
    this.focus.emit(this.win.id);
  }

  onDragMove(event: PointerEvent) {
    if (!this.dragging) return;
    const x = event.clientX - this.dragOffsetX;
    const y = Math.max(0, event.clientY - this.dragOffsetY);
    this.move.emit({ id: this.win.id, x, y });
  }

  onDragEnd() {
    this.dragging = false;
  }
}
