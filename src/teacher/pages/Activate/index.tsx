import React from "react";
import Layout from "@/teacher/layouts/Layout";
import { Control } from "react-keeper";
import "./index.scss";
import useTitle from "@/common/hooks/useTitle";
import { connect } from "react-redux";
import { setMe } from "@/teacher/store/me/actions";
import {
  Account,
  activate,
  reg,
  reSendActivateEmail
} from "@/common/models/account";
import { State } from "@/teacher/store/state_type";
import ActivatePanel from "@/common/components/ActivatePanel";
import { message } from "antd";

interface Props {
  me: Account;
  activate: typeof activate;
}

function Activate({ me }: Props) {
  useTitle("激活 | 默识 - 作者端");

  return (
    <Layout>
      <div className="Activate">
        <ActivatePanel
          email={me.email}
          resend={reSendActivateEmail}
          confirm={async code => {
            let ret = await activate(code);
            if (ret.state === "ok") {
              message.success("激活成功");
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

export default connect(
  (state: State) => ({
    me: state.me!
  }),
  { activate }
)(Activate);
