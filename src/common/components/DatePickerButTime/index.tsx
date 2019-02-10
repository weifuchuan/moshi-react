import React, { Component } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { DatePickerProps } from 'antd/lib/date-picker/interface';

export default class DatePickerButTime extends Component<
  {
    value?: number;
    onChange?: (value: number) => void;
  } & DatePickerProps
> {
  render() {
    return (
      <DatePicker
        {...this.props}
        allowClear={false}
        value={moment(this.props.value)}
        onChange={(v) => {
          this.props.onChange && this.props.onChange(v.toDate().getTime());
        }}
      />
    );
  }
}
