import { IContentScriptService } from '@/service/common/contentScript';
import { IServerChannel, IChannel } from '@/service/common/ipc';

export class ContentScriptChannel implements IServerChannel {
  constructor(private service: IContentScriptService) {}

  call = async (
    _context: chrome.runtime.Port['sender'],
    command: string,
    arg: any
  ): Promise<any> => {
    switch (command) {
      case 'remove':
        return this.service.remove();
      case 'hide':
        return this.service.hide();
      case 'checkStatus':
        return this.service.checkStatus();
      case 'toggle':
        return this.service.toggle();
      case 'runScript': {
        return this.service.runScript(arg[0], arg[1]);
      }
      default: {
        throw new Error(`Call not found: ${command}`);
      }
    }
  };
}

export class ContentScriptChannelClient implements IContentScriptService {
  constructor(private channel: IChannel) {}

  remove = async (): Promise<void> => {
    return this.channel.call('remove');
  };

  runScript = async (id: string, lifeCycle: 'run' | 'destroy'): Promise<void> => {
    return this.channel.call('runScript', [id, lifeCycle]);
  };

  hide = async (): Promise<void> => {
    return this.channel.call('hide');
  };
  checkStatus = async (): Promise<boolean> => {
    return this.channel.call('checkStatus');
  };
  toggle = async (): Promise<void> => {
    return this.channel.call('toggle');
  };
}
