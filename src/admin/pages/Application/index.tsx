import { Radio } from 'antd';
import React, { FunctionComponent } from 'react';
import { Control } from 'react-keeper';
import './index.less';
 

const Application: FunctionComponent = ({ children }) => {
  let defaultValue = 'a';
  const path = Control.path;
  if (path.endsWith('unpassed')) {
    defaultValue = 'a';
  } else if (path.endsWith('success')) {
    defaultValue = 'b';
  }
  if (path.endsWith('fail')) {
    defaultValue = 'c';
  }
  return (
    <div className={'Application'}>
      <Radio.Group
        defaultValue={defaultValue}
        buttonStyle="solid"
        onChange={(e) => {
          switch (e.target.value) {
            case 'a':
              Control.go('/home/apply/unpassed');
              break;
            case 'b':
              Control.go('/home/apply/success');
              break;
            case 'c':
              Control.go('/home/apply/fail');
              break;
          }
        }}
      >
        <Radio.Button value="a">未审核</Radio.Button>
        <Radio.Button value="b">已通过</Radio.Button>
        <Radio.Button value="c">已打回</Radio.Button>
      </Radio.Group>
      {children}
    </div>
  );
};

export default Application;
