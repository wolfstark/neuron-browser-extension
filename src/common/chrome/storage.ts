import { AbstractStorageService } from '@neuron-browser-extension/shared/lib/storage';
import * as browser from '@neuron-browser-extension/chrome-promise';

class LocalStorageService extends AbstractStorageService {
  constructor() {
    super(browser.storage.local, browser.storage.onChanged, 'local');
  }
}

class SyncStorageService extends AbstractStorageService {
  constructor() {
    super(browser.storage.sync, browser.storage.onChanged, 'sync');
  }
}

const localStorageService = new LocalStorageService();
const syncStorageService = new SyncStorageService();

export { localStorageService, syncStorageService };
