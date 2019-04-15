import ApplicationAdmin from '@/admin/models/ApplicationAdmin';
import { StoreContext } from '@/admin/store';
import DefaultAvatar from '@/common/components/DefaultAvatar';
import Modal from '@/common/components/Modal';
import { formatTime } from '@/common/kit/functions/moments';
import { List } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useContext, useEffect } from 'react';
import ApplicationPanel from '../../components/ApplicationPanel';
import './index.less';

const Success: FunctionComponent = ({ children }) => {
  const store = useContext(StoreContext);

  useEffect(() => {
    store.fetchPassedApplication();
  }, []);

  const apps = store.passedApplications;

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

export default observer(Success); 