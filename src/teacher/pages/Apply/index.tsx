import React, { useEffect, useMemo, useState, useRef } from 'react';
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
import {
  Application,
  ApplicationStatus,
  ApplicationAPI
} from '@/common/models/application';
import Editor from 'for-editor';
import { ApplicationCategory } from '@/common/models/application';
import BraftEditor from 'braft-editor';
import { EditorState } from 'braft-editor';
import RichEditor from '@/common/components/RichEditor';

interface Props {
  me: Account;
}

function Apply({ me }: Props) {
  useTitle('申请 | 默识 - 作者端');
  
  const [ rawContent, setRawContent ] = useState<EditorState>(
    BraftEditor.createEditorState(null)
  );
  const richEditor = useRef<BraftEditor>(null);
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
      const applications = await ApplicationAPI.my(
        ApplicationCategory.CATEGORY_TEACHER
      );
      const items = await select<{ key: string; value: string }>(
        '/select',
        'select `key`, `value` from preset_text_l where `key` = ? or `key` = ?',
        'teacher/application/description',
        'teacher/application/template'
      );
      const description = items.find(
        (item) => item.key === 'teacher/application/description'
      )!.value;
      const template = items.find(
        (item) => item.key === 'teacher/application/template'
      )!.value;
      if (applications.length > 0) {
        setApplication(applications[0]);        
        const ap: Application = applications[0];      
        setRawContent(BraftEditor.createEditorState(ap.content)); 
        if (ap.status === ApplicationStatus.STATUS_COMMIT) {
          setDisabled(true);
        } else if (ap.status === ApplicationStatus.STATUS_SUCCESS) {
          setDisabled(true);
        } else if (ap.status === ApplicationStatus.STATUS_FAIL) {
          setDisabled(false);
        }
      } else {
        setApplication({ ...application, content: template });
        setRawContent(BraftEditor.createEditorState(template)); 
      }
      setApplicationLoading(false);
      setDescription((description));
      setDescriptionLoading(false);
    })();
  }, []);

  let alert = null;
  if (
    application.id !== 0 &&
    application.status === ApplicationStatus.STATUS_COMMIT
  ) {
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
              <div>
                {alert}
                <Input
                  value={application.title}
                  onInput={(e: any) =>
                    setApplication({ ...application, title: e.target.value })}
                  disabled
                  style={{ marginBottom: '1em' }}
                />
                <div>
                  <RichEditor
                    value={rawContent}
                    onChange={(x) => setRawContent(x)}
                    editorRef={richEditor}     
                  />
                </div>
                {/* <Editor
                value={application.content}
                onChange={(value) =>
                  setApplication({ ...application, content: value })}
                onSave={(value) =>
                  setApplication({ ...application, content: value })}
                height=""
              /> */}
                <Button
                  style={{ marginTop: '1em' }}
                  onClick={async () => {
                    const ret = await ApplicationAPI.commit(
                      application.id,
                      application.title,
                      rawContent.toHTML(),
                      ApplicationCategory.CATEGORY_TEACHER
                    );
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
              </div>
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
