import React, { useRef } from 'react';
import Layout from '@/teacher/layouts/Layout';
import { Control } from 'react-keeper';
import LoginPanel from '@/common/components/LoginPanel';
import qs from 'qs';
import { login } from '@/common/models/account';
import { message } from 'antd';
import { connect } from 'react-redux';
import { setMe } from '@/teacher/store/me/actions';
import './index.scss';
import useWindowSize from '@/common/hooks/useWindowSize';

interface Props {
	setMe: typeof setMe;
}

function Login({ setMe }: Props) { 
	return (
		<Layout>
			<div className="Login" >
				<LoginPanel 
					onLogin={async ({ email, password, captcha }) => {
						try {
							const account = await login(email, password, captcha);
							message.success('登录成功');
							setMe(account);
							let nextPath = '/';
							const i = Control.path.indexOf('?');
							if (i !== -1) {
								const params = qs.parse(Control.path.substring(Control.path.indexOf('?') + 1));
								if (params.returnUrl && typeof params.returnUrl === 'string') {
									nextPath = params.returnUrl;
								}
							}
							Control.go(nextPath);
						} catch (error) {
							message.error(error);
						}
					}}
					toReg={() => Control.go('/reg')}
					getCaptcha={() => Promise.resolve('https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg')}
				/>
			</div>
		</Layout>
	);
}

export default connect(null, { setMe })(Login);
