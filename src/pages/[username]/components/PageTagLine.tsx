import H3 from 'components/Typography';
import React, { ReactNode } from 'react';
import styled, { withTheme } from 'styled-components';

interface Props {
  className?: string;
  children?: ReactNode;
}

export const PageTagLine: React.FC<Props> = ({ className, children }) => {
  return <H3 className={className}>{children}</H3>;
};

export default withTheme(styled(PageTagLine)`
  text-align: center;
  color: var(--pallete-text-main);
  margin: 0 0 9px;
  ${({ theme }) =>
    theme?.additional?.taglineSize &&
    `font-size:${theme?.additional?.taglineSize};`}
  ${({ theme }: any) =>
    theme?.additional?.taglineColor &&
    `color:${theme?.additional.taglineColor};`}
`);
