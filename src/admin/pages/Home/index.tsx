import React, { FunctionComponent, useContext } from 'react';
import './index.scss';
import { menu } from './menu';
import Layout from '@/admin/layouts/Layout';
import { Control } from 'react-keeper';

const Home: FunctionComponent = ({ children }) => {
  return (
    <div className={'Home'}>
      <div>
        <div className={'Logo'} style={{ cursor: "pointer" }} onClick={() => Control.go("/home")} >
          <span>默识 - 后台</span>
        </div>
        <div>{menu}</div>
      </div>
      <div>
        <Layout>{children}</Layout>
      </div>
    </div>
  );
};

export default Home;
