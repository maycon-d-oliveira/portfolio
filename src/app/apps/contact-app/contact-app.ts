import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-app',
  standalone: true,
  template: `
    <h2>Contato</h2>
    <p>
      GitHub:
      <a href="https://github.com/maycon-d-oliveira" target="_blank" rel="noopener">
        github.com/maycon-d-oliveira
      </a>
    </p>
  `,
  styles: [`
    :host { display: block; color: #d7dee6; }
    h2 { color: #ffffff; margin-bottom: 0.75rem; font-size: 1.1rem; }
    a { color: #38bdf8; text-decoration: underline; }
  `],
})
export class ContactApp {}
