import React from 'react';
import { CellInfo } from 'react-table';
import { formatTime } from '@/common/kit/functions/moments';
import { Observer } from 'mobx-react-lite';
import isUndefOrNull from '@/common/kit/functions/isUndefOrNull';

export const buildObserverCell = (gen: (props: CellInfo) => JSX.Element) => (
  props: CellInfo
) => <Observer>{() => <span>{gen(props)}</span>}</Observer>;

export const TextCell = (props: CellInfo) => {
  return (
    <Observer>{() => <span>{props.original[props.column.id!]}</span>}</Observer>
  );
};

export const OptionalCell = buildObserverCell((props) => (
  <span
    style={{ color: props.original[props.column.id!] ? '#000' : '#A9A9A9' }}
  >
    {isUndefOrNull(props.original[props.column.id!]) ? (
      '无'
    ) : (
      props.original[props.column.id!]
    )}
  </span>
));

// export const OptionalCell = (props: CellInfo) => (
// <span style={{ color: props.value ? '#000' : '#A9A9A9' }}>
//   {props.value ? props.value : '无'}
// </span>
// );

export const TimeCell = buildObserverCell((props: CellInfo) => (
  <span>{formatTime(props.original[props.column.id!])}</span>
));

export const OptionalTimeCell = buildObserverCell((props: CellInfo) => (
  <span
    style={{ color: props.original[props.column.id!] ? '#000' : '#A9A9A9' }}
  >
    {props.original[props.column.id!] ? (
      formatTime(props.original[props.column.id!])
    ) : (
      '无'
    )}
  </span>
));
