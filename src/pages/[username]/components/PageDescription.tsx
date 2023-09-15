import React, { ReactNode } from 'react';
import styled, { withTheme } from 'styled-components';

interface Props {
  className?: string;
  children?: ReactNode;
}

export const PageDescription: React.FC<Props> = ({ className, children }) => {
  return <p className={className}>{children}</p>;
};

export default withTheme(styled(PageDescription)`
  text-align: center;
  color: var(--pallete-text-main);
  margin: 0 0 23px;
  ${({ theme }) =>
    theme?.additional?.descriptionSize &&
    `font-size:${theme?.additional?.descriptionSize};`};
  ${({ theme }) =>
    theme?.additional?.descriptionSize
      ? `line-height:calc(${theme?.additional?.descriptionSize} + 5px)`
      : 'line-height : 21px'};
  ${({ theme }) =>
    theme?.additional?.descriptionColor &&
    `color:${theme?.additional?.descriptionColor};`}
`);
