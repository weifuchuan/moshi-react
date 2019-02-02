import LoginPanel from "@/common/components/LoginPanel";
import useTitle from "@/common/hooks/useTitle";
import { fetchBase64Image } from "@/common/kit/req";
import Account from "@/common/models/Account";
import Layout from "@/teacher/layouts/Layout";
import { StoreContext } from "@/teacher/store";
import { message } from "antd";
import { observer } from "mobx-react-lite";
import qs from "qs";
import React, { useContext } from "react";
import { Control } from "react-keeper";
import "./index.scss";
 
function Login( ) {
  useTitle("登录 | 默识 - 作者端");

  const store = useContext(StoreContext);

  return (
    <Layout>
      <div className="Login">
        <LoginPanel
          onLogin={async ({ email, password, captcha }) => {
            try {
              const account = await Account.login(email, password, captcha);
              store.me = account;
              message.success("登录成功");
              let nextPath = "/";
              const i = Control.path.indexOf("?");
              if (i !== -1) {
                const params = qs.parse(
                  Control.path.substring(Control.path.indexOf("?") + 1)
                );
                if (params.returnUrl && typeof params.returnUrl === "string") {
                  nextPath = params.returnUrl;
                }
              }
              Control.go(nextPath);
            } catch (error) {
              message.error(error.toString());
            }
          }}
          toReg={() => Control.go("/reg")}
          getCaptcha={() =>
            fetchBase64Image(`/login/captcha?r=${Math.random()}`)
          }
        />
      </div>
    </Layout>
  );
}

export default observer(Login);
