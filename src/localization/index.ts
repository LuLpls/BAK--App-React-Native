import { I18n } from 'i18n-js';
import * as Localization from 'react-native-localize';

import en from './en';
import cs from './cs';
import de from './de';

const i18n = new I18n({
  en,
  cs,
  de,
});

// Nastavení fallbacků
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

// Nastavení locale podle zařízení
const locales = Localization.getLocales();

if (locales.length > 0) {
  i18n.locale = locales[0].languageTag;
}

export default i18n;
