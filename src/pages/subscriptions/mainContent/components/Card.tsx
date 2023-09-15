import { ReactElement, ReactNode } from 'react';
import styled from 'styled-components';
import CardBody from './CardBody';
import CardFooter from './CardFooter';
import CardHeader from './CardHeader';

type ICardProps = {
  className?: string;
  cardClass?: string;
  children?: string | ReactElement | ReactNode | HTMLElement | any;
  [key: string]: any;
};

const Card = function ({ className, cardClass, children }: ICardProps) {
  return (
    <div className={`${className} ${cardClass} pop-card`}>
      <div className="card-main-body">{children}</div>
    </div>
  );
};

type IProfileCardHeaderProps = {
  title?: string;
  subTitle?: string;
  img?: string;
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
  background: var(--pallete-background-secondary-light);
  border: 1px solid var(--pallete-colors-border);
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  padding: 20px;
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
  color: #525367;
  margin: 0 0 20px;

  .title {
    color: var(--pallete-text-main-150);
  }

  .card-header-area {
    display: flex;
    align-items: flex-start;
    margin: 0 0 4px;

    .icon {
      width: 46px;
      height: 46px;
      border-radius: 100%;
      overflow: hidden;
      margin: 0 18px 0 0;
      background: var(--pallete-background-default);
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 70%;
        height: 70%;
      }
    }

    .header-detail-area {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
    }

    h3 {
      font-size: 18px;
      line-height: 22px;
      font-weight: 500;
      margin: 0 0 7px;
      color: var(--pallete-text-lighter-150);
    }
  }

  .card-body {
    padding: 0;

    p {
      margin: 0 0 14px;
    }
  }

  .list-detail {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 13px;
    line-height: 15px;
    font-weight: 500;
    color: var(--pallete-text-main-150);

    strong {
      font-weight: 500;
    }

    li {
      padding: 0 42px 0 0;
      margin: 0 0 10px;

      @media (max-width: 1199px) {
        padding: 0 20px 0 0;
      }
    }

    .val {
      color: var(--pallete-text-lighter-150);
    }

    .status-val {
      position: relative;
      padding-left: 25px;
    }

    .status {
      position: absolute;
      left: 8px;
      top: 3px;
      width: 10px;
      height: 10px;
      border-radius: 100%;
      background: rgb(10, 73, 123);
      &.status-Pending {
        background: rgb(241, 194, 50);
      }
      &.status-Inprogress {
        background: rgb(153, 219, 243);
      }
      &.status-Refunded {
        background: rgb(255, 133, 133);
      }
      &.status-Canceled {
        background: rgb(194, 194, 194);
      }
      &.status-Disputed {
        background: rgb(236, 243, 153);
      }
      &.status-Completed {
        background: rgb(51, 189, 0);
      }
    }
  }

  .button.btn-details {
    font-size: 16px;
    line-height: 20px;
    padding: 12px 15px;
  }
`;
