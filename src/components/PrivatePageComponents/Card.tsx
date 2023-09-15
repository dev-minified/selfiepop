import { forwardRef, ReactElement, ReactNode } from 'react';
import styled from 'styled-components';
import CardBody from './CardBody';
import CardFooter from './CardFooter';
import CardHeader from './CardHeader';

type ICardProps = {
  className?: string;
  cardClass?: string;
  children?: ReactNode;
  fallbackComponent?: JSX.Element;
  [key: string]: any;
};

const Card: any = forwardRef(
  ({ className, cardClass, children, ...rest }: ICardProps, ref) => {
    return (
      <div
        className={`${className} ${cardClass} pop-card`}
        ref={ref as any}
        {...rest}
      >
        <div className="card-main-body">{children}</div>
      </div>
    );
  },
);

type IProfileCardHeaderProps = {
  title?: string | ReactElement | ReactNode;
  showRightView?: boolean;
  subTitle?: string;
  ontitleClick?: Function;
  img?: string;
  imgscreenSettings?: Record<string, any>;
  timeStamp?: ReactNode;
  [key: string]: any;
};

Card.Header = function (props: ICardProps & IProfileCardHeaderProps) {
  const { children, ...rest } = props;
  if (!children) {
    return <CardHeader {...rest} />;
  }
  return <div className={`card-Header ${rest.className}`}>{children}</div>;
};

type IProfileCardBodyProps = {
  caption?: string | ReactElement | ReactNode | any;
  bodyClass?: string;

  [key: string]: any;
};

Card.Body = function (props: ICardProps & IProfileCardBodyProps) {
  const { children, ...rest } = props;

  return <CardBody {...rest}>{children}</CardBody>;
};
type IProfileCardFooterProps = {
  footerCalss?: string;
  [key: string]: any;
};

Card.Footer = function (props: ICardProps & IProfileCardFooterProps) {
  const { children, ...rest } = props;

  return <CardFooter {...rest}>{children}</CardFooter>;
};

export default styled(Card)`
  padding: 20px;
  border: 1px solid var(--pallete-colors-border);
  border-radius: 4px;

  @media (max-width: 479px) {
    padding: 15px;
  }

  .card-private-area {
    background: var(--pallete-background-gray-100);
    border-radius: 4px;
    padding: 10px;
    position: relative;
    z-index: 2;
  }

  .card-body {
    padding: 0;
  }
`;
