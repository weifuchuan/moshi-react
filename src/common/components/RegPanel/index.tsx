import React from 'react';
import './index.less';
import { Button, Checkbox, Form, Icon, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import Panel from '../Panel';

export interface RegData {
	email: string;
	nickName: string;
	password: string;
	captcha: string;
}

export interface RegPanelProps {
	onReg: (data: RegData) => void;
	toLogin: () => void;
	getCaptcha: () => Promise<string>;
}

export default function RegPanel({ onReg, toLogin, getCaptcha }: RegPanelProps) {
	return (
		<Panel className={'RegPanel'}>
			<div>
				<span>注册</span>
			</div>
			<div>
				<WrappedNormalRegForm toLogin={toLogin} reg={onReg} getCaptcha={getCaptcha} />
			</div>
		</Panel>
	);
}

class NormalRegForm extends React.Component<
	FormComponentProps & {
		toLogin: () => void;
		reg: (data: RegData) => void;
		getCaptcha: () => Promise<string>;
	}
> {
	state = { captchaImg: '' };

	componentDidMount(): void {
		(async () => {
			const captchaImg = await this.props.getCaptcha();
			this.setState({ captchaImg });
		})();
	}

	handleSubmit = (e: any) => {
		e.preventDefault();
		this.props.form.validateFields((err, values: RegData) => {
			if (!err) {
				this.props.reg(values);
			}
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Form onSubmit={this.handleSubmit} style={{ marginBottom: '-2em' }}>
				<Form.Item>
					{getFieldDecorator('email', {
						rules: [
							{ required: true, message: '请输入您的邮箱' },
							{
								pattern: /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/,
								message: '邮箱格式不正确'
							}
						]
					})(<Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="邮箱" />)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('nickName', {
						rules: [ { required: true, message: '请输入您的昵称' } ]
					})(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="昵称" />)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('password', {
						rules: [ { required: true, message: '请输入您的密码' }, { min: 6, message: '密码过短' } ]
					})(
						<Input
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="password"
							placeholder="密码"
						/>
					)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('password2', {
						rules: [
							{ required: true, message: '请确认您的密码' },
							{
								validator: (rule: any, value: any, callback: any) => {
									const form = this.props.form;
									if (value && value !== form.getFieldValue('password')) {
										callback('两次密码不相同');
									} else {
										callback();
									}
								}
							}
						]
					})(
						<Input
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="password"
							placeholder="确认密码"
						/>
					)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('captcha', {
						rules: [ { required: true, message: '请输入验证码' } ]
					})(
						<Input
							prefix={<Icon type="exclamation-circle" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="验证码"
							suffix={
								<img
									alt={'点击刷新'}
									src={this.state.captchaImg}
									className={'captcha'}
									onClick={async () => {
										this.setState({
											captchaImg: await this.props.getCaptcha()
										});
									}}
								/>
							}
						/>
					)}
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" className="reg-form-button">
						注册
					</Button>
					Or <a onClick={this.props.toLogin}>登录</a>
				</Form.Item>
			</Form>
		);
	}
}

const WrappedNormalRegForm = Form.create()(NormalRegForm);
