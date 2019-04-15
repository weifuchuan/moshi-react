import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
  useCallback
} from 'react';
import './index.less';
import { useObservable, observer } from 'mobx-react-lite';
import { _IPresetText } from '@/common/models/_db';
import { select, GET, POST_FORM } from '@/common/kit/req';
import patchToModelArray from '@/common/kit/functions/patchToModelArray';
import { observable, action } from 'mobx';
import { Collapse, Button, Select, message } from 'antd';
import MarkdownDiv from '@/common/components/MarkdownDiv';
import htmlToMarkdown from '@/common/kit/functions/htmlToMarkdown';
import HtmlDiv from '@/common/components/HtmlDiv';
import markdownToHtml from '@/common/kit/functions/markdownToHtml';
import Modal from 'react-responsive-modal';
import { PresetTextFormMD, PresetTextFormHTML } from './PresetTextForm';

const Panel = Collapse.Panel;
const Option = Select.Option;

const EMPTY_TEXT = Object.freeze({ key: '', value: '', type: 'md' });

const PresetText: FunctionComponent = ({ children }) => {
  const texts = useObservable<_IPresetText[]>([]);
  const edit = useObservable<{
    editing: boolean;
    editType: 'create' | 'update';
    valueType: 'html' | 'md';
    text: _IPresetText;
  }>({
    editing: false,
    editType: 'create',
    valueType: 'md',
    text: { ...EMPTY_TEXT }
  });

  useEffect(() => {
    (async () => {
      const ret = await select<_IPresetText>(
        '/select/manager',
        `select * from preset_text_m`
      );
      texts.splice(0, texts.length, ...observable(ret));
    })();
  }, []);

  const saveOrUpdate = async (text: _IPresetText) => {
    const resp = await POST_FORM('/admin/preset-text/saveOrUpdate', text);
    const ret = resp.data;
    if (ret.state === 'ok') {
      if (edit.editType === 'create') {
        texts.push(observable(text));
      } else {
        const i = texts.findIndex((t) => t.key === text.key);
        if (i !== -1) Object.assign(texts[i], text);
      }
      edit.editing = false;
    } else {
      message.error(ret.msg);
    }
  };

  return (
    <div className={'PresetText'}>
      <div className="Actions">
        <Button
          type="primary"
          onClick={action(() => {
            edit.editing = true;
            edit.editType = 'create';
            edit.text = { ...EMPTY_TEXT };
          })}
        >
          新建
        </Button>
      </div>
      <Collapse>
        {texts.map((t, i) => {
          return (
            <Panel header={t.key} key={t.key}>
              <div className={'Options'}>
                <Select
                  value={t.type}
                  onChange={async (type) => {
                    let value = '';
                    if (t.type === 'html') {
                      if (confirm('将把html格式转为markdown，可能会有格式错误，是否转换？')) {
                        value = htmlToMarkdown(t.value);
                      } else if (confirm('将把Markdown格式转为html，可能会有格式错误，是否转换？')) {
                        value = await markdownToHtml(t.value);
                      }
                      const resp = await POST_FORM(
                        '/admin/preset-text/saveOrUpdate',
                        { ...t, value, type }
                      );
                      const ret = resp.data;
                      if (ret.state === 'ok') {
                        Object.assign(t, { value, type });
                      } else {
                        message.error(ret.msg);
                      }
                    }
                  }}
                >
                  <Option value="html">html</Option>
                  <Option value="md">markdown</Option>
                </Select>
                <Button
                  type="primary"
                  style={{ marginLeft: '1em' }}
                  onClick={action(() => {
                    edit.editing = true;
                    edit.editType = 'update';
                    edit.text = t;
                    edit.valueType = t.type as any;
                  })}
                >
                  编辑
                </Button>
                <Button
                  type="danger"
                  onClick={async () => {
                    if (confirm('确定删除？')) {
                      await GET('/admin/preset-text/delete', { key: t.key });
                      texts.splice(i, 1);
                    }
                  }}
                  style={{ marginLeft: '1em' }}
                >
                  删除
                </Button>
              </div>
              {t.type === 'html' ? (
                <HtmlDiv html={t.value} />
              ) : (
                <MarkdownDiv md={t.value} />
              )}
            </Panel>
          );
        })}
      </Collapse>
      <Modal
        open={edit.editing}
        onClose={() => (edit.editing = false)}
        classNames={{ modal: 'BigModal' }}
      >
        {edit.editType === 'update' ? null : (
          <Select
            value={edit.valueType}
            onChange={async (type) => {
              edit.valueType = type;
            }}
          >
            <Option value="html">html</Option>
            <Option value="md">markdown</Option>
          </Select>
        )}
        {edit.valueType === 'md' ? (
          <PresetTextFormMD
            presetText={edit.text}
            isUpdate={edit.editType === 'update'}
            onSubmit={saveOrUpdate}
          />
        ) : (
          <PresetTextFormHTML
            presetText={edit.text}
            isUpdate={edit.editType === 'update'}
            onSubmit={saveOrUpdate}
          />
        )}
      </Modal>
    </div>
  );
};

export default observer(PresetText);
