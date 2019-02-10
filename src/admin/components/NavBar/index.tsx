import React, { useEffect, useState } from 'react';
import './index.scss';
import { Button, Popover, Breadcrumb } from 'antd';
import { GET } from '@/common/kit/req';
import { Control, Link } from 'react-keeper';
import DefaultAvatar from '@/common/components/DefaultAvatar';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { StoreContext } from '@/admin/store';
import { useObservable } from 'rxjs-hooks';
import { interval } from 'rxjs';
import { routes } from '@/admin/router.config';
import BreadcrumbItem from 'antd/lib/breadcrumb/BreadcrumbItem';

interface Props {
  toLogin: () => void;
  toReg: () => void;
}

function NavBar({ toLogin, toReg }: Props) {
  const store = useContext(StoreContext);
  const me = store.me;

  let [ breadcrumb, setBreadcrumb ] = useState<JSX.Element>(<Breadcrumb />);

  const f = () => {
    const paths = Control.path.slice(1).split('/').filter((x) => !!x);
    let rs = routes;
    let prev = '';
    const items = paths.map((path) => {
      const r = rs.find((r) => {
        if (r.path.startsWith('/:')) {
          return true;
        }
        return path.startsWith(r.path.slice(1));
      })!;
      rs = r.routes!;
      return (
        <Breadcrumb.Item key={path}>
          <Link to={(prev = `${prev}/${path}`)}>{r.name}</Link>
        </Breadcrumb.Item>
      );
    });
    setBreadcrumb(<Breadcrumb>{items}</Breadcrumb>);
  };

  useEffect(() => {
    f();
    bus.addListener('routePathChange', f);
    return () => {
      bus.removeListener('routePathChange', f);
    };
  }, []);

  return (
    <div className="NavBar">
      <div>
        <div>{breadcrumb}</div>
        <div>
          {me ? (
            <React.Fragment>
              <Popover
                title={<span style={{ padding: '0 8px' }}>{me.nickName}</span>}
                content={
                  <div className={'PopoverBtnList'}>
                    <div
                      onClick={() => (
                        GET('/logout'),
                        setTimeout(() => window.location.reload(), 300)
                      )}
                    >
                      退出
                    </div>
                  </div>
                }
                trigger="click"
                placement="bottomRight"
              >
                <DefaultAvatar avatar={me.avatar} />
              </Popover>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Button type={'primary'} onClick={toLogin}>
                登录
              </Button>
              <div style={{ width: '1em' }} />
              <Button onClick={toReg}>注册</Button>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

export default observer(NavBar);
