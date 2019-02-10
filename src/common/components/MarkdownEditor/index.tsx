import React, { useState, Component } from 'react';
import './index.scss';
import _ from 'lodash';
import { upload, staticBaseUrl, baseUrl } from '@/common/kit/req';
import qs from 'qs';

let Stackedit = require('stackedit-js');
if (Stackedit.default) {
  Stackedit = Stackedit.default;
}

export interface MarkdownEditorProps {
  defaultValue?: string;
  _defaultValue?: string; // for antd form
  onChange?: (value: string) => void;
  style?: React.CSSProperties | undefined;
}

export default class MarkdownEditor extends Component<MarkdownEditorProps> {
  editor: HTMLTextAreaElement | null = null;
  stackedit = new Stackedit({
    url: 'stackedit.html',
    DEV: false,
    // staticBaseUrl: staticBaseUrl,
    uploadAction: __DEV__ ? baseUrl + '/file/upload' : '/file/upload'
  });

  render() { 
    return (
      <div className={'MarkdownEditor'} style={this.props.style}>
        <textarea
          defaultValue={
            this.props.defaultValue || this.props._defaultValue || ''
          }
          ref={(e) => (this.editor = e)}
          placeholder={'Input some content with markdown...'}
          rows={10}
        />
        <div style={{ width: '100%' }}>
          <a
            style={{
              color: '#1890ff',
              margin: '8px',
              cursor: 'pointer',
              fontSize: '8px'
            }}
            onClick={this.openMdEditor}
          >
            在Markdown编辑器中编辑
          </a>
        </div>
      </div>
    );
  }

  openMdEditor = () => {
    this.stackedit.openFile({
      content: {
        text: this.editor!.value
      }
    });
    this.stackedit.on('fileChange', (file: any) => {
      this.editor!.value = file.content.text;
      this.props.onChange && this.props.onChange(file.content.text);
    });
  };
}

if (__DEV__) {
  (window as any).qs = qs;
}
