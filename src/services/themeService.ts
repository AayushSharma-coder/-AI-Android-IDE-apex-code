import { ThemeType, ThemeDefinition } from '../types';
import { CORE_THEMES } from '../constants/themes';

class ThemeService {
  private static instance: ThemeService;
  private currentTheme: ThemeType = 'vs-dark';

  private constructor() {}

  static getInstance() {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }

  registerThemes(monaco: any) {
    CORE_THEMES.forEach(theme => {
      monaco.editor.defineTheme(theme.id, {
        base: theme.type === 'dark' ? 'vs-dark' : 'vs',
        inherit: true,
        rules: theme.rules,
        colors: theme.colors
      });
    });
  }

  getThemeColors(themeId: ThemeType) {
    const theme = CORE_THEMES.find(t => t.id === themeId);
    if (!theme) return null;
    return theme.colors;
  }
}

export const themeService = ThemeService.getInstance();
