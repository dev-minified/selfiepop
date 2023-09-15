import classNames from 'classnames';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';
interface IAppProps {
  label?: string | React.ReactElement;
  sublable?: string | React.ReactElement;
  className?: string;
  children?: ReactNode;
}

const App: FC<IAppProps> = ({ label, sublable, children, className }) => {
  const IClassName = classNames(className, { label, sublable });
  return (
    <div className={IClassName}>
      <div className="label-area mb-20">
        {label && <div className="label-title">{label}</div>}
        {sublable && <span className="description-text">{sublable}</span>}
      </div>
      {children}
    </div>
  );
};

export default styled(App)`
  h1,
  .h1,
  h2,
  .h2,
  h3,
  .h3,
  h4,
  .h4,
  h5,
  .h5,
  h6,
  .h6 {
    font-weight: 500;
  }
  .radio-holder > div {
    margin: 0 0 12px;
    display: flex;
    felx-direction: row;
    justify-content: space-between;

    .mb-15 {
      width: calc(50% - 10px);
    }
  }
  .label-title {
    font-size: 18px;
    line-height: 20px;
    font-weight: 500;
    margin: 0 0 10px;
  }

  .label-area {
    margin: 0 0 11px;
  }

  .label {
    display: block;
    margin: 0 0 8px;
    font-size: 15px;
    line-height: 18px;
    font-weight: 500;
  }

  .description-text {
    display: block;
    color: var(--pallete-text-main-300);
    font-size: 14px;
    line-height: 18px;
    color: var(--pallete-text-main-300);
    font-weight: 400;
  }

  .description-text strong {
    color: var(--pallete-text-main);
  }

  .form-control::placeholder {
    color: var(--pallete-text-main-500);
  }

  .text-input {
    .word-count {
      position: static;
      text-align: right;
      color: var(--pallete-text-main-300);
      font-size: 14px;
      line-height: 18px;
      padding: 5px 0 0;
    }
  }
`;
