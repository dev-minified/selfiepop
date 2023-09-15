import RCTooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import { TooltipProps } from 'rc-tooltip/lib/Tooltip';
import React from 'react';

const Tooltip: React.FC<TooltipProps> = ({
  children,
  overlay,
  ...props
}: any) => {
  return (
    <RCTooltip placement="top" overlay={<span>{overlay}</span>} {...props}>
      {children}
    </RCTooltip>
  );
};

export default Tooltip;
