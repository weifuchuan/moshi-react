import React, { Component } from 'react';
import './index.less';
import { Avatar, Button, Modal, Upload } from 'antd';
import AvatarEditor from 'react-avatar-editor';
import { select, staticBaseUrl } from '@/common/kit/req';

export interface AvatarSelectorProps {
  value: { base64: string; file: File } | string;
  onChange: (value: { base64: string; file: File }) => void;
}

export default class AvatarSelector extends Component<AvatarSelectorProps> {
  private editor: AvatarEditor | null = null;

  state = {
    visible: false,
    selected: false,
    image: null,
    allowZoomOut: false,
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    rotate: 0,
    borderRadius: 0
  };

  render() {
    const { value, onChange } = this.props;
    return (
      <div>
        <img
          width={64}
          height={64}
          src={
            typeof value === 'string' ? (
              `${staticBaseUrl}${value}`
            ) : (
              value.base64
            )
          }
        />
        <Button style={{ marginLeft: '1em' }} onClick={this.clickUpload}>
          上传头像
        </Button>

        <Modal
          title={'上传头像'}
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
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.style.display = 'none';
                  input.onchange = (e) => {
                    if (input.files && input.files.length > 0) {
                      this.setState({ selected: true, image: input.files[0] });
                    }
                  };
                  document.getElementsByTagName('body').item(0)!.appendChild(
                    input
                  );
                  input.click();
                }}
              >
                选择图片
              </Button>
            ) : (
              <React.Fragment>
                <AvatarEditor
                  style={{ border: '1px solid #aaa' }}
                  ref={(e) => (this.editor = e)}
                  image={this.state.image!}
                  width={250}
                  height={250}
                  border={50}
                  color={[ 255, 255, 255, 0.6 ]} // RGBA  
                  // @ts-ignore
                  scale={parseFloat(this.state.scale)}
                  // @ts-ignore
                  rotate={parseFloat(this.state.rotate)}
                />
                <br />
                Zoom:
                <input
                  name="scale"
                  type="range"
                  onChange={this.handleScale}
                  min={this.state.allowZoomOut ? '0.1' : '1'}
                  max="2"
                  step="0.01"
                  defaultValue="1"
                />
                <br />
                Rotate:
                <button onClick={this.rotateLeft}>Left</button>
                <button onClick={this.rotateRight}>Right</button>
                <br />
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

  handleScale = (e: any) => {
    const scale = parseFloat(e.target.value);
    this.setState({ scale });
  };

  handleAllowZoomOut = ({ target: { checked: allowZoomOut } }: any) => {
    this.setState({ allowZoomOut });
  };

  rotateLeft = (e: any) => {
    e.preventDefault();

    this.setState({
      rotate: this.state.rotate - 90
    });
  };

  rotateRight = (e: any) => {
    e.preventDefault();
    this.setState({
      rotate: this.state.rotate + 90
    });
  };

  handleBorderRadius = (e: any) => {
    const borderRadius = parseInt(e.target.value);
    this.setState({ borderRadius });
  };

  handleXPosition = (e: any) => {
    const x = parseFloat(e.target.value);
    this.setState({ position: { ...this.state.position, x } });
  };

  handleYPosition = (e: any) => {
    const y = parseFloat(e.target.value);
    this.setState({ position: { ...this.state.position, y } });
  };

  handleWidth = (e: any) => {
    const width = parseInt(e.target.value);
    this.setState({ width });
  };

  handleHeight = (e: any) => {
    const height = parseInt(e.target.value);
    this.setState({ height });
  };

  logCallback(e: any) {
    // eslint-disable-next-line
    console.log('callback', e);
  }

  setEditorRef = (editor: any) => {
    if (editor) this.editor = editor;
  };

  handlePositionChange = (position: any) => {
    this.setState({ position });
  };

  handleDrop = (acceptedFiles: any) => {
    this.setState({ image: acceptedFiles[0] });
  };
}
