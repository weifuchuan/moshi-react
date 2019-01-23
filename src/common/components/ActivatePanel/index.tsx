import React, { useState } from "react";
import Panel from "@/common/components/Panel";
import { Button, Input, message } from "antd";
import { Ret } from "@/common/kit/req";
import "./index.less";

interface Props {
  email: string;
  resend: () => Promise<Ret>;
  confirm: (code: string) => void;
}

function ActivatePanel({ email, resend, confirm }: Props) {
  const [code, setCode] = useState("");
  return (
    <Panel className={"ActivatePanel"}>
      <div>
        您的邮箱：<b>{email}</b>
        <Button
          style={{ marginLeft: "1em" }}
          onClick={async () => {
            let ret = await resend();
            if (ret.state === "ok") {
              message.success("发送成功，请查收，如未收到，请查看垃圾邮件");
            } else {
              message.error("发送失败");
            }
          }}
        >
          重新发送
        </Button>
      </div>
      <Input
        style={{ margin: "1em 0" }}
        value={code}
        onInput={(e: any) => setCode(e.target.value)}
      />
      <Button
        onClick={async () => {
          confirm(code);
        }}
        type="primary"
        style={{ width: "100%" }}
      >
        确认
      </Button>
    </Panel>
  );
}

export default ActivatePanel;
