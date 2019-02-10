import { TimeCell, TextCell } from '@/common/components/tables';
import { StoreContext } from '@/admin/store';
import Modal from '@/common/components/Modal';
import { IRole, Permission, Role as RoleModel, RolePermission } from '@/common/models/admin';
import { Button, Input, message, Popconfirm, Popover, Switch, Tooltip } from 'antd';
import _ from 'lodash';
import { observable } from 'mobx';
import { observer, Observer } from 'mobx-react-lite';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import ReactTable, { Column } from 'react-table';
import 'react-table/react-table.css';
import './index.scss';
import { buildObserverCell } from '../../../common/components/tables/index';
import IssueAdmin, { IIssueAdmin } from '@/admin/models/IssueAdmin';

const ButtonGroup = Button.Group;

interface Props{
  params:{
    id:string; 
  }
}

const Issue: FunctionComponent<Props> = ({params, children }) => {
  const id = Number.parseInt(params.id); 

  const store = useContext(StoreContext);

  useEffect(() => {
    store.fetchIssues(id); 
  }, []);

  const issues = store.issues.filter(i=>i.id===id); 

  return (
    <div className={'Issue'}>
      <div className={'Actions'}>
      
      </div>
      <ReactTable columns={columns} data={issues} defaultPageSize={10} />
    </div>
  );
};

export default observer(Issue);

const columns: Column<IssueAdmin>[] = [
  {
    Header: '操作',
    // accessor: 'id',
    Cell: buildObserverCell((info)=>{
      return <div>

      </div>
    })
  },
  {
    Header: 'id',
    accessor: 'id'
  },
  {
    Header: '标题',
    accessor: 'title',
    Cell:TextCell
  },
  {
    
  },
  {
    Header: '开放时间',
    accessor: 'openAt',
    Cell: TimeCell
  }
];
