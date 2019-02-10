import React, { useRef, useState } from 'react';
import { staticBaseUrl } from '@/common/kit/req';
import { secondToMS } from '@/common/kit/functions/secondToStr';
import './index.scss';
import { Button } from 'antd';

export interface AudioPlayerProps {
  resource: string;
  recorder: string;
}

export default function AudioPlayer({ resource, recorder }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  if (__DEV__) {
    if (resource.startsWith('/static')) {
      resource = staticBaseUrl + resource;
    }
  }
  const [ timeLength, setTimeLength ] = useState(0);
  const [ playing, setPlaying ] = useState(false);
  return (
    <div className={'AudioPlayer'}>
      <div>
        <span>朗读者：{recorder}</span>
        <span>时长：{secondToMS(timeLength)} </span>
      </div>
      <div>
        <Button
          // type="primary"
          shape="circle"
          size="large"
          onClick={() => {
            if(playing){
              audioRef.current!.pause()
            }else{
              audioRef.current!.play();
            }
            setPlaying(!playing);
          }}
          icon={playing ? 'pause' : 'right'}
        />
      </div>
      <audio
        ref={audioRef}
        style={{ display: 'none' }}
        src={resource}
        preload="metadata"
        onLoadedMetadata={(e) => {
          setTimeLength(audioRef.current!.duration);
        }}
      />
    </div>
  );
}
