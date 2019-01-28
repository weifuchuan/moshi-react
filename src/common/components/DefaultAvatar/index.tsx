import React from "react";
import { Avatar } from "antd";
import { AvatarProps } from "antd/lib/avatar";

export default function DefaultAvatar(
  props: { avatar?: string } & AvatarProps
) {
  const { avatar, ...otherProps } = props;

  return (
    <Avatar
      style={{ cursor: "pointer" }}
      shape="square"
      {...(avatar ? { src: avatar } : { icon: "user" })}
      {...otherProps}
    />
  );
}
