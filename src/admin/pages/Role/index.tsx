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
import './index.less';

const ButtonGroup = Button.Group;

const Role: FunctionComponent = ({ children }) => {
  const store = useContext(StoreContext);

  useEffect(() => {
    store.fetchAllPermissionAndRoleData();
  }, []);

  const roles = store.roles;

  return (
    <div className={'Role'}>
      <div className={'Actions'}>
        <Button>创建角色</Button>
      </div>
      <ReactTable columns={columns} data={roles.slice()} defaultPageSize={10} />
    </div>
  );
};

export default observer(Role);

const columns: Column<IRole>[] = [
  {
    Header: '操作',
    // accessor: 'id',
    Cell: ({ value, original }) => {
      const role: RoleModel = original;
      return (
        <StoreContext.Consumer>
          {(store) => (
            <Observer>
              {() => (
                <ButtonGroup>
                  <Popover
                    content={
                      <Observer>
                        {() => {
                          const [ name, setName ] = useState<string>(role.name);
                          return (
                            <div>
                              <Input
                                defaultValue={role.name}
                                onChange={(e) => setName(e.target.value)}
                              />
                              <Button
                                onClick={async () => {
                                  try {
                                    await role.update(name);
                                    message.success('更新成功');
                                  } catch (err) {
                                    message.error(err);
                                  }
                                }}
                                disabled={!!!name.trim().length}
                              >
                                更新
                              </Button>
                            </div>
                          );
                        }}
                      </Observer>
                    }
                    trigger="click"
                    placement="bottom"
                  >
                    <Tooltip placement="top" title={'更新'}>
                      <Button size={'small'}>U</Button>
                    </Tooltip>
                  </Popover>
                  <Popconfirm
                    title="Are you sure delete this role?"
                    onConfirm={async () => {
                      try {
                        await role.delete();
                        const i = store.roles.findIndex(
                          (r) => r.id === role.id
                        );
                        if (i !== -1) store.roles.splice(i, 1);
                      } catch (err) {
                        message.error(err);
                      }
                    }}
                    onCancel={() => {}}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Tooltip placement="top" title={'删除'}>
                      <Button size={'small'}>D</Button>
                    </Tooltip>
                  </Popconfirm>
                  <Tooltip placement="top" title={'分配权限'}>
                    <Button
                      size={'small'}
                      onClick={async () => {
                        const groups = _.groupBy(
                          store.permissions,
                          (p) => p.controller
                        );
                        const cps: { ctl: string; ps: Permission[] }[] = [];
                        for (let ctl in groups) {
                          const ps = groups[ctl];
                          cps.push({ ctl, ps });
                        }
                        const PatchPermissions = observer(
                          ({ role }: { role: IRole }) => {
                            const checkingMap = observable.map({});
                            return (
                              <div
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  padding: '1em'
                                }}
                              >
                                {cps.map((cp) => {
                                  return (
                                    <table key={cp.ctl} className="table table-bordered table-hover">
                                      <thead>
                                        <tr>
                                          <th {...({ colSpan: "3" } as any)}>{cp.ctl}</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {cp.ps.map((p) => {
                                          return (
                                            <tr key={p.id} >
                                              <td
                                                style={{
                                                  width: '60px',
                                                  textAlign: 'center'
                                                }}
                                              >
                                                <Switch
                                                  checked={
                                                    store.rolePermissions.findIndex(
                                                      (rp) =>
                                                        rp.roleId === role.id &&
                                                        rp.permissionId === p.id
                                                    ) !== -1
                                                  }
                                                  onChange={async (checked) => {
                                                    checkingMap.set(
                                                      p.id.toString(),
                                                      true
                                                    );
                                                    try {
                                                      if (checked) {
                                                        const rp = await RolePermission.addPermission(
                                                          p.id,
                                                          role.id
                                                        );
                                                        store.rolePermissions.push(
                                                          rp
                                                        );
                                                      } else {
                                                        await RolePermission.deletePermission(
                                                          p.id,
                                                          role.id
                                                        );
                                                        const i = store.rolePermissions.findIndex(
                                                          (rp) =>
                                                            rp.roleId ===
                                                              role.id &&
                                                            rp.permissionId ===
                                                              p.id
                                                        );
                                                        if (i !== -1) {
                                                          store.rolePermissions.splice(
                                                            i,
                                                            1
                                                          );
                                                        }
                                                      }
                                                    } catch (err) {
                                                      message.error(err);
                                                    }
                                                    checkingMap.set(
                                                      p.id.toString(),
                                                      false
                                                    );
                                                  }}
                                                  loading={
                                                    !!checkingMap.get(
                                                      p.id.toString()
                                                    )
                                                  }
                                                />
                                              </td>
                                              <td style={{ width: '240px' }}>
                                                {p.actionKey}
                                              </td>
                                              <td>{p.remark}</td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  );
                                })}
                              </div>
                            );
                          }
                        );
                        Modal.show(
                          <PatchPermissions role={role} />,
                          '640px',
                          '80%'
                        );
                      }}
                    >
                      R
                    </Button>
                  </Tooltip>
                </ButtonGroup>
              )}
            </Observer>
          )}
        </StoreContext.Consumer>
      );
    }
  },
  {
    Header: 'id',
    accessor: 'id'
  },
  {
    Header: '名称',
    accessor: 'name',
    Cell:TextCell
  },
  {
    Header: '创建时间',
    accessor: 'createAt',
    Cell: TimeCell
  }
];
