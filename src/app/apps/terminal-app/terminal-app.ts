import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface HistoryItem {
  command?: string;
  response?: string;
}

@Component({
  selector: 'app-terminal-app',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="terminal-body" #scrollContainer (click)="focusInput()">
      <div class="output">
        <p>Bem-vindo ao meu portfólio interativo 🚀</p>
        <p>Digite <span class="highlight">"help"</span> e pressione Enter.</p>
        <br />
      </div>

      <div *ngFor="let item of history">
        <div class="command-line-output">
          <span class="prompt">visitor@portfolio:~$</span> {{ item.command }}
        </div>
        <div class="response-output" [innerHTML]="item.response"></div>
      </div>

      <div class="command-line">
        <span class="prompt">visitor@portfolio:~$</span>
        <input
          type="text"
          [(ngModel)]="currentCommand"
          (keydown.enter)="onEnter()"
          #commandInput
          autocomplete="off"
          spellcheck="false"
        />
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; background-color: #0c0f12; color: #00ff66; font-family: 'Courier New', Courier, monospace; }
    .terminal-body { height: 100%; padding: 16px; overflow-y: auto; font-size: 0.9rem; line-height: 1.5; cursor: text; box-sizing: border-box; }
    .terminal-body p { margin-bottom: 6px; }
    .highlight { color: #ffcc00; font-weight: 600; }
    .link { color: #38bdf8; text-decoration: underline; }
    .command-line-output { margin-bottom: 4px; color: #ffffff; }
    .prompt { color: #27c93f; margin-right: 10px; white-space: nowrap; }
    .response-output { margin-bottom: 12px; }
    .command-line { display: flex; align-items: center; margin-top: 5px; }
    input { background: transparent; border: none; outline: none; color: #ffffff; font-family: 'Courier New', Courier, monospace; font-size: 0.9rem; width: 100%; caret-color: #27c93f; }
  `],
})
export class TerminalApp implements AfterViewInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('commandInput') private commandInput!: ElementRef;

  currentCommand = '';
  history: HistoryItem[] = [];

  ngAfterViewInit() {
    this.focusInput();
  }

  focusInput() {
    this.commandInput?.nativeElement.focus();
  }

  onEnter() {
    const cmd = this.currentCommand ? this.currentCommand.trim().toLowerCase() : '';
    if (!cmd) return;

    let response = '';

    switch (cmd) {
      case 'help':
        response = `Comandos disponíveis:<br>
          &nbsp;&nbsp;<span class="highlight">about</span>&nbsp;&nbsp;&nbsp;&nbsp;- Sobre mim<br>
          &nbsp;&nbsp;<span class="highlight">skills</span>&nbsp;&nbsp;&nbsp;- Habilidades técnicas<br>
          &nbsp;&nbsp;<span class="highlight">projects</span>&nbsp;- Meus projetos do GitHub<br>
          &nbsp;&nbsp;<span class="highlight">contact</span>&nbsp;&nbsp;- Redes sociais<br>
          &nbsp;&nbsp;<span class="highlight">clear</span>&nbsp;&nbsp;&nbsp;&nbsp;- Limpa a tela`;
        break;
      case 'about':
        response = `Desenvolvedor frontend focado em criar aplicações web limpas e funcionais.`;
        break;
      case 'skills':
        response = `Stack: Angular, HTML5, CSS3, Git, Docker.`;
        break;
      case 'projects':
        response = `Projetos em destaque:<br>
          <span class="highlight">Desenvolvimento</span> -> starbucks-clone: Clone do site do Starbucks.<br>
          &nbsp;&nbsp;&nbsp;-> Repositório: <a href="https://github.com/maycon-d-oliveira/starbucks-clone" target="_blank" class="link">GitHub</a><br>
          <span class="highlight">Infraestrutura de TI</span> -> Inventário de TI: controle de aparelhos, chips, estoque, devoluções, descarte e manutenções (Flask + SQLite/PostgreSQL).<br>
          &nbsp;&nbsp;&nbsp;-> Repositório: <a href="https://github.com/maycon-d-oliveira/Inventario-ti" target="_blank" class="link">GitHub</a>`;
        break;
      case 'contact':
        response = `GitHub: <a href="https://github.com/maycon-d-oliveira" target="_blank" class="link">github.com/maycon-d-oliveira</a>`;
        break;
      case 'clear':
        this.history = [];
        this.currentCommand = '';
        return;
      default:
        response = `Comando desconhecido: "${cmd}". Digite "help".`;
    }

    this.history.push({ command: cmd, response });
    this.currentCommand = '';

    setTimeout(() => {
      this.scrollToBottom();
      this.focusInput();
    }, 50);
  }

  scrollToBottom() {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch {
      // container may not be attached yet on the very first paint
    }
  }
}
