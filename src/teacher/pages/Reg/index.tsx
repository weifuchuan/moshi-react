import React, { useContext } from "react";
import Layout from "@/teacher/layouts/Layout";
import { Control } from "react-keeper";
import RegPanel from "@/common/components/RegPanel";
import "./index.scss";
import useTitle from "@/common/hooks/useTitle";
import Account, { AccountAPI } from "@/common/models/Account";
import { message } from "antd";
import { fetchBase64Image } from "@/common/kit/req";
import { observer } from "mobx-react-lite";
import { StoreContext } from "@/teacher/store";

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
