import { Button, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React from 'react';
import './forms.scss';
import BraftEditor from 'braft-editor';
import { RichEditor2 } from '@/common/components/RichEditor';
import ArticleAdmin from '@/admin/models/ArticleAdmin';

class ArticleForm extends React.Component<
  FormComponentProps & {
    article: ArticleAdmin;
    onSubmit: (values: any) => void;
  }
> {
  handleSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.content = values.content.toHTML();
        this.props.onSubmit(values); 
      }
    });
  };

  render() {
    const { article } = this.props;
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
        <Form.Item {...formItemLayout} label="标题">
          {getFieldDecorator('title', {
            initialValue: article.title,
            rules: []
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="内容"> 
          {getFieldDecorator('content', {
            initialValue: BraftEditor.createEditorState(article.content),
            rules: []
          })(<RichEditor2 />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="音频">
          {getFieldDecorator('audioId', {
            initialValue: article.audioId,
            rules: []
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="内容类型">
          {getFieldDecorator('contentType', {
            initialValue: article.contentType,
            rules: []
          })(<Input disabled />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button onClick={this.handleSubmit}  type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(ArticleForm);
