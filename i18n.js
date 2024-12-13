class I18n {
    constructor() {
        this.translations = {};
        this.currentLocale = localStorage.getItem('locale') || 'zh-CN';
    }

    async init() {
        await this.loadTranslations(this.currentLocale);
        this.updateDOM();
        this.bindEvents();
    }

    async loadTranslations(locale) {
        try {
            const response = await fetch(`i18n/${locale}.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.translations = await response.json();
        } catch (error) {
            console.error(`Failed to load translations for ${locale}:`, error);
            if (locale !== 'zh-CN') {
                console.log('Falling back to default language (zh-CN)');
                await this.loadTranslations('zh-CN');
            }
        }
    }

    translate(key) {
        return key.split('.').reduce((obj, i) => obj?.[i], this.translations) || key;
    }

    updateDOM() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translate(key);
        });

        // 更新占位符文本
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.translate(key);
        });
    }
    async setLocale(locale) {
        this.currentLocale = locale;
        localStorage.setItem('locale', locale);
        await this.loadTranslations(locale);
        this.updateDOM();
        // 触发自定义事件
        window.dispatchEvent(new CustomEvent('localeChanged', { detail: { locale } }));
    }

    bindEvents() {
        document.querySelectorAll('[data-lang]').forEach(element => {
            element.addEventListener('click', async (e) => {
                e.preventDefault();
                const locale = e.target.getAttribute('data-lang');
                await this.setLocale(locale);
            });
        });
    }

    formatMessage(key, params = {}) {
        let message = this.translate(key);
        Object.entries(params).forEach(([key, value]) => {
            message = message.replace(`{${key}}`, value);
        });
        return message;
    }
}

// 导出实例
export const i18n = new I18n(); 