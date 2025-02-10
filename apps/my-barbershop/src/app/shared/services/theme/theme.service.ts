import { Injectable } from '@angular/core';

enum eThemeType {
  DARK = 'dark',
  DEFAULT = 'default',
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  currentTheme = eThemeType.DEFAULT;

  private reverseTheme(theme: string): eThemeType {
    return theme === eThemeType.DARK ? eThemeType.DEFAULT : eThemeType.DARK;
  }

  private removeUnusedTheme(theme: eThemeType): void {
    document.documentElement.classList.remove(theme);
    const removedThemeStyle = document.getElementById(theme);
    if (removedThemeStyle) {
      document.head.removeChild(removedThemeStyle);
    }
  }

  private loadCss(href: string, id: string): Promise<Event> {
    return new Promise((resolve, reject) => {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = href;
      style.id = id;
      style.onload = resolve;
      style.onerror = reject;
      document.head.append(style);
    });
  }

  public loadTheme(firstLoad = true): Promise<void> {
    const theme = this.currentTheme;
    if (firstLoad) {
      document.documentElement.classList.add(theme);
    }
    return new Promise<void>((resolve, reject) => {
      this.loadCss(`${theme}.css`, theme).then(
        () => {
          if (!firstLoad) {
            document.documentElement.classList.add(theme);
          }
          this.removeUnusedTheme(this.reverseTheme(theme));
          resolve();
        },
        e => reject(e),
      );
    });
  }

  public toggleTheme(): Promise<void> {
    this.currentTheme = this.reverseTheme(this.currentTheme);
    return this.loadTheme(false);
  }
}
