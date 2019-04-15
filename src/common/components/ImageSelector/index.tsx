import React, { Component } from 'react';
import './index.less';
import { Avatar, Button, Modal, Upload } from 'antd';
import AvatarEditor from 'react-avatar-editor';
import { select, staticBaseUrl } from '@/common/kit/req';

export interface ImageSelectorProps {
  height?: number;
  width?: number;
  value: { base64: string; file: File } | string;
  onChange: (value: { base64: string; file: File }) => void;
}

export default class ImageSelector extends Component<ImageSelectorProps> {
  static defaultProps = {
    height: 360 / 2,
    width: 360
  };

  private editor: AvatarEditor | null = null;

  state = {
    visible: false,
    selected: false,
    image: null,
    scale: 1,
    allowZoomOut: false,
    rotate: 0
  };

  render() {
    const { value, onChange } = this.props;
    return (
      <div className={'ImageSelector'}>
        <img
          style={{ border: 'solid 1px #aaa' }}
          width={360}
          height={360 * 3 / 5}
          src={
            typeof value === 'string' ? (
              `${staticBaseUrl}${value}`
            ) : (
              value.base64
            )
          }
        />
        <Button style={{ marginTop: '1em' }} onClick={this.clickUpload}>
          上传图片
        </Button>

        <Modal
          title={'上传图片'}
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
                  ref={(e) => (this.editor = e)}
                  image={this.state.image!}
                  width={360}
                  height={360 * 3 / 5}
                  border={50}
                  color={[ 255, 255, 255, 0.6 ]} // RGBA
                  // @ts-ignore
                  scale={parseFloat(this.state.scale)}
                  // @ts-ignore
                  rotate={parseFloat(this.state.rotate)}
                />{' '}
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

  handleScale = (e: any) => {
    const scale = parseFloat(e.target.value);
    this.setState({ scale });
  };
}
