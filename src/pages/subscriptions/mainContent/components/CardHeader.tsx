import { FC, ReactElement, ReactNode } from 'react';
import styled from 'styled-components';

interface ICardHeaderProps {
  className?: string;
  children?: string | ReactElement | ReactNode | HTMLElement | any;
}

const CardHeader: FC<ICardHeaderProps> = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

export default styled(CardHeader)``;
