import useTitle from "@/common/hooks/useTitle";
import Layout from "@/teacher/layouts/Layout";
import { StoreContext } from "@/teacher/store";
import { observer, useObservable } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import "./index.scss";
import {
  Skeleton,
  Tabs,
  List,
  Icon,
  Upload,
  Modal,
  Input,
  Progress,
  message
} from "antd";
import Audio from "@/common/models/Audio";
import Video from "@/common/models/Video";
import { runInAction, action } from "mobx";
import MediaItem from "./MediaItem";
import ReactPlayer from "react-player";
import { upload } from "@/common/kit/req";

const TabPane = Tabs.TabPane;
const Dragger = Upload.Dragger;

function Media() {
  useTitle("我的媒体资源 | 默识 - 作者端");

  const store = useContext(StoreContext);
  const { audios, videos } = store;

  const loading = useObservable({ value: true });
  const showUploadModal = useObservable({ value: false });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const name = useObservable({ value: "" });
  const recorder = useObservable({ value: store.me!.nickName });
  const uploadPercent = useObservable({ value: 0 });
  const uploading = useObservable({ value: false });
  const playUrl = useObservable({ value: "" });

  useEffect(() => {
    (async () => {
      const [audios, videos] = await Promise.all([
        Audio.myUploaded(),
        Video.myUploaded()
      ]);
      runInAction(() => {
        store.audios.splice(0, store.audios.length, ...audios);
        store.videos.splice(0, store.videos.length, ...videos);
      });
      loading.value = false;
    })();
  }, []);

  return (
    <Layout>
      <div className="Media">
        {loading.value ? (
          <Skeleton active />
        ) : (
          <React.Fragment>
            <div className={"UploadPanel"}>
              <Dragger
                customRequest={action(({ file }: { file: File }) => {
                  setSelectedFile(file);
                  showUploadModal.value = true;
                  const i = file.name.lastIndexOf("/");
                  name.value = file.name.substring(i === -1 ? 0 : i + 1);
                  uploadPercent.value = 0;
                })}
                showUploadList={false}
                multiple={false}
                accept={"audio/*,video/*"}
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此上传</p>
              </Dragger>
              <Modal
                visible={showUploadModal.value}
                onCancel={() => (showUploadModal.value = false)}
                onOk={action(async () => {
                  let type = "";
                  if (/audio/.test(selectedFile!.type)) {
                    type = "audio";
                  } else if (/video/.test(selectedFile!.type)) {
                    type = "video";
                  } else {
                    throw "invalid file type";
                  }

                  const { response, progress } = upload(
                    [selectedFile!],
                    {
                      name: name.value,
                      recorder: recorder.value
                    },
                    `/${type}/upload`
                  );

                  uploading.value = true;
                  progress.subscribe(
                    percent => {
                      uploadPercent.value = percent;
                    },
                    console.error,
                    () => {}
                  );

                  try {
                    const { data } = await response;

                    if (data.state === "ok") {
                      if (type === "audio") {
                        audios.push(Audio.from(data.audio));
                      } else {
                        videos.push(Video.from(data.video));
                      }
                    } else {
                      message.error("上传失败：" + data.msg);
                    }
                  } catch (err) {
                    message.error("上传失败：" + err.toString());
                  }

                  uploading.value = false;
                  showUploadModal.value = false;
                })}
                okText={"上传"}
                cancelText={"取消"}
              >
                <p>已选择文件：{selectedFile ? selectedFile!.name : ""}</p>
                <Input
                  placeholder={"名称"}
                  value={name.value}
                  onChange={e => (name.value = e.target.value)}
                  style={{ marginBottom: "1em" }}
                />
                <Input
                  placeholder={"阅读者"}
                  value={recorder.value}
                  onChange={e => (recorder.value = e.target.value)}
                />
              </Modal>
            </div>
            <Tabs defaultActiveKey="1">
              <TabPane tab="音频" key="1">
                <List
                  split
                  bordered
                  dataSource={audios.slice()}
                  renderItem={(audio: Audio) => {
                    return (
                      <List.Item>
                        <MediaItem
                          media={audio}
                          onPlay={() => {
                            playUrl.value = audio.resource;
                          }}
                          onDelete={() => {}}
                        />
                      </List.Item>
                    );
                  }}
                />
              </TabPane>
              <TabPane tab="视频" key="2">
                <List
                  split
                  bordered
                  dataSource={videos.slice()}
                  renderItem={(video: Video) => {
                    return (
                      <List.Item>
                        <MediaItem
                          media={video}
                          onPlay={() => {
                            playUrl.value = video.resource;
                          }}
                          onDelete={() => {}}
                        />
                      </List.Item>
                    );
                  }}
                />
              </TabPane>
            </Tabs>
            {playUrl.value ? (
              <ReactPlayer
                style={{ marginTop: "1em" }}
                url={playUrl.value}
                controls
              />
            ) : null}
          </React.Fragment>
        )}
      </div>
      {uploading.value ? (
        <div className={"UploadProgress"}>
          <Progress type="circle" percent={uploadPercent.value} />
        </div>
      ) : null}
    </Layout>
  );
}

export default observer(Media);
