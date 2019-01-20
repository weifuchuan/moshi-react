import React from 'react';
import { GetProps } from 'react-redux';
import NavBar from '@/teacher/components/NavBar';
import { Control } from 'react-keeper';

type NavBarProps = GetProps<typeof NavBar>;

interface Props {
	children: React.ReactNode;
};

function Layout({   children }: Props) {
	return (
		<React.Fragment>
			<NavBar toLogin={() => Control.go('/login')} toReg={() => Control.go('/reg')}/>
			{children}
		</React.Fragment>
	);
}

export default Layout; 