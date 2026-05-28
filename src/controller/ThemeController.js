export class ThemeController {

    static strorage_key = 'whatsapp-theme';
    static dark = 'dark';
    static light = 'light';

    constructor() {
        this._theme = this._loadTheme();
        this._apply(this._theme);
    }

    toggle() {
        this._theme = this._isDark() ? ThemeController.light : ThemeController.dark;
        this._apply(this._theme);
        this._save(this._theme);
    }

    isDark() {
        return this._isDark();
    }

    _isDark() {
        return this._theme === ThemeController.dark;
    }

    _loadTheme() {
        const saved = localStorage.getItem(ThemeController.strorage_key);
        if (saved) return saved;

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? ThemeController.dark : ThemeController.light;
    }

    _save(theme) {
        localStorage.setItem(ThemeController.strorage_key, theme);
    }

    _apply(theme) {
        document.body.setAttribute('data-theme', theme);
    }
}
