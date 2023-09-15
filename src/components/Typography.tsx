import React, { ReactElement } from 'react';
import styled from 'styled-components';

interface ITypography extends React.HTMLProps<any> {
  sectionTitle?: boolean;
}

function TitleElement({ children, ...rest }: ITypography): ReactElement {
  return <h3 {...rest}>{children}</h3>;
}

function H1Element({ children, ...rest }: ITypography): ReactElement {
  return <h1 {...rest}>{children}</h1>;
}

function DashedBorder({ children, ...rest }: ITypography): ReactElement {
  return <span {...rest}>{children}</span>;
}

const H3 = styled(TitleElement)`
  ${({ sectionTitle }) =>
    sectionTitle &&
    `
display: block;
padding: 10px 0 25px;
`}

  ${({ theme }) =>
    theme?.additional?.iconColor &&
    `
color:${theme?.additional?.iconColor}
`}
`;

export const H1 = styled(H1Element)`
  margin: 0 0 2px;
  ${({ sectionTitle }) =>
    sectionTitle &&
    `
display: block;
padding: 10px 0 25px;
`}

  ${({ theme }) =>
    theme?.additional?.titleFontSize &&
    `
font-size:${theme?.additional.titleFontSize}
`}
`;

export const DashedLine = styled(DashedBorder)`
  display: block;
  width: 100%;
  height: 1px;
  overflow: hidden;
  position: relative;

  &:before {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    border-top: 4px dashed rgba(103, 97, 109, 0.37);
    content: '';
  }
`;

export default H3;
