import { FC, ReactNode } from 'react';
import styled from 'styled-components';

interface ICardFooterProps {
  className?: string;
  footerCalss?: string;
  children?: ReactNode;
}

const CardFooter: FC<ICardFooterProps> = ({
  className,
  footerCalss,
  children,
}) => {
  return (
    <div className={`card-Footer ${className} ${footerCalss}`}>
      <div>{children}</div>
    </div>
  );
};

export default styled(CardFooter)``;
