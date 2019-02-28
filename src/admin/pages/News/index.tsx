import { StoreContext } from '@/admin/store';
import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useContext, useCallback } from 'react';
import 'react-table/react-table.css';
import './index.scss';
import ArticlePage from '../Column/pages/ArticlePage';
import { Button, message } from 'antd';
import Modal from '@/common/components/Modal';
import ArticleForm from '@/admin/components/forms/ArticleForm';
import ArticleAdmin from '@/admin/models/ArticleAdmin';

const News: FunctionComponent = observer(({ children }) => {
  const store = useContext(StoreContext);

  const create = useCallback(async () => {
    const hide=Modal.show(
      <div style={{ padding: '1em' }}>
        <ArticleForm
          article={new ArticleAdmin()}
          onSubmit={async (values) => {
            try {
              const article = await ArticleAdmin.create(
                values.title,
                '',
                values.content,
                -1,
                values.audioId,
                "/admin/news/create"
              );
              store.articles.unshift(article); 
              hide();
            } catch (err) {
              message.error(err);
              console.error(err);
            }
          }}
        />
      </div>,
      '80vw'
    );
  }, []);

  return (
    <div className={'News'}>
      <div className={'Actions'}>
        <Button onClick={create}>创建新闻</Button>
      </div>
      <ArticlePage params={{ id: '-1' }} />
    </div>
  );
});

export default News;
