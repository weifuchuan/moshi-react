import React from "react";
import { CellInfo } from "react-table";
import { formatTime } from "@/common/kit/functions/moments";

export const OptionalCell = (props: CellInfo) => (
  <span style={{ color: props.value ? "#000" : "#A9A9A9" }}>
    {props.value ? props.value : "无"}
  </span>
);

export const TimeCell = (props: CellInfo) => <span>{formatTime(props.value)}</span>;

export const OptionalTimeCell = (props: CellInfo) => (
  <span style={{ color: props.value ? "#000" : "#A9A9A9" }}>
    {props.value ? formatTime(props.value) : "无"}
  </span>
);
