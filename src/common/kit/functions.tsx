import * as React from 'react';
import { POST } from '@/common/kit/req';
import axios from 'axios';
import { Converter } from 'showdown';

export async function retryDo<Result = any>(action: () => Promise<Result>, retryCount: number = 3): Promise<Result> {
	if (retryCount > 1) {
		try {
			return await action();
		} catch (err) {
			return await retryDo(action, retryCount - 1);
		}
	} else {
		try {
			return await action();
		} catch (err) {
			throw err;
		}
	}
}

// repeat run f by timeout if f return false
export function repeat(f: () => boolean, timeout: number = 1000 / 60) {
	const g: any = (g: any) => {
		if (f()) {
			return;
		}
		setTimeout(() => {
			g(g);
		}, timeout);
	};
	g(g);
}

export function packToClassComponent(C: React.FunctionComponent) {
	return class extends React.Component {
		render(): React.ReactNode {
			return <C />;
		}
	};
}

const onceLength = 100000;

const converter = new Converter();
converter.setFlavor('github');

export async function markdownToHtml(md: string): Promise<string> {
	const lines = md.split('\n');
	let containsCode = false;
	for (let line of lines) {
		if (line.trim() === '```') {
			containsCode = true;
			break;
		}
	}
	if (containsCode) {
		const { data } = await axios.post(
			'https://api.github.com/markdown',
			{ text: md, mode: 'markdown' },
			{ responseType: 'text' }
		);
		return data;
	} else {
		return converter.makeHtml(md);
	}
}

if (__DEV__) {
	(window as any).markdownToHtml = markdownToHtml;
}
