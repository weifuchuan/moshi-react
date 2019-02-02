import React from "react";
import "./index.scss";
import { Button, Popover } from "antd"; 
import { GET } from "@/common/kit/req";
import { Control } from "react-keeper";
import DefaultAvatar from "@/common/components/DefaultAvatar";
import { observer } from "mobx-react-lite";
import { useContext} from "react";
import { StoreContext } from "@/admin/store";

interface Props {
  toLogin: () => void;
  toReg: () => void;
}

function NavBar({ toLogin, toReg }: Props) {
  const store = useContext(StoreContext);
  const me = store.me;

  return (
    <div className="NavBar">
      <div>
        <div style={{ cursor: "pointer" }} onClick={() => Control.go("/home")}>
          <span>默识</span>
          <span>|</span>
          <span>后台管理</span>
        </div>
        <div>
          {me ? (
            <React.Fragment>
              <Popover
                title={<span style={{ padding: "0 8px" }}>{me.nickName}</span>}
                content={
                  <div className={"PopoverBtnList"}>
                    <div
                      onClick={() => (
                        GET("/logout"),
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
              <Button type={"primary"} onClick={toLogin}>
                登录
              </Button>
              <div style={{ width: "1em" }} />
              <Button onClick={toReg}>注册</Button>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

export default observer(NavBar);
