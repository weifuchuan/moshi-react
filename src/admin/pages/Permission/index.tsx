import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from 'react';
import './index.scss';
import { TimeCell, OptionalCell, TextCell } from '@/common/components/tables';
import {
  IPermission,
  Permission as PermissionModel
} from '@/common/models/admin';
import ReactTable, { Column } from 'react-table';
import { StoreContext } from '@/admin/store';
import { observer, useObservable, Observer } from 'mobx-react-lite';
import { Button, message, Popover, Input, Tooltip, Popconfirm } from 'antd';
import 'react-table/react-table.css';

const ButtonGroup = Button.Group;

const Permission: FunctionComponent = ({ children }) => {
  const store = useContext(StoreContext);

  useEffect(() => {
    store.fetchAllPermissionAndRoleData();
  }, []);

  const permissions = store.permissions;

  const syncing = useObservable({ value: false });

  /**
   * Callbacks
   */
  const sync = async () => {
    syncing.value = true;
    try {
      const msg = await store.syncPermission();
      message.success(msg);
    } catch (msg) {
      message.error(msg);
    }
    syncing.value = false;
  };

  return (
    <div className={'Permission'}>
      <div className={'Actions'}>
        <Button icon={'sync'} loading={syncing.value} onClick={sync}>
          一键同步
        </Button>
      </div>
      <ReactTable
        columns={columns}
        data={permissions.slice()}
        defaultPageSize={10}
      />
    </div>
  );
};

export default observer(Permission);

const columns: Column<IPermission>[] = [
  {
    Header: '操作',
    accessor: 'id',
    Cell: ({ value, original }) => {
      const p: PermissionModel = original;
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
                          const [ remark, setRemark ] = useState<string>(
                            p.remark || ''
                          );
                          return (
                            <div>
                              <Input
                                defaultValue={remark}
                                onChange={(e) => setRemark(e.target.value)}
                              />
                              <Button
                                onClick={async () => {
                                  try {
                                    await p.update(remark);
                                    message.success('更新成功');
                                  } catch (err) {
                                    message.error(err);
                                  }
                                }}
                                disabled={!!!remark.trim().length}
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
                    title="Are you sure delete this permission?"
                    onConfirm={async () => {
                      try {
                        await p.delete();
                        const i = store.permissions.findIndex(
                          (r) => r.id === p.id
                        );
                        if (i !== -1) store.permissions.splice(i, 1);
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
                  </Popconfirm>{' '}
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
    accessor: 'id',
    Cell:TextCell
  },
  {
    Header: 'actionKey',
    accessor: 'actionKey',
    Cell:TextCell
  },
  {
    Header: 'controller',
    accessor: 'controller',
    Cell:TextCell
  },
  {
    Header: '备注',
    accessor: 'remark',
    Cell: OptionalCell
  }
];
