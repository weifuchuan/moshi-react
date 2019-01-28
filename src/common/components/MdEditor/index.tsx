import React from "react";
import "antd/lib/upload/style/index.css";
import "antd/lib/modal/style/index.css"
import { UploadProps } from "antd/lib/upload";
import { baseUrl } from "@/common/kit/req";
const LzEditor = require("react-lz-editor");

interface Props {
  value: string;
  onChange: (value: string) => void;
  editorProps?: any;
}

export default function MdEditor({ value, onChange, editorProps }: Props) {
  return (
    <LzEditor
      active={true}
      importContent={value}
      cbReceiver={onChange}
      image={true}
      video={false}
      audio={false}
      convertFormat="markdown"
      uploadProps={
        {
          action: `${baseUrl}/file/upload`,
          listType: "picture",
          multiple: true,
          showUploadList: true
        } as UploadProps
      }
      {...(editorProps ? editorProps : {})}
    />
  );
}
