import ActivatePanel from "@/common/components/ActivatePanel";
import useTitle from "@/common/hooks/useTitle";
import Account from "@/common/models/Account";
import Layout from "@/teacher/layouts/Layout";
import { StoreContext } from "@/teacher/store";
import { message } from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Control } from "react-keeper";
import "./index.scss";

function Activate() {
  useTitle("激活 | 默识 - 作者端");
  const store = useContext(StoreContext);
  const me = store.me!;
  return (
    <Layout>
      <div className="Activate">
        <ActivatePanel
          email={me.email}
          resend={Account.reSendActivateEmail}
          confirm={async code => {
            let ret = await Account.activate(code);
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
