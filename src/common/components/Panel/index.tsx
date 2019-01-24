import React, { ReactNode } from "react";
import "./index.less";

export default function Panel({
  children,
  className,
  style,
  onClick
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      className={`Panel ${className || ""}`}
      style={style}
      onClick={onClick ? onClick : () => null}
    >
      {children}
    </div>
  );
}
