import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppId, DesktopIconConfig } from '../../models/window.model';

@Component({
  selector: 'app-launcher',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="backdrop" (click)="closed.emit()"></div>
    <div class="panel" (pointerdown)="$event.stopPropagation()">
      <input
        #searchInput
        type="text"
        class="search"
        placeholder="Pesquisar aplicativos..."
        [(ngModel)]="query"
        (keydown.escape)="closed.emit()"
        (keydown.enter)="openFirstMatch()"
        autocomplete="off"
      />
      <div class="results">
        @for (icon of filteredIcons(); track icon.id) {
          <button type="button" class="result" (click)="select.emit(icon.id)">
            <span class="glyph">{{ icon.icon }}</span>
            <span class="label">{{ icon.label }}</span>
          </button>
        } @empty {
          <div class="empty">Nenhum aplicativo encontrado.</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 10001;
    }
    .panel {
      position: fixed;
      left: 0.75rem;
      bottom: 60px;
      width: 260px;
      max-height: 360px;
      background-color: #121820;
      border: 1px solid #2b3b4f;
      border-radius: 10px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 10002;
    }
    .search {
      margin: 0.75rem;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      border: 1px solid #2b3b4f;
      background: #0c0f12;
      color: #ffffff;
      font-size: 0.9rem;
      outline: none;
    }
    .search:focus { border-color: #27c93f; }
    .results { overflow-y: auto; padding: 0 0.5rem 0.5rem; display: flex; flex-direction: column; gap: 0.15rem; }
    .result {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: transparent;
      border: none;
      border-radius: 6px;
      padding: 0.5rem 0.6rem;
      color: #d7dee6;
      font-size: 0.9rem;
      cursor: pointer;
      text-align: left;
    }
    .result:hover, .result:focus-visible { background: rgba(255, 255, 255, 0.08); outline: none; }
    .glyph { font-size: 1.2rem; }
    .empty { padding: 0.75rem; color: #8b9bb4; font-size: 0.85rem; }
  `],
})
export class Launcher implements AfterViewInit {
  @Input({ required: true }) icons: DesktopIconConfig[] = [];
  @Output() select = new EventEmitter<AppId>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('searchInput') private searchInput!: ElementRef<HTMLInputElement>;

  query = '';

  ngAfterViewInit() {
    this.searchInput.nativeElement.focus();
  }

  filteredIcons(): DesktopIconConfig[] {
    const term = this.query.trim().toLowerCase();
    if (!term) return this.icons;
    return this.icons.filter((icon) => icon.label.toLowerCase().includes(term));
  }

  openFirstMatch() {
    const [first] = this.filteredIcons();
    if (first) this.select.emit(first.id);
  }
}
