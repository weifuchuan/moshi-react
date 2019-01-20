import React from 'react';
import './index.less';
import { Button, Checkbox, Form, Icon, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import Panel from '../Panel';

export interface LoginData {
	email: string;
	password: string;
	captcha: string;
}

export interface LoginPanelProps {
	onLogin: (data: LoginData) => void;
	toReg: () => void;
	getCaptcha: () => Promise<string>;
}

export default function LoginPanel({ onLogin, toReg, getCaptcha }: LoginPanelProps) {
	return (
		<Panel className={'LoginPanel'}>
			<div>
				<span>登录</span>
			</div>
			<div>
				<WrappedNormalLoginForm toReg={toReg} login={onLogin} getCaptcha={getCaptcha} />
			</div>
		</Panel>
	);
}

class NormalLoginForm extends React.Component<
	FormComponentProps & {
		toReg: () => void;
		login: (data: LoginData) => void;
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
		this.props.form.validateFields((err, values: LoginData) => {
			if (!err) {
				this.props.login(values);
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
					<Button type="primary" htmlType="submit" className="login-form-button">
						登录
					</Button>
					Or <a onClick={this.props.toReg}>注册</a>
				</Form.Item>
			</Form>
		);
	}
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
