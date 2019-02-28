import DatePickerButTime from '@/common/components/DatePickerButTime';
import { RichEditor2 } from '@/common/components/RichEditor';
import { Button, Form, Input, InputNumber, DatePicker, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import BraftEditor from 'braft-editor';
import React from 'react';
import CourseAdmin from '@/admin/models/CourseAdmin';
import './forms.scss';
import moment from 'moment';
import ImageSelector from '@/common/components/ImageSelector';
import { upload } from '@/common/kit/req';
import isUndefOrNull from '@/common/kit/functions/isUndefOrNull';

class CourseForm extends React.Component<
  FormComponentProps & {
    course: CourseAdmin;
    onSubmit: (values: any) => void;
  }
> {
  handleSubmit = (e: React.FormEvent<any>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        // base64
        if (
          typeof values.introduceImage === 'object' &&
          !isUndefOrNull(values.introduceImage)
        ) {
          const { response } = upload([ (values.introduceImage as any).file ]);
          const resp = await response;
          const ret: any = resp.data;
          if (ret[((values.introduceImage as any).file as File).name]) {
            values.introduceImage =
              ret[((values.introduceImage as any).file as File).name];
          } else {
            message.error("上传失败");
            return;
          }
        }
        values.introduce = values.introduce.toHTML();
        values.note = values.note.toHTML();
        values.offerTo = values.offerTo
          ? values.offerTo.toDate().getTime()
          : undefined;
        this.props.onSubmit(values);
      }
    });
  };

  render() {
    const { course } = this.props;
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
        <Form.Item {...formItemLayout} label="专栏名">
          {getFieldDecorator('name', {
            initialValue: course.name,
            rules: []
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="专栏简介">
          {getFieldDecorator('introduce', {
            initialValue: BraftEditor.createEditorState(course.introduce),
            rules: []
          })(<RichEditor2 />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="简介图片">
          {getFieldDecorator('introduceImage', {
            initialValue: course.introduceImage ? course.introduceImage : '',
            rules: []
            // @ts-ignore
          })(<ImageSelector />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="订阅须知">
          {getFieldDecorator('note', {
            initialValue: BraftEditor.createEditorState(course.note),
            rules: []
          })(<RichEditor2 />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="标准价格">
          {getFieldDecorator('price', {
            initialValue: course.price,
            rules: []
          })(<InputNumber />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="优惠价格">
          {getFieldDecorator('discountedPrice', {
            initialValue: course.discountedPrice,
            rules: []
          })(<InputNumber />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="优惠到某时间">
          {getFieldDecorator('offerTo', {
            initialValue: course.offerTo ? moment(course.offerTo) : undefined,
            rules: []
          })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button onClick={this.handleSubmit} type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(CourseForm);
