import useTitle from '@/common/hooks/useTitle';
import { Account } from '@/common/models/account';
import Layout from '@/teacher/layouts/Layout';
import { State } from '@/teacher/store/state_type';
import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { Course } from '@/common/models/course';
import Panel from '@/common/components/Panel';
import { Tree, Button } from 'antd';
import { AntTreeNode } from 'antd/lib/tree';
import { Control } from 'react-keeper';

const { TreeNode } = Tree;

interface Props {
  me: Account;
  courses: Course[];
}

const Home: FunctionComponent<Props> = ({ me, courses, children }) => {
  useTitle('默识 - 作者端');

  return (
    <Layout>
      <div className="Home">
        <div>
          <Panel className={"box"} onClick={()=>Control.go("/course")} >
            <div>我的课程</div>
          </Panel>
        </div>
      </div>
    </Layout>
  );
};

export default connect((state: State) => ({
  me: state.me!,
  courses: state.courses
}))(Home);
