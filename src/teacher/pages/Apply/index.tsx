import React, { useEffect, useMemo, useState } from 'react';
import './index.scss';
import Layout from '@/teacher/layouts/Layout';
import useTitle from '@/common/hooks/useTitle';
import { packToClassComponent, markdownToHtml } from '@/common/kit/functions';
import { GET, Ret, select } from '@/common/kit/req';
import { Account } from '@/common/models/account';
import { connect } from 'react-redux';
import { State } from '@/teacher/store/state_type';
import { Skeleton, Input, Alert, Button, message } from 'antd';
import Panel from '@/common/components/Panel';
import 'github-markdown-css/github-markdown.css';
import { Application, ApplicationStatus, commit } from '@/common/models/application';
import Editor from 'for-editor';

interface Props {
  me: Account;
}

function Apply({ me }: Props) {
  useTitle('申请 | 默识 - 作者端');
  const [ application, setApplication ] = useState<Application>(({
    id: 0,
    accountId: me.id,
    category: 0,
    title: `${me.nickName} 申请成为课程作者`,
    content: '',
    createAt: 0,
    status: ApplicationStatus.STATUS_COMMIT
  } as Partial<Application>) as Application);
  const [ applicationLoading, setApplicationLoading ] = useState(true);
  const [ descriptionLoading, setDescriptionLoading ] = useState(true);
  const [ description, setDescription ] = useState('');
  const [ disabled, setDisabled ] = useState(false);
  useEffect(() => {
    (async () => {
      const resp = await GET<Ret>('/apply/my');
      const ret = resp.data;
      const items = await select<{ key: string; value: string }>(
        '/select',
        'select `key`, `value` from preset_text_l where `key` = ? or `key` = ?',
        'teacher/application/description',
        'teacher/application/template'
      );
      const description = items.find((item) => item.key === 'teacher/application/description')!
        .value;
      const template = items.find((item) => item.key === 'teacher/application/template')!.value;
      if (ret.state === 'ok') {
        setApplication(ret.application);
        const ap: Application = ret.application;
        if (ap.status === ApplicationStatus.STATUS_COMMIT) {
          setDisabled(true);
        } else if (ap.status === ApplicationStatus.STATUS_SUCCESS) {
          setDisabled(true);
        } else if (ap.status === ApplicationStatus.STATUS_FAIL) {
          setDisabled(false);
        }
      } else {
        setApplication({ ...application, content: template });
      }
      setApplicationLoading(false);
      setDescription(await markdownToHtml(description));
      setDescriptionLoading(false);
    })();
  }, []);

  let alert = null;
  if (application.id !== 0 && application.status === ApplicationStatus.STATUS_COMMIT) {
    alert = (
      <Alert
        style={{ marginBottom: '1em' }}
        message="申请已提交"
        description="您的申请正在审核中，请耐心等待，后续通知将通过注册邮箱发送。"
        type="info"
      />
    );
  } else if (application.status === ApplicationStatus.STATUS_SUCCESS) {
    alert = (
      <Alert
        style={{ marginBottom: '1em' }}
        message="申请已通过"
        description="您的申请已通过！"
        type="success"
      />
    );
  } else if (application.status === ApplicationStatus.STATUS_FAIL) {
    alert = (
      <Alert
        style={{ marginBottom: '1em' }}
        message="申请未通过"
        description={'您的申请未通过：' + application.reply}
        type="error"
      />
    );
  }

  return (
    <Layout>
      <div className="Apply">
        {applicationLoading ? (
          <Skeleton active />
        ) : (
          <div>
            <Panel>
              {alert}
              <Input
                value={application.title}
                onInput={(e: any) => setApplication({ ...application, title: e.target.value })}
                disabled
                style={{ marginBottom: '1em' }}
              />
              <Editor
                value={application.content}
                onChange={(value) => setApplication({ ...application, content: value })}
                onSave={(value) => setApplication({ ...application, content: value })}
                height=""
              />
              <Button
                style={{ marginTop: '1em' }}
                onClick={async () => {
                  const ret = await commit(application.id, application.title, application.content);
                  if (ret.state === 'ok') {
                    message.success('提交成功');
                    setDisabled(true);
                  } else {
                    message.error(ret.msg);
                  }
                }}
                type={'primary'}
                disabled={disabled}
              >
                {application.id === 0 ? '提交申请' : '提交修改'}
              </Button>
            </Panel>
            <Panel style={{ marginLeft: '0' }}>
              {descriptionLoading ? (
                <Skeleton active />
              ) : (
                <div
                  className={'markdown-body'}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}
            </Panel>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default connect((state: State) => ({ me: state.me! }))(Apply);
