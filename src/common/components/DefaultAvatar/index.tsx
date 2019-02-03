import React from 'react';
import { Avatar } from 'antd';
import { AvatarProps } from 'antd/lib/avatar';
import { staticBaseUrl } from '@/common/kit/req';

export default function DefaultAvatar(
  props: { avatar?: string; onClick?: () => void } & AvatarProps
) {
  let { avatar, onClick, ...otherProps } = props;

  if (__DEV__) {
    if (avatar && avatar.startsWith('/static')) {
      avatar = staticBaseUrl + avatar;
    }
  }

  return (
    <div onClick={onClick}>
      <Avatar
        style={{ cursor: 'pointer' }}
        shape="square"
        {...(avatar ? { src: avatar } : { icon: 'user' })}
        {...otherProps}
      />
    </div>
  );
}
