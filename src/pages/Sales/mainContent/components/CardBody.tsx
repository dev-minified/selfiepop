import { ReactElement, ReactNode } from 'react';
import styled from 'styled-components';

interface ICardBodyProps {
  className?: string;
  bodyClass?: string;
  children?: string | ReactElement | ReactNode | HTMLElement | any;
}

const CardBody: React.FunctionComponent<ICardBodyProps> = ({
  className,
  bodyClass,
  children,
}) => {
  return (
    <div className={`card-body ${className} ${bodyClass}`}>{children}</div>
  );
};

export default styled(CardBody)``;
