import ApplicationAdmin from '@/admin/models/ApplicationAdmin';
import { StoreContext } from '@/admin/store';
import DefaultAvatar from '@/common/components/DefaultAvatar';
import Modal from '@/common/components/Modal';
import { formatTime } from '@/common/kit/functions/moments';
import { Button, Input, List, message } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import ApplicationPanel from '../../components/ApplicationPanel';
import './index.scss';

const Unpassed: FunctionComponent = ({ children }) => {
  const store = useContext(StoreContext);

  useEffect(() => {
    store.fetchUnpassedApplication();
  }, []);

  const apps = store.unpassedApplications;

  return (
    <React.Fragment>
      <List
        renderItem={(app: ApplicationAdmin) => {
          return (
            <List.Item
              actions={[
                <a
                  onClick={() => {
                    const hideObj: any = {};
                    hideObj.hide = Modal.show(
                      <Reply
                        onOk={async (reply) => {
                          try {
                            await app.pass(reply);
                            const i = store.unpassedApplications.findIndex(
                              (a) => a.id === app.id
                            );
                            if (i !== -1) {
                              store.unpassedApplications.splice(i, 1);
                              store.passedApplications.unshift(app);
                            }
                            hideObj.hide();
                          } catch (error) {
                            message.error(error);
                          }
                        }}
                        onCancel={() => {
                          hideObj.hide();
                        }}
                      />,
                      '480px',
                      'auto'
                    );
                  }}
                >
                  通过
                </a>,
                <a
                  onClick={() => {
                    const hideObj: any = {};
                    hideObj.hide = Modal.show(
                      <Reply
                        onOk={async (reply) => {
                          try {
                            await app.reject(reply);
                            const i = store.unpassedApplications.findIndex(
                              (a) => a.id === app.id
                            );
                            if (i !== -1) {
                              store.unpassedApplications.splice(i, 1);
                              store.failApplications.unshift(app);
                            }
                            hideObj.hide();
                          } catch (error) {
                            message.error(error);
                          }
                        }}
                        onCancel={() => {
                          hideObj.hide();
                        }}
                      />,
                      '480px',
                      'auto'
                    );
                  }}
                >
                  拒绝
                </a>
              ]}
            >
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

export default observer(Unpassed);

function Reply({
  onOk,
  onCancel
}: {
  onOk: (reply: string) => void;
  onCancel: () => void;
}) {
  const [ reply, setReply ] = useState('');

  return (
    <div style={{ padding: '1em' }}>
      <Input.TextArea
        autosize={{ minRows: 10 }}
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      />
      <div style={{ marginTop: '1em' }}>
        <Button type={'primary'} onClick={() => onOk(reply)}>
          确定
        </Button>
        <Button style={{ marginLeft: '1em' }} onClick={onCancel}>
          取消
        </Button>
      </div>
    </div>
  );
}
