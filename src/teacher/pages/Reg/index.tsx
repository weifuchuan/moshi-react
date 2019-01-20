import React from 'react';
import Layout from '@/teacher/layouts/Layout';
import { Control } from 'react-keeper';
import RegPanel from '@/common/components/RegPanel';
import './index.scss'

function Reg() {
	return (
		<Layout>
			<div className="Login"  >
				<RegPanel
					onReg={() => {}}
					toLogin={() => Control.go('/login')}
					getCaptcha={() => Promise.resolve('https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg')}
				/>
			</div>
		</Layout>
	);
}

export default Reg;
