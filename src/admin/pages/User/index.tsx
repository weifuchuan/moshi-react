import AccountForm from '@/admin/components/forms/AccountForm';
import {
  OptionalCell,
  OptionalTimeCell,
  TimeCell,
  TextCell
} from '@/common/components/tables';
import { StoreContext } from '@/admin/store';
import Modal from '@/common/components/Modal';
import BitKit from '@/common/kit/BitKit';
import { POST_FORM } from '@/common/kit/req';
import Account, { IAccount } from '@/common/models/Account';
import { AccountRole } from '@/common/models/admin';
import { Button, Icon, message, Popover, Switch, Tooltip } from 'antd';
import { observable, toJS } from 'mobx';
import { observer, Observer, useObservable } from 'mobx-react-lite';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from 'react';
import ReactTable, { Column } from 'react-table';
import 'react-table/react-table.css';
import './index.less';

const ButtonGroup = Button.Group;

const User: FunctionComponent = ({ children }) => {
  const store = useContext(StoreContext);

  const accounts = useObservable<IAccount[]>([]);
  const [ pageNumber, setPageNumber ] = useState(1);
  const [ totalRow, setTotalRow ] = useState(0);
  const [ totalPage, setTotalPage ] = useState(0);
  const [ pageSize, setPageSize ] = useState(10);

  const page = async (pn: number) => {
    const {
      totalRow,
      totalPage,
      list,
      pageSize,
      pageNumber
    } = await store.pageAccounts(pn);
    accounts.splice(0, accounts.length, ...list);
    setTotalRow(totalRow);
    setTotalPage(totalPage);
    setPageSize(pageSize);
    setPageNumber(pageNumber);
  };

  useEffect(() => {
    page(pageNumber);
    store.fetchAllPermissionAndRoleData();
  }, []);

  return (
    <div className={'User'}>
      <ReactTable
        sortable={false}
        data={accounts.slice()}
        columns={accountColumns}
        pageSize={pageSize}
        pages={totalPage}
        onPageChange={page}
        showPageSizeOptions={false}
      />
    </div>
  );
};

export default observer(User);

const accountColumns: Column<IAccount>[] = [
  {
    Header: '操作',
    Cell: ({ original }) => {
      return (
        <ButtonGroup>
          <Tooltip placement="top" title={'更新'}>
            <Button
              size={'small'}
              onClick={() => {
                function UpdateAccount({ account }: { account: IAccount }) {
                  return (
                    <div
                      style={{ width: '100%', height: '100%', padding: '1em' }}
                    >
                      <AccountForm
                        account={account}
                        onSave={async (account) => {
                          const resp = await POST_FORM(
                            '/admin/account/update',
                            toJS(account)
                          );
                          if (resp.data.state === 'ok') {
                            Object.assign(original, toJS(account));
                            message.success('更新成功');
                          } else {
                            message.error('更新失败');
                          }
                          hide();
                        }}
                      />
                    </div>
                  );
                }
                const hide = Modal.show(
                  <UpdateAccount account={original} />,
                  '480px',
                  '80%'
                );
              }}
            >
              U
            </Button>
          </Tooltip>
          <Popover
            content={
              <Observer>
                {() => (
                  <div className={'LockSwitch'}>
                    <Switch
                      checkedChildren={<Icon type="lock" />}
                      unCheckedChildren={<Icon type="check" />}
                      defaultChecked={Account.STATUS.isLock(original)}
                      onChange={async (lock) => {
                        if (lock && !Account.STATUS.isLock(original)) {
                          const resp = await POST_FORM('/admin/account/lock', {
                            id: original.id
                          });
                          const ret = resp.data;
                          if (ret.state === 'ok') {
                            original.status = BitKit.set(original.status, 0, 1);
                          } else {
                            message.error(ret.msg);
                          }
                        } else if (!lock && Account.STATUS.isLock(original)) {
                          const resp = await POST_FORM(
                            '/admin/account/unlock',
                            {
                              id: original.id
                            }
                          );
                          const ret = resp.data;
                          if (ret.state === 'ok') {
                            original.status = BitKit.set(original.status, 0, 0);
                          } else {
                            message.error(ret.msg);
                          }
                        }
                      }}
                    />
                  </div>
                )}
              </Observer>
            }
            trigger="click"
            placement="bottom"
          >
            <Tooltip placement="top" title={'锁定'}>
              <Button size={'small'} onClick={() => {}}>
                L
              </Button>
            </Tooltip>
          </Popover>
          <Tooltip placement="top" title={'分配角色'}>
            <Button
              size={'small'}
              onClick={async () => {
                Modal.show(<PatchRoles account={original} />, '480px', '80%');
              }}
            >
              R
            </Button>
          </Tooltip>
        </ButtonGroup>
      );
    }
  },
  {
    Header: 'id',
    accessor: 'id',
    Cell: TextCell
  },
  {
    Header: '昵称',
    accessor: 'nickName',
    Cell: TextCell
  },
  {
    Header: '邮箱',
    accessor: 'email',
    Cell: TextCell
  },
  {
    Header: '手机',
    accessor: 'phone',
    Cell: OptionalCell
  },
  {
    Header: '头像',
    accessor: 'avatar',
    Cell: TextCell
  },
  {
    Header: '真名',
    accessor: 'realName',
    Cell: OptionalCell
  },
  {
    Header: '身份证号',
    accessor: 'identityNumber',
    Cell: OptionalCell
  },
  {
    Header: '年龄',
    accessor: 'age',
    Cell: OptionalCell
  },
  {
    Header: '公司',
    accessor: 'company',
    Cell: OptionalCell
  },
  {
    Header: '职位',
    accessor: 'position',
    Cell: OptionalCell
  },
  {
    Header: '个人简介',
    accessor: 'personalProfile',
    Cell: OptionalCell
  },
  {
    Header: '性别',
    accessor: 'sex',
    Cell: OptionalCell
  },
  {
    Header: '生日',
    accessor: 'birthday',
    Cell: OptionalTimeCell
  },
  {
    Header: '学位',
    accessor: 'education',
    Cell: OptionalCell
  },
  {
    Header: '专业',
    accessor: 'profession',
    Cell: OptionalCell
  },
  {
    Header: '创建时间',
    accessor: 'createAt',
    Cell: TimeCell
  },
  {
    Header: '状态',
    accessor: 'status',
    Cell: OptionalCell
  }
];

const PatchRoles = observer(({ account }: { account: IAccount }) => {
  const checkingMap = useObservable(new Map<string, boolean>());
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '1em'
      }}
    >
      <table className="table table-bordered table-hover ">
        <thead />
        <tbody>
          <tr>
            <td
              style={{
                width: '100px',
                textAlign: 'center'
              }}
            >
              <Switch
                checked={Account.STATUS.isLearner(account)}
                onChange={async (checked) => {
                  checkingMap.set('learner', true);
                  let status = account.status;
                  if (checked) {
                    status = BitKit.set(account.status, 1, 1);
                  } else {
                    status = BitKit.set(account.status, 1, 0);
                  }
                  const resp = await POST_FORM('/admin/account/updateStatus', {
                    accountId: account.id,
                    status
                  });
                  const ret = resp.data;
                  if (ret.state === 'ok') {
                    account.status = status;
                  } else {
                    message.error(ret.msg);
                  }
                  checkingMap.set('learner', false);
                }}
                loading={!!checkingMap.get('learner')}
              />
            </td>
            <td>学习者</td>
          </tr>
          <tr>
            <td
              style={{
                width: '100px',
                textAlign: 'center'
              }}
            >
              <Switch
                checked={Account.STATUS.isTeacher(account)}
                onChange={async (checked) => {
                  checkingMap.set('teacher', true);
                  let status = account.status;
                  if (checked) {
                    status = BitKit.set(account.status, 2, 1);
                  } else {
                    status = BitKit.set(account.status, 2, 0);
                  }
                  const resp = await POST_FORM('/admin/account/updateStatus', {
                    accountId: account.id,
                    status
                  });
                  const ret = resp.data;
                  if (ret.state === 'ok') {
                    account.status = status;
                  } else {
                    message.error(ret.msg);
                  }
                  checkingMap.set('teacher', false);
                }}
                loading={!!checkingMap.get('teacher')}
              />
            </td>
            <td>课程作者</td>
          </tr>
          <tr>
            <td
              style={{
                width: '100px',
                textAlign: 'center'
              }}
            >
              <Switch
                checked={Account.STATUS.isManager(account)}
                onChange={async (checked) => {
                  checkingMap.set('manager', true);
                  let status = account.status;
                  if (checked) {
                    status = BitKit.set(account.status, 3, 1);
                  } else {
                    status = BitKit.set(account.status, 3, 0);
                  }
                  const resp = await POST_FORM('/admin/account/updateStatus', {
                    accountId: account.id,
                    status
                  });
                  const ret = resp.data;
                  if (ret.state === 'ok') {
                    account.status = status;
                  } else {
                    message.error(ret.msg);
                  }
                  checkingMap.set('manager', false);
                }}
                loading={!!checkingMap.get('manager')}
              />
            </td>
            <td>管理员</td>
          </tr>
        </tbody>
      </table>
      <table className="table table-bordered table-hover ">
        <thead />
        <tbody>
          <StoreContext.Consumer>
            {(store) => (
              <Observer>
                {() => (
                  <React.Fragment>
                    {store.roles.map((role) => (
                      <tr key={role.id}>
                        <td
                          style={{
                            width: '100px',
                            textAlign: 'center'
                          }}
                        >
                          <Switch
                            checked={
                              store.accountRoles.findIndex(
                                (ar) =>
                                  ar.accountId === account.id &&
                                  ar.roleId === role.id
                              ) !== -1
                            }
                            onChange={async (checked) => {
                              checkingMap.set(role.id.toString(), true);
                              try {
                                if (checked) {
                                  const ar = await AccountRole.addRole(
                                    account.id,
                                    role.id
                                  );
                                  store.accountRoles.push(ar);
                                } else {
                                  await AccountRole.deleteRole(
                                    account.id,
                                    role.id
                                  );
                                  const i = store.accountRoles.findIndex(
                                    (ar) =>
                                      ar.accountId === account.id &&
                                      ar.roleId === role.id
                                  );
                                  if (i !== -1) {
                                    store.accountRoles.splice(i, 1);
                                  }
                                }
                              } catch (err) {
                                message.error(err);
                              }
                              checkingMap.set(role.id.toString(), false);
                            }}
                            loading={!!checkingMap.get(role.id.toString())}
                          />
                        </td>
                        <td>{role.name}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                )}
              </Observer>
            )}
          </StoreContext.Consumer>
        </tbody>
      </table>
    </div>
  );
});
