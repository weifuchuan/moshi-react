import React, { useContext } from "react";
import Layout from "@/teacher/layouts/Layout";
import { Control } from "react-keeper";
import "./index.scss";
import useTitle from "@/common/hooks/useTitle";
import { IAccount, AccountAPI } from "@/common/models/Account";
import ActivatePanel from "@/common/components/ActivatePanel";
import { message } from "antd";
import { observer } from "mobx-react-lite";
import { StoreContext } from "@/teacher/store";
import Account from "@/common/models/Account";

function Activate() {
  useTitle("激活 | 默识 - 作者端");
  const store = useContext(StoreContext);
  const me = store.me!;
  return (
    <Layout>
      <div className="Activate">
        <ActivatePanel
          email={me.email}
          resend={AccountAPI.reSendActivateEmail}
          confirm={async code => {
            let ret = await AccountAPI.activate(code);
            if (ret.state === "ok") {
              message.success("激活成功");
              me.status = Account.STATUS.LEARNER;
              Control.go("/");
            } else {
              message.error("激活失败");
            }
          }}
        />
      </div>
    </Layout>
  );
}

export default observer(Activate);
