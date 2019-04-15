import { Button, Form, Input, message, DatePicker } from "antd";
import { FormComponentProps } from "antd/lib/form";
import React from "react";
import { IAccount } from "@/common/models/Account";
import './forms.less'
import _AvatarSelector from "@/common/components/AvatarSelector";
import { upload, Ret } from "@/common/kit/req";
import moment from "moment";

const AvatarSelector: any = _AvatarSelector;

class AccountForm extends React.Component<
  FormComponentProps & {
    account: IAccount;
    onSave: (account: IAccount) => void;
  }
> {
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll(async (err, values: IAccount) => {
      if (!err) {
        // base64
        if (typeof values.avatar === "object") {
          const { response } = upload(
            [(values.avatar as any).file],
            {},
            "/avatar/upload"
          );
          const resp = await response;
          const ret: Ret = resp.data;
          if (ret.state === "ok") {
            values.avatar = ret.uri;
          } else {
            message.error(ret.msg);
            return;
          }
        }
        if (values.birthday) {
          values.birthday = (values.birthday as any).toDate().getTime();
        }
        const account = { ...this.props.account, ...values };
        this.props.onSave(account);
      }
    });
  };

  render() {
    const { account } = this.props;
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
        <Form.Item {...formItemLayout} label="昵称">
          {getFieldDecorator("nickName", {
            initialValue: account.nickName,
            rules: [{ required: true, message: "请输入昵称" }]
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="邮箱">
          {getFieldDecorator("email", {
            initialValue: account.email,
            rules: [
              { required: true, message: "请输入邮箱" },
              {
                pattern: /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/,
                message: "邮箱格式不正确"
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="手机">
          {getFieldDecorator("phone", {
            initialValue: account.phone,
            rules: [
              {
                pattern: /^1(3|4|5|7|8)\d{9}$/,
                message: "手机格式不正确"
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="头像">
          {getFieldDecorator("avatar", {
            initialValue: account.avatar,
            rules: []
          })(<AvatarSelector />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="真实名">
          {getFieldDecorator("realName", {
            initialValue: account.realName,
            rules: []
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="身份证号">
          {getFieldDecorator("identityNumber", {
            initialValue: account.identityNumber,
            rules: []
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="年龄">
          {getFieldDecorator("age", {
            initialValue: account.age,
            rules: []
          })(<Input type={"number"} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="公司">
          {getFieldDecorator("company", {
            initialValue: account.company,
            rules: []
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="职位">
          {getFieldDecorator("position", {
            initialValue: account.position,
            rules: []
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="个人介绍">
          {getFieldDecorator("personalProfile", {
            initialValue: account.personalProfile,
            rules: []
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="性别">
          {getFieldDecorator("sex", {
            initialValue: account.sex,
            rules: []
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="生日">
          {getFieldDecorator("birthday", {
            initialValue: account.birthday
              ? moment(account.birthday)
              : undefined,
            rules: []
          })(<DatePicker format="YYYY-MM-DD" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="学历">
          {getFieldDecorator("education", {
            initialValue: account.education,
            rules: []
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="行业">
          {getFieldDecorator("profession", {
            initialValue: account.profession,
            rules: []
          })(<Input />)}
        </Form.Item>
        {/* <Form.Item {...formItemLayout} label="">
          {getFieldDecorator("createAt", {
            initialValue: account.createAt,
            rules: [
              { type: "number", required: true, message: "Please select time!" }
            ]
          })(<DatePickerButTime showTime format="YYYY-MM-DD HH:mm:ss" />)}
        </Form.Item> */}
        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              this.handleSubmit();
            }}
          >
            确定
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(AccountForm);
