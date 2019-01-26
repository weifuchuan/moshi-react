import React, { useRef, useState } from "react";
import Layout from "@/teacher/layouts/Layout";
import { Control } from "react-keeper";
import LoginPanel from "@/common/components/LoginPanel";
import qs from "qs";
import { AccountAPI } from "@/common/models/account";
import { message } from "antd";
import { connect } from "react-redux";
import "./index.scss";
import useWindowSize from "@/common/hooks/useWindowSize";
import useTitle from "@/common/hooks/useTitle";
import { fetchBase64Image, GET } from "@/common/kit/req";
import { login } from "@/teacher/store/me/actions";

interface Props {
  login: typeof login;
}

function Login({ login }: Props) {
  useTitle("登录 | 默识 - 作者端");

  return (
    <Layout>
      <div className="Login">
        <LoginPanel
          onLogin={async ({ email, password, captcha }) => {
            // try {
            login(
              email,
              password,
              captcha,
              account => {
                message.success("登录成功");
                let nextPath = "/";
                const i = Control.path.indexOf("?");
                if (i !== -1) {
                  const params = qs.parse(
                    Control.path.substring(Control.path.indexOf("?") + 1)
                  );
                  if (
                    params.returnUrl &&
                    typeof params.returnUrl === "string"
                  ) {
                    nextPath = params.returnUrl;
                  }
                }
                Control.go(nextPath);
              },
              error => {
                message.error(error.toString());
              }
            );

            // const account = await AccountAPI.login(email, password, captcha);
            // setMe(account);

            // } catch (error) {

            // }
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

export default connect(
  null,
  { login }
)(Login);
