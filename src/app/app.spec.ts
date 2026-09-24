import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the desktop', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render an icon for every app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const icons = compiled.querySelectorAll('.icon');
    expect(icons.length).toBe(5);
  });

  it('should open a window when an app is launched', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.openApp('about');

    expect(app.windows.length).toBe(1);
    expect(app.windows[0].appId).toBe('about');
  });

  it('should focus the existing window instead of duplicating it', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.openApp('about');
    const firstZIndex = app.windows[0].zIndex;
    app.openApp('about');

    expect(app.windows.length).toBe(1);
    expect(app.windows[0].zIndex).toBeGreaterThan(firstZIndex);
  });

  it('should close a window', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.openApp('terminal');
    const id = app.windows[0].id;
    app.closeWindow(id);

    expect(app.windows.length).toBe(0);
  });

  it('should toggle minimize without removing the window', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.openApp('skills');
    const id = app.windows[0].id;
    app.toggleMinimize(id);

    expect(app.windows.length).toBe(1);
    expect(app.windows[0].minimized).toBe(true);
  });
});
