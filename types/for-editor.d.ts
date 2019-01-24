import React from 'react';

export interface EditorProps {
	placeholder?: string;
	value?: string;
	lineNum?: boolean;
	height?: string;
	onChange: (value: string) => void;
	onSave: (value: string) => void;
	style?:React.CSSProperties;
}

export default class Editor extends React.Component<EditorProps> {}
