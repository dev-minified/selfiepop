import { H1 } from 'components/Typography';
import React, { ReactNode } from 'react';
import styled, { withTheme } from 'styled-components';

interface Props {
  className?: string;
  children?: ReactNode;
}

export const PageTitle: React.FC<Props> = ({ className, children }) => {
  return <H1 className={className}>{children}</H1>;
};

export default withTheme(styled(PageTitle)`
  text-align: center;
  color: var(--pallete-text-main);
  margin: 0 0 10px;
  line-height: 1;
  ${({ theme }) =>
    theme?.additional?.titleSize &&
    `font-size:${theme?.additional?.titleSize};`}
  ${({ theme }) =>
    theme?.additional?.titleColor && `color:${theme?.additional?.titleColor};`}
`);
