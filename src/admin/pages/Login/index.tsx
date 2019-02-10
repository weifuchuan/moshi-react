import React, { FunctionComponent, useContext } from "react";
import "./index.scss";
import LoginPanel from "@/common/components/LoginPanel";
import { message } from "antd";
import { fetchBase64Image } from "@/common/kit/req";
import Account from "@/common/models/Account";
import { StoreContext } from "@/admin/store";
import { Control } from "react-keeper";
import { packToClassComponent } from "@/common/kit/functions/packToClassComponent";

const Login: FunctionComponent<{}> = () => {
  const store = useContext(StoreContext);

  return (
    <div className={"Login"}>
      <LoginPanel
        onLogin={async ({ email, password, captcha }) => {
          const account = await Account.login(email, password, captcha);
          store.me = account;
          Control.go("/");
        }}
        toReg={() => {
          message.error("此处不允许注册");
        }}
        getCaptcha={() => fetchBase64Image(`/login/captcha?r=${Math.random()}`)}
      />
    </div>
  );
};

export default packToClassComponent(Login); 