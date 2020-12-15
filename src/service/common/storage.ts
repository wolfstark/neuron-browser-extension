import { Token } from 'typedi';
import { IStorageService } from '@neuron-browser-extension/shared/lib/storage';

export const ILocalStorageService = new Token<IStorageService>();

export const ISyncStorageService = new Token<IStorageService>();
