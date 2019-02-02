import React, { Component } from "react";
import "./index.scss";
import { Avatar, Button, Modal, Upload } from "antd";
import AvatarEditor from "react-avatar-editor";
import { select, staticBaseUrl } from "@/common/kit/req";

export interface AvatarSelectorProps {
  value: { base64: string; file: File } | string;
  onChange: (value: { base64: string; file: File }) => void;
}

export default class AvatarSelector extends Component<AvatarSelectorProps> {
  private editor: AvatarEditor | null = null;

  state = { visible: false, selected: false, image: null };

  render() {
    const { value, onChange } = this.props;
    return (
      <div>
        <img
          width={64}
          height={64}
          src={
            typeof value === "string"
              ? `${staticBaseUrl}${value}`
              : value.base64
          }
        />
        <Button style={{ marginLeft: "1em" }} onClick={this.clickUpload}>
          上传头像
        </Button>

        <Modal
          title={"上传头像"}
          visible={this.state.visible}
          onCancel={() => this.setState({ visible: false })}
          onOk={() => {
            const canvas = this.editor!.getImage();
            const base64 = canvas.toDataURL();
            onChange({ base64, file: this.state.image! });
            this.setState({ visible: false });
          }}
        >
          <div>
            {!this.state.selected ? (
              <Button
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.style.display = "none";
                  input.onchange = e => {
                    if (input.files && input.files.length > 0) {
                      this.setState({ selected: true, image: input.files[0] });
                    }
                  };
                  document
                    .getElementsByTagName("body")
                    .item(0)!
                    .appendChild(input);
                  input.click();
                }}
              >
                选择图片
              </Button>
            ) : (
              <React.Fragment>
                <AvatarEditor
                  ref={e => (this.editor = e)}
                  image={this.state.image!}
                  width={250}
                  height={250}
                  border={50}
                  color={[255, 255, 255, 0.6]} // RGBA
                  scale={1.2}
                  rotate={0}
                />
              </React.Fragment>
            )}
          </div>
        </Modal>
      </div>
    );
  }

  private clickUpload = () => {
    this.setState({ visible: true });
  };
}
