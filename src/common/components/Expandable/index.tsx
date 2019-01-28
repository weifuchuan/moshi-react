import React, {
  useState,
  Children,
  ReactElement,
  ReactInstance,
  useRef,
  useEffect
} from "react";
import * as ReactDOM from "react-dom";
import { repeat } from "@/common/kit/functions";

export default function Expandable({
  height,
  children
}: {
  height: number;
  children: JSX.Element;
}) {
  const [expanded, setExpanded] = useState(false);
  const innerContainer = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   repeat(() => {
  //     if (innerContainer.current) {
  //       if (innerContainer.current.clientHeight < height) {
  //         setExpanded(true);
  //       }
  //       return true;
  //     }
  //     return false;
  //   }, 60);
  // }, []);

  if (expanded) {
    return children;
  }

  return (
    <div style={{}}>
      <div style={{ height: height + "px", overflow: "hidden" }}>
        <div ref={innerContainer}>{children}</div>
      </div>
      <div
        style={{
          color: "#b2b2b2",
          fontSize: "13px",
          cursor: "pointer"
        }}
        onClick={() => setExpanded(true)}
      >
        展开
      </div>
    </div>
  );
}
