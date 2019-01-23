import React, { ReactNode } from 'react';
import './index.less';

export default function Panel({
	children,
	className,
	style
}: {
	children: ReactNode;
	className?: string;
	style?: React.CSSProperties;
}) {
	return (
		<div className={`Panel ${className || ''}`} style={style}>
			{children}
		</div>
	);
}
