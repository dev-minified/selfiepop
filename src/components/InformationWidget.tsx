import classNames from 'classnames';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';

interface IAppProps {
  className?: string;
  small?: boolean;
  icon?: boolean;
  children?: ReactNode;
}

const InformationWidget: FC<IAppProps> = ({
  className,
  small = false,
  icon = true,
  children,
}) => {
  return (
    <div className={classNames('info-widget', className, { sm: small })}>
      {icon && <span className="icon-info"></span>}
      <p>{children}</p>
    </div>
  );
};

export default styled(InformationWidget)`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: var(--pallete-text-main-800);
  margin: 0 0 14px;
  font-size: 14px;

  .icon-info {
    font-size: 40px;
    line-height: 1;
    margin: 0 12px 0 0;
    opacity: 0.5;
    color: '#F51B5';
  }

  p {
    margin: 0;
    font-style: italic;
  }

  .text-block {
    color: var(--pallete-text-main);
  }

  .sm {
    max-width: 498px;
    margin-left: auto;
    margin-right: auto;
  }
`;
