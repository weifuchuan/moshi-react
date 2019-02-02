import { Button, Modal } from "antd";
import { ButtonProps } from "antd/lib/button";
import "draft-js/dist/Draft.css";
import "github-markdown-css/github-markdown.css";
import React, { Component } from "react";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import "./index.scss";
import { fromEvent } from "rxjs";
import markdownToHtml from "@/common/kit/functions/markdownToHtml";
require("./all.min.js");

interface CommentEditorProps {
  okText?: string;
  defaultContent?: string;
  onComment: (content: string) => void;
}

interface PopCommentEditorProps {
  buttonProps: ButtonProps;
  initContent: string;
  okText?: string;
  onOk: (content: string) => void;
}

export class CommentEditor extends Component<CommentEditorProps> {
  state = { content: "" };

  constructor(props: CommentEditorProps) {
    super(props);

    this.state = {
      content: props.defaultContent ? props.defaultContent : ""
    };
  }

  readonly setContent = (content: string) => {
    this.setState({ content });
    setTimeout(() => {
      this.setState({ content });
      this.container!.scrollIntoView();
    }, 300);
  };

  readonly getContent = () => {
    return this.state.content;
  };

  container: HTMLDivElement | null = null;
  input: HTMLInputElement | null = null;

  render() {
    return (
      <div className={"CommentEditor"} ref={e => (this.container = e)}>
        <ReactMde
          onChange={v => this.setState({ content: v })}
          value={this.state.content}
          generateMarkdownPreview={md =>
            markdownToHtml(md).then(html => (this.preview(), html))
          }
        />
        {/* <div className="Upload" onClick={this.upload}>
          <input
            accept=".gif,.jpeg,.jpg,.png,.docx,.gz,.log,.pdf,.pptx,.txt,.xlsx,.zip"
            type="file"
            multiple={true}
            aria-label="Attach files to your comment"
            ref={e => (this.input = e)}
          />
          <span>
            上传文件（.gif,.jpeg,.jpg,.png,.docx,.gz,.log,.pdf,.pptx,.txt,.xlsx,.zip）
          </span>
          <Modal
            title="Basic Modal"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal>
        </div> */}
        <div className="BottomBar">
          <a
            href="https://guides.github.com/features/mastering-markdown/"
            target="_blank"
          >
            <svg
              viewBox="0 0 16 16"
              version="1.1"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z"
              />
            </svg>
            <span>Markdown参考</span>
          </a>
          <Button
            type="primary"
            onClick={() => {
              this.props.onComment(this.state.content);
            }}
          >
            {this.props.okText ? this.props.okText : "评论"}
          </Button>
        </div>
      </div>
    );
  }

  preview = () => {
    const els = document.getElementsByClassName("mde-preview");
    if (open)
      for (let i = 0; i < els.length; i++) {
        if (els.item(i)!.className.indexOf("markdown-body") === -1) {
          els.item(i)!.className += " markdown-body";
        }
      }
  };

  upload = async () => {
    if (this.input) {
      const subp = fromEvent(this.input, "change").subscribe(() => {
        const files = this.input!.files;
        if (files) {
          if (files.length > 0) {
          }
        }
        subp.unsubscribe();
      });
      this.input.click();
    }
  };
}

export class PopCommentEditor extends Component<PopCommentEditorProps> {
  state = { open: false, content: "" };

  constructor(props: PopCommentEditorProps) {
    super(props);

    this.state = { open: false, content: props.initContent };
  }

  readonly setContent = (content: string) => {
    this.setState({ content });
  };

  readonly getContent = () => {
    return this.state.content;
  };

  render() {
    const { buttonProps, okText, onOk } = this.props;

    return (
      <React.Fragment>
        <Button
          {...buttonProps}
          onClick={() => {
            this.setState({ open: true });
          }}
        >
          {buttonProps.children}
        </Button>
        <Modal
          visible={this.state.open}
          onCancel={() => this.setState({ open: false })}
          closable={false}
          style={{ width: "640px", height: "480px" }}
          okText={okText ? okText : "评论"}
          onOk={() => {
            onOk(this.state.content);
            this.setState({ open: false });
          }}
          cancelText={"取消"}
        >
          <ReactMde
            onChange={v => this.setState({ content: v })}
            value={this.state.content}
            generateMarkdownPreview={md =>
              markdownToHtml(md).then(html => (this.preview(), html))
            }
          />
        </Modal>
      </React.Fragment>
    );
  }

  preview = () => {
    const els = document.getElementsByClassName("mde-preview");
    if (open)
      for (let i = 0; i < els.length; i++) {
        if (els.item(i)!.className.indexOf("markdown-body") === -1) {
          els.item(i)!.className += " markdown-body";
        }
      }
  };
}
