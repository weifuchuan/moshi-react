import React, { FunctionComponent, useContext, useEffect } from 'react';
import './index.less';
import { observer, Observer } from 'mobx-react-lite';
import { StoreContext, StoreContextObserver } from '@/admin/store';
import ReactTable, { Column } from 'react-table';
import ArticleAdmin from '@/admin/models/ArticleAdmin';
import {
  TimeCell,
  OptionalTimeCell,
  TextCell,
  buildObserverCell
} from '@/common/components/tables';
import ButtonGroup from 'antd/lib/button/button-group';
import { Tooltip, Button, message, Switch } from 'antd';
import Modal from '@/common/components/Modal';
import ArticlePanel from '@/common/components/ArticlePanel';
import { POST_FORM } from '@/common/kit/req';
import BitKit from '@/common/kit/BitKit';
import { observable } from 'mobx';

interface Props {
  params: {
    id: string;
  };
}

const ArticlePage: FunctionComponent<Props> = ({ children, params }) => {
  const id =  Number.parseInt(params.id) 

  const store = useContext(StoreContext);

  const articles = store.articles.filter((a) => a.courseId === id);

  useEffect(() => {
    store.fetchArticle(id);
  }, []);

  return (
    <div className={'ArticlePage'}>
      <ReactTable data={articles} columns={columns} defaultPageSize={10} />
    </div>
  );
};

export default observer(ArticlePage);

const columns: Column<ArticleAdmin>[] = [
  {
    Header: '操作',
    Cell: ({ original }) => {
      const article: ArticleAdmin = original;
      return (
        <StoreContextObserver
          buildChildren={(store) => (
            <ButtonGroup>
              <Tooltip placement="top" title={'查看'}>
                <Button
                  size={'small'}
                  onClick={() => {
                    Modal.show(
                      <div style={{ padding: '1em' }}>
                        <ArticlePanel article={article} />
                      </div>,
                      '640px',
                      '90vh'
                    );
                  }}
                >
                  V
                </Button>
              </Tooltip>
              <Tooltip placement="top" title={'更新状态'}>
                <Button
                  size={'small'}
                  onClick={() => {
                    const updateStatus = async (
                      updater: (status: number) => number
                    ) => {
                      const status = updater(article.status);
                      const resp = await POST_FORM(
                        '/admin/article/updateStatus',
                        { id: article.id, status }
                      );
                      const ret = resp.data;
                      if (ret.state === 'ok') {
                        article.status = status;
                        return true;
                      } else {
                        message.error(ret.msg);
                        return false;
                      }
                    };
                    const checkingMap = observable(new Map<string, boolean>());
                    Modal.show(
                      <Observer>
                        {() => (
                          <div style={{ padding: '1em' }}>
                            <table className="table table-bordered table-hover">
                              <tbody>
                                <tr>
                                  <td
                                    style={{
                                      width: '60px',
                                      textAlign: 'center'
                                    }}
                                  >
                                    <Switch
                                      checked={ArticleAdmin.STATUS.isLock(
                                        article
                                      )}
                                      onChange={async (checked) => {
                                        checkingMap.set('lock', true);
                                        await updateStatus((status) => {
                                          if (checked) {
                                            return BitKit.set(status, 0, 1);
                                          } else {
                                            return BitKit.set(status, 0, 0);
                                          }
                                        });
                                        checkingMap.set('lock', false);
                                      }}
                                      loading={!!checkingMap.get('lock')}
                                    />
                                  </td>
                                  <td style={{ width: '240px' }}>锁定</td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      width: '60px',
                                      textAlign: 'center'
                                    }}
                                  >
                                    <Switch
                                      checked={ArticleAdmin.STATUS.isPublish(
                                        article
                                      )}
                                      onChange={async (checked) => {
                                        checkingMap.set('publish', true);
                                        await updateStatus((status) => {
                                          if (checked) {
                                            return BitKit.set(status, 1, 1);
                                          } else {
                                            return BitKit.set(status, 1, 0);
                                          }
                                        });
                                        checkingMap.set('publish', false);
                                      }}
                                      loading={!!checkingMap.get('publish')}
                                    />
                                  </td>
                                  <td style={{ width: '240px' }}>发布</td>
                                </tr>
                                <tr>
                                  <td
                                    style={{
                                      width: '60px',
                                      textAlign: 'center'
                                    }}
                                  >
                                    <Switch
                                      checked={ArticleAdmin.STATUS.isOpen(
                                        article
                                      )}
                                      onChange={async (checked) => {
                                        checkingMap.set('open', true);
                                        await updateStatus((status) => {
                                          if (checked) {
                                            return BitKit.set(status, 2, 1);
                                          } else {
                                            return BitKit.set(status, 2, 0);
                                          }
                                        });
                                        checkingMap.set('open', false);
                                      }}
                                      loading={!!checkingMap.get('open')}
                                    />
                                  </td>
                                  <td style={{ width: '240px' }}>开放试读</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </Observer>,
                      '640px',
                      '90vh'
                    );
                  }}
                >
                  U
                </Button>
              </Tooltip>
            </ButtonGroup>
          )}
        />
      );
    }
  },
  {
    Header: 'id',
    accessor: 'id'
  },
  {
    Header: '状态',
    accessor: 'status',
    Cell: buildObserverCell(({ original }) => {
      const article: ArticleAdmin = original;
      if (ArticleAdmin.STATUS.isLock(article)) {
        return <span>已锁定</span>;
      } else if (ArticleAdmin.STATUS.isOpen(article)) {
        return <span>开放试读</span>;
      } else if (ArticleAdmin.STATUS.isPublish(article)) {
        return <span>已发布</span>;
      } else if (ArticleAdmin.STATUS.isInit(article)) {
        return <span>编辑中</span>;
      }
      return <span />;
    })
  },
  {
    Header: '标题',
    accessor: 'title',
    Cell: TextCell
  },
  {
    Header: '创建时间',
    accessor: 'createAt',
    Cell: TimeCell
  },
  {
    Header: '发布时间',
    accessor: 'publishAt',
    Cell: OptionalTimeCell
  },
  {
    Header: '内容类型',
    accessor: 'contentType',
    Cell: TextCell
  }
];
