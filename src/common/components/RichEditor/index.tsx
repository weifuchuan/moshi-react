import React, { Component } from 'react';
import './index.less';
import BraftEditor, { BraftEditorProps, EditorState } from 'braft-editor';
import { upload, baseUrl, staticBaseUrl } from '@/common/kit/req';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/code-highlighter.css';

const CodeHighlighter = require('braft-extensions/dist/code-highlighter')
  .default;
const Markdown = require('braft-extensions/dist/markdown').default;

(BraftEditor as any).use(Markdown({}));
(BraftEditor as any).use(CodeHighlighter({}));

interface Props extends BraftEditorProps {
  editorRef?: React.RefObject<BraftEditor>;
}

export default function RichEditor(props: Props) {
  return (
    <BraftEditor
      ref={props.editorRef}
      media={{
        uploadFn: async (params) => {
          const { response, progress } = upload([ params.file ]);
          progress.subscribe((p) => {
            params.progress(p);
          });
          try {
            const resp = await response;
            const uri = resp.data[params.file.name];
            if (uri) {
              params.success({
                url: `${__DEV__ ? staticBaseUrl : ''}${uri}`,
                meta: {
                  id: params.file.name,
                  title: params.file.name,
                  alt: params.file.name,
                  loop: false,
                  autoPlay: false,
                  controls: true,
                  poster: ''
                }
              });
            } else {
              params.error({ msg: '上传失败' });
            }
          } catch (error) {
            params.error({ msg: error.toString() });
          }
        },
        validateFn: (file) => {
          return true;
        }
      }}
      {...props}
      style={{
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        ...props.style || {}
      }}
    />
  );
}

export class RichEditor2 extends Component<BraftEditorProps> {
  render() {
    return (
      <BraftEditor 
        media={{
          uploadFn: async (params) => {
            const { response, progress } = upload([ params.file ]);
            progress.subscribe((p) => {
              params.progress(p);
            });
            try {
              const resp = await response;
              const uri = resp.data[params.file.name];
              if (uri) {
                params.success({
                  url: `${__DEV__ ? staticBaseUrl : ''}${uri}`,
                  meta: {
                    id: params.file.name,
                    title: params.file.name,
                    alt: params.file.name,
                    loop: false,
                    autoPlay: false,
                    controls: true,
                    poster: ''
                  }
                });
              } else {
                params.error({ msg: '上传失败' });
              }
            } catch (error) {
              params.error({ msg: error.toString() });
            }
          },
          validateFn: (file) => {
            return true;
          }
        }}
        {...this.props}
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          ...this.props.style || {}
        }}
      />
    );
  }
}
