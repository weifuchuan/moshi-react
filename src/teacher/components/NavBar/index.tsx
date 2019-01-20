import React from 'react';
import './index.scss';
import { Button } from 'antd';
import Account from '@/common/models/account';
import { connect } from 'react-redux';
import { State } from '@/teacher/store/state_type';

interface Props {
	me: Account | null;
	toLogin: () => void;
	toReg: () => void;
}

function NavBar({ me, toLogin, toReg }: Props) {
	return (
		<div className="NavBar">
			<div>
				<div>
					<span>默识</span>
					<span>|</span>
					<span>作者版</span>
				</div>
				<div>
					{me ? (
						<React.Fragment>
							<div />
						</React.Fragment>
					) : (
						<React.Fragment>
							<Button type={'primary'} onClick={toLogin}>
								登录
							</Button>
							<div style={{ width: '1em' }} />
							<Button onClick={toReg}>注册</Button>
						</React.Fragment>
					)}
				</div>
			</div>
		</div>
	);
}

export default connect((state: State) => ({ me: state.me }))(NavBar);
