import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';

const SectionTitle: React.FC<{ className?: string; children?: ReactNode }> = ({
  className,
  children,
}) => {
  return <h3 className={className}>{children}</h3>;
};

export default styled(SectionTitle)`
  font-size: 19px;
  ${({ theme }) =>
    theme?.additional?.sectionTitleSize &&
    css`
      font-size: ${theme?.additional?.sectionTitleSize};
    `};

  ${({ theme }) =>
    theme?.additional?.sectionTitleColor &&
    css`
      color: ${theme?.additional?.sectionTitleColor};
    `}
`;
