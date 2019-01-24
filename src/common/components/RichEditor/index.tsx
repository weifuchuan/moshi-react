import React from 'react';
import './index.scss';
import BraftEditor, { BraftEditorProps, EditorState } from 'braft-editor';
import { upload } from '@/common/kit/req';
import 'braft-editor/dist/index.css';

const Markdown = require('braft-extensions/dist/markdown');

BraftEditor.use(Markdown({}));

interface Props extends BraftEditorProps {}

function RichEditor(props: Props) {
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
                url: uri,
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
    />
  );
}
