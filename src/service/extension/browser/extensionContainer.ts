import { getLocaleExtensionManifest } from '@neuron-browser-extension/extensions';
import { LOCAL_USER_PREFERENCE_LOCALE_KEY } from '@/common/types';
import { IExtensionWithId } from '@/extensions/common';
import { extensions } from '@/extensions';
import { IStorageService } from '@neuron-browser-extension/shared/lib/storage';
import { ILocalStorageService } from '@/service/common/storage';
import { Service, Inject } from 'typedi';
import { IExtensionContainer } from '@/service/common/extension';
import { observable } from 'mobx';

class ExtensionContainer implements IExtensionContainer {
  @observable
  public extensions: IExtensionWithId[] = [];

  constructor(@Inject(ILocalStorageService) private localStorageService: IStorageService) {
    this.init();
    this.localStorageService.onDidChangeStorage(e => {
      if (e === LOCAL_USER_PREFERENCE_LOCALE_KEY) {
        this.init();
      }
    });
  }

  private init() {
    const locale = this.localStorageService.get(
      LOCAL_USER_PREFERENCE_LOCALE_KEY,
      navigator.language
    );
    const internalExtensions = extensions.map(e => ({
      ...e,
      manifest: getLocaleExtensionManifest(e.manifest, locale),
    }));
    this.extensions = internalExtensions;
  }
}

Service(IExtensionContainer)(ExtensionContainer);
