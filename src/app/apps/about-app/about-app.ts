import { Component } from '@angular/core';

@Component({
  selector: 'app-about-app',
  standalone: true,
  template: `
    <h2>Sobre mim</h2>
    <p>
      Desenvolvedor frontend focado em criar aplicações web limpas e
      funcionais.
    </p>
    <p>
      Gosto de transformar ideias em interfaces simples de usar — este
      próprio portfólio é um exemplo: em vez de uma página estática, virou
      uma pequena área de trabalho para explorar 🖱️
    </p>
  `,
  styles: [`
    :host { display: block; color: #d7dee6; line-height: 1.6; }
    h2 { color: #ffffff; margin-bottom: 0.75rem; font-size: 1.1rem; }
    p { margin-bottom: 0.75rem; }
  `],
})
export class AboutApp {}
