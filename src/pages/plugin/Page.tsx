import React from 'react';
import { connect, router } from 'dva';
import { ExtensionType } from '@neuron-browser-extension/extensions';
import TextEditor from './TextEditor';
import { DvaRouterProps } from '@/common/types';
import { useObserver } from 'mobx-react';
import Container from 'typedi';
import { IExtensionContainer } from '@/service/common/extension';

const { Redirect } = router;

const ClipperPluginPage: React.FC<DvaRouterProps> = props => {
  const {
    history: {
      location: { pathname },
    },
  } = props;
  const extensions = useObserver(() => Container.get(IExtensionContainer).extensions);
  const extension = extensions.find(o => o.router === pathname);
  if (!extension) {
    return <Redirect to="/"></Redirect>;
  }
  if (extension.type === ExtensionType.Text) {
    return <TextEditor extension={extension} pathname={pathname} />;
  }
  return <Redirect to="/"></Redirect>;
};

export default connect()(ClipperPluginPage);
