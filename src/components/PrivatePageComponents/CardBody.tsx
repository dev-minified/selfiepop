import { FC, ReactNode } from 'react';
import styled from 'styled-components';

interface ICardBodyProps {
  className?: string;
  caption?: ReactNode;
  bodyClass?: string;
  children?: ReactNode;
}

const CardBody: FC<ICardBodyProps> = ({
  className,
  caption,
  bodyClass,
  children,
}) => {
  return (
    <div className={`card-body ${className} ${bodyClass}`}>
      {caption && <>{caption}</>}
      <div>{children}</div>
    </div>
  );
};

export default styled(CardBody)``;
