import React, { FunctionComponent, useContext, useEffect } from 'react';
import './index.scss';
import { observer } from 'mobx-react-lite';
import { StoreContext, StoreContextObserver } from '@/admin/store';
import ReactTable, { Column } from 'react-table';
import ArticleAdmin from '@/admin/models/ArticleAdmin';
import { TimeCell, OptionalTimeCell, TextCell } from '@/common/components/tables';
import ButtonGroup from 'antd/lib/button/button-group';
import { Tooltip, Button } from 'antd';
import Modal from '@/common/components/Modal';
import ArticlePanel from '@/common/components/ArticlePanel';

interface Props {
  params: {
    id: string;
  };
}

const SectionCourse: FunctionComponent<Props> = ({ children, params }) => {
  const id = Number.parseInt(params.id);

  const store = useContext(StoreContext);

  const articles = store.articles.filter((a) => a.courseId === id);

  useEffect(() => {
    store.fetchArticle(id);
  }, []);

  return (
    <div className={'SectionCourse'}>
      <ReactTable data={articles} columns={columns} defaultPageSize={10} />
    </div>
  );
};

export default observer(SectionCourse);

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
    Cell: ({ original }) => {
      const article: ArticleAdmin = original;
      if (ArticleAdmin.STATUS.isLock(article)) {
        return <span>已锁定</span>;
      } else if (ArticleAdmin.STATUS.isPublish(article)) {
        return <span>已发布</span>;
      } else if (ArticleAdmin.STATUS.isInit(article)) {
        return <span>编辑中</span>;
      }
    }
  },
  {
    Header: '标题',
    accessor: 'title',
    Cell:TextCell
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
    Cell:TextCell
  }
];
