import Rate from 'rc-rate';
import 'rc-rate/assets/index.css';
import { RateProps } from 'rc-rate/lib/Rate';
import React from 'react';

const CRate: React.FC<RateProps> = ({ ...rest }) => {
  return (
    <span className="c-rate">
      <Rate allowHalf count={5} allowClear={false} {...rest} />
    </span>
  );
};

export default CRate;
