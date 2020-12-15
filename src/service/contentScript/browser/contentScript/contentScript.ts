import { IContentScriptService } from '@/service/common/contentScript';
import { Service, Inject } from 'typedi';
import styles from '@/service/contentScript/browser/contentScript/contentScript.less';
import * as browser from '@neuron-browser-extension/chrome-promise';
import * as QRCode from 'qrcode';
import { Readability } from '@neuron-browser-extension/readability';
import AreaSelector from '@neuron-browser-extension/area-selector';
import Highlighter from '@neuron-browser-extension/highlight';
import plugins from '@neuron-browser-extension/turndown';
import TurndownService from 'turndown';
import { ContentScriptContext } from '@/extensions/common';
import { localStorageService } from '@/common/chrome/storage';
import { LOCAL_USER_PREFERENCE_LOCALE_KEY } from '@/common/types';
import { IExtensionContainer } from '@/service/common/extension';

const turndownService = new TurndownService({ codeBlockStyle: 'fenced' });
turndownService.use(plugins);
class ContentScriptService implements IContentScriptService {
  constructor(@Inject(IExtensionContainer) private extensionContainer: IExtensionContainer) {}

  async remove() {
    $(`.${styles.toolFrame}`).remove();
  }
  async hide() {
    $(`.${styles.toolFrame}`).hide();
  }
  async toggle() {
    if ($(`.${styles.toolFrame}`).length === 0) {
      $('body').append(
        `<iframe src="${browser.extension.getURL('tool.html')}" class=${styles.toolFrame}></iframe>`
      );
    } else {
      $(`.${styles.toolFrame}`).toggle();
    }
  }
  async checkStatus() {
    return true;
  }
  async toggleLoading() {
    const loadIngStyle = styles['neuron-browser-extension-loading-box'];
    if ($(`.${loadIngStyle}`).length === 0) {
      $('body').append(`
      <div class=${loadIngStyle}>
        <div class="neuron-browser-extension-loading">
          <div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
          </div>
        </div>
      </div>
      `);
    } else {
      $(`.${loadIngStyle}`).remove();
    }
  }

  async runScript(id: string, lifeCycle: 'run' | 'destroy') {
    const extensions = this.extensionContainer.extensions;
    const extension = extensions.find(o => o.id === id);
    const lifeCycleFunc = extension?.extensionLifeCycle[lifeCycle];
    if (!lifeCycleFunc) {
      return;
    }
    await localStorageService.init();
    const toggleClipper = () => {
      $(`.${styles.toolFrame}`).toggle();
    };
    const context: ContentScriptContext = {
      locale: localStorageService.get(LOCAL_USER_PREFERENCE_LOCALE_KEY, navigator.language),
      turndown: turndownService,
      Highlighter: Highlighter,
      toggleClipper,
      Readability,
      document,
      AreaSelector,
      QRCode,
      $,
      toggleLoading: () => {
        this.toggleLoading();
      },
    };
    $(`.${styles.toolFrame}`).blur();
    return lifeCycleFunc(context);
  }
}

Service(IContentScriptService)(ContentScriptService);
