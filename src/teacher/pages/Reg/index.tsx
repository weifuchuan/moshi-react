import RegPanel from "@/common/components/RegPanel";
import useTitle from "@/common/hooks/useTitle";
import { fetchBase64Image } from "@/common/kit/req";
import Account from "@/common/models/Account";
import Layout from "@/teacher/layouts/Layout";
import { StoreContext } from "@/teacher/store";
import { message } from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Control } from "react-keeper";
import "./index.less";

function Reg() {
  useTitle("注册 | 默识 - 作者端");
  const store = useContext(StoreContext);
  return (
    <Layout>
      <div className="Reg">
        <RegPanel
          onReg={async ({ email, password, nickName, captcha }) => {
            try {
              const account = await Account.reg(
                email,
                nickName,
                password,
                captcha
              );
              store.me = account;
              Control.go("/");
            } catch (error) {
              message.error(error);
            }
          }}
          toLogin={() => Control.go("/login")}
          getCaptcha={() => fetchBase64Image(`/reg/captcha?r=${Math.random()}`)}
        />
      </div>
    </Layout>
  );
}

export default observer(Reg);
