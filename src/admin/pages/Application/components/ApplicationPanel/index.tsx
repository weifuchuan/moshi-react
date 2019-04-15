import React, { useState, useEffect } from 'react';
import { observer, useObservable } from 'mobx-react-lite';
import ApplicationAdmin, {
  IApplicationAdmin
} from '@/admin/models/ApplicationAdmin';
import Panel from '@/common/components/Panel';
import { formatTime } from '@/common/kit/functions/moments';
import markdownToHtml from '@/common/kit/functions/markdownToHtml';
import Application from '@/common/models/Application';
import { Alert } from 'antd';
import './index.less';

interface Props {
  application: IApplicationAdmin;
}

const ApplicationPanel = ({ application }: Props) => {
  const [ content, setContent ] = useState(application.content); 

  useEffect(() => {
    if (application.contentType === 'html') {
      setContent(application.content);
    } else {
      markdownToHtml(application.content).then((html) => setContent(html));
    }
  }, []);

  let note = null;
  if (application.status === Application.STATUS.COMMIT) {
    note = <Alert style={{ margin: '1em' }} message="审核中" type="info" />;
  } else if (application.status === Application.STATUS.PASSED) {
    note = (
      <Alert
        style={{ margin: '1em' }}
        message="已通过"
        description={application.reply}
        type="success"
      />
    );
  } else if (application.status === Application.STATUS.FAIL) {
    note = (
      <Alert
        style={{ margin: '1em' }}
        message="未通过"
        description={application.reply}
        type="error"
      />
    );
  }

  return (
    <div className={'ApplicationPanel'}>
      {note}
      <Panel>
        <span>{application.title}</span>
      </Panel>
      <Panel>
        <span>
          申请人：{application.nickName}；申请时间：{formatTime(application.createAt)}
        </span>
      </Panel>
      <Panel>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </Panel>
    </div>
  );
};

export default ApplicationPanel;
