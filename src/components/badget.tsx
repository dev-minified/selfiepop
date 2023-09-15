import { ReactElement } from 'react';
import styled, { CSSProperties } from 'styled-components';

interface Props {
  color?: string;
  className?: string;
  style?: CSSProperties;
  label?: string | ReactElement;
}

function Badget({ className, color, label }: Props): ReactElement {
  return (
    <div className={className}>
      <span className="rc-badget-dot" style={{ background: color }}></span>
      <span className="rc-badget-label">{label}</span>
    </div>
  );
}

export default styled(Badget)`
  .rc-badget-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    vertical-align: middle;
    border-radius: 50%;
    background-color: #d9d9d9;
    margin-right: 15px;
  }
`;
