import React from "react";
import "./MediaItem.scss";
import { fromNow } from "@/common/kit/functions/moments";
import { Button } from "antd";

interface Media {
  id: number;
  resource: string;
  recorder: string;
  accountId: number;
  status: number;
  name: string;
  uploadAt: number;
}

interface Props {
  media: Media;
  // type: "audio" | "video";
  onPlay: () => void;
  onDelete: () => void;
}

export default function MediaItem({ media, onPlay, onDelete }: Props) {
  return (
    <div className={"MediaItem"}>
      <div>
        <div>
          <span>{media.name}</span>
        </div>
        <div>
          <span>{fromNow(media.uploadAt)}</span>
        </div>
      </div>
      <div>
        <div>
          <span>{media.recorder}</span>
        </div>
        <div>
          <div>
            <Button type={"primary"} onClick={onPlay} size="small">
              播放
            </Button>
          </div>
          <div>
            <Button
              type="danger"
              onClick={onDelete}
              style={{ marginLeft: "1em" }}
              size="small"
            >
              删除
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
