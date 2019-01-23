import useTitle from '@/common/hooks/useTitle';
import { Account } from '@/common/models/account';
import Layout from '@/teacher/layouts/Layout';
import { State } from '@/teacher/store/state_type';
import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import './index.scss'; 

interface Props {
  me: Account;
}

const Home: FunctionComponent<Props> = ({ me,children }) => {
  useTitle('默识 - 作者端');

  return (
    <Layout>
      <div className="Home">
        <div >
          
        </div>
      </div>
    </Layout>
  );
};

export default connect((state: State) => ({ me: state.me! }))(Home);
