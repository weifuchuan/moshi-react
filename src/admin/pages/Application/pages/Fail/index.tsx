import ApplicationAdmin from '@/admin/models/ApplicationAdmin';
import { StoreContext } from '@/admin/store';
import DefaultAvatar from '@/common/components/DefaultAvatar';
import Modal from '@/common/components/Modal';
import { formatTime } from '@/common/kit/functions/moments';
import { Button, Input, List, message } from 'antd';
import { observer } from 'mobx-react-lite';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from 'react';
import ApplicationPanel from '../../components/ApplicationPanel';
import './index.less';

const Fail: FunctionComponent = ({ children }) => {
  const store = useContext(StoreContext);

  useEffect(() => {
    store.fetchFailApplication();
  }, []);

  const apps = store.failApplications;

  return (
    <React.Fragment>
      <List
        renderItem={(app: ApplicationAdmin) => {
          return (
            <List.Item actions={[]}>
              <List.Item.Meta
                avatar={<DefaultAvatar avatar={app.avatar} />}
                title={
                  <a
                    onClick={() => {
                      Modal.show(
                        <ApplicationPanel application={app} />,
                        '80vw',
                        '90vh'
                      );
                    }}
                  >
                    {app.title}
                  </a>
                }
                description={`${app.nickName} ${formatTime(app.createAt)}`}
              />
            </List.Item>
          );
        }}
        dataSource={apps.slice()}
      />
    </React.Fragment>
  );
};

export default observer(Fail); 