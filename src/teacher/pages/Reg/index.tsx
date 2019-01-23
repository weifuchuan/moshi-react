import React from "react";
import Layout from "@/teacher/layouts/Layout";
import { Control } from "react-keeper";
import RegPanel from "@/common/components/RegPanel";
import "./index.scss";
import useTitle from "@/common/hooks/useTitle";
import { connect } from "react-redux";
import { setMe } from "@/teacher/store/me/actions";
import { AccountAPI } from "@/common/models/account";
import { message } from "antd";
import { fetchBase64Image } from "@/common/kit/req";

interface Props {
  setMe: typeof setMe;
}

function Reg({ setMe }: Props) {
  useTitle("注册 | 默识 - 作者端");

  return (
    <Layout>
      <div className="Reg">
        <RegPanel
          onReg={async ({ email, password, nickName, captcha }) => {
            try {
              const account = await AccountAPI.reg(email, nickName, password, captcha);
              setMe(account);
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

export default connect(
  null,
  { setMe }
)(Reg);
