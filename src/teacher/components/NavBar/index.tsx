import React from "react";
import "./index.scss";
import { Button,  Popover } from "antd";
import { Account } from "@/common/models/account";
import { connect } from "react-redux";
import { State } from "@/teacher/store/state_type";
import { GET } from "@/common/kit/req";
import { Control } from "react-keeper";
import DefaultAvatar from "@/common/components/DefaultAvatar"; 

interface Props {
  me: Account | null;
  toLogin: () => void;
  toReg: () => void;
}

function NavBar({ me, toLogin, toReg }: Props) {
  return (
    <div className="NavBar">
      <div>
        <div style={{ cursor: "pointer" }} onClick={() => Control.go("/")}>
          <span>默识</span>
          <span>|</span>
          <span>作者版</span>
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

export default connect((state: State) => ({ me: state.me }))(NavBar);
