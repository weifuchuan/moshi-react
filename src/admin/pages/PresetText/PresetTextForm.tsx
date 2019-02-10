import { Button, Form, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React from 'react';
import { _IPresetText } from '@/common/models/_db';
import { RichEditor2 } from '@/common/components/RichEditor';
import MarkdownEditor from '@/common/components/MarkdownEditor';
import BraftEditor from 'braft-editor';

export const PresetTextFormHTML = Form.create()(
  class extends React.Component<
    FormComponentProps & {
      presetText: _IPresetText;
      isUpdate:boolean;
      onSubmit: (values: _IPresetText) => void;
    }
  > {
    handleSubmit = (e: React.FormEvent<any>) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.value = values.value.toHTML();
          this.props.onSubmit(values);
        }
      });
    };

    render() {
      const { presetText } = this.props;
      const { getFieldDecorator } = this.props.form;

      const formItemLayout = {
        labelCol: {
          xs: { span: 24 }
        },
        wrapperCol: {
          xs: { span: 24 }
        }
      };
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          }
        }
      };

      return (
        <Form>
          <Form.Item {...formItemLayout} label="key">
            {getFieldDecorator('key', {
              initialValue: presetText.key,
              rules: [ { required: true, message: 'Please input key. ' } ]
            })(<Input  disabled={this.props.isUpdate} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="value">
            {getFieldDecorator('value', {
              initialValue: BraftEditor.createEditorState(presetText.value),
              rules: [ { required: true, message: 'Please input value. ' } ]
            })(<RichEditor2 />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="type">
            {getFieldDecorator('type', {
              initialValue: 'html',
              rules: [ { required: true, message: 'Please select type. ' } ]
            })(
              <Select disabled>
                <Select.Option value="html">html</Select.Option>
                <Select.Option value="md">markdown</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={this.handleSubmit}
            >
              确定
            </Button>
          </Form.Item>
        </Form>
      );
    }
  }
);

export const PresetTextFormMD = Form.create()(
  class extends React.Component<
    FormComponentProps & {
      presetText: _IPresetText;
      isUpdate:boolean;
      onSubmit: (values: _IPresetText) => void;
    }
  > {
    handleSubmit = (e: React.FormEvent<any>) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.props.onSubmit(values);
        }
      });
    };

    render() {
      const { presetText } = this.props;
      const { getFieldDecorator } = this.props.form;

      const formItemLayout = {
        labelCol: {
          xs: { span: 24 }
        },
        wrapperCol: {
          xs: { span: 24 }
        }
      };
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          }
        }
      };

      return (
        <Form>
          <Form.Item {...formItemLayout} label="key">
            {getFieldDecorator('key', {
              initialValue: presetText.key,
              rules: [ { required: true, message: 'Please input key. ' } ]
            })(<Input disabled={this.props.isUpdate} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="value">
            {getFieldDecorator('value', {
              initialValue: presetText.value,
              rules: [ { required: true, message: 'Please input value. ' } ]
            })(<MarkdownEditor _defaultValue={presetText.value} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="type">
            {getFieldDecorator('type', {
              initialValue: 'md',
              rules: [ { required: true, message: 'Please select type. ' } ]
            })(
              <Select disabled>
                <Select.Option value="html">html</Select.Option>
                <Select.Option value="md">markdown</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={this.handleSubmit}
            >
              确定
            </Button>
          </Form.Item>
        </Form>
      );
    }
  }
);
