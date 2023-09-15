import { Cancel, Check, Information } from 'assets/svgs';
import React, { ReactElement, ReactNode } from 'react';
import { toast as rtoast, ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import styled from 'styled-components';

const toaster: React.FC<any> = (props) => {
  const { className } = props;
  return (
    <ToastContainer
      className={`${className}`}
      position="top-right"
      autoClose={5000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      icon={false}
      pauseOnHover
      limit={3}
      {...props}
    />
  );
};

const Element: React.FC<any> = ({
  Icon = <Check />,
  type,
  message,
  title: customTitle,
}: {
  Icon?: ReactElement | ReactNode;
  type: string;
  message: string;
  title?: string;
}) => {
  let title = 'Success';

  switch (type) {
    case 'info':
      title = 'Information';
      Icon = <Information />;
      break;
    case 'error':
      title = 'Error';
      Icon = <Cancel />;
      break;
  }
  return (
    <div className="toaster-wrap">
      <div className="title">
        <span className="icon">{Icon}</span>
        <span className="title-text"> {customTitle || title}</span>
      </div>
      <div className="description">{message}</div>
    </div>
  );
};
const error = (
  message: string,
  title?: string,
  options?: ToastOptions,
  Icon?: ReactElement | ReactNode,
) => {
  rtoast.error(
    <Element type="error" message={message} title={title} Icon={Icon} />,
    options,
  );
};
const info = (
  message: string,
  title?: string,
  Icon?: ReactElement | ReactNode,
  options?: ToastOptions,
) => {
  rtoast.info(
    <Element type="info" message={message} title={title} Icon={Icon} />,
    options,
  );
};
const success = (
  message: string,
  title?: string,
  Icon?: ReactElement | ReactNode,
  options?: ToastOptions,
) => {
  rtoast.success(
    <Element type="success" message={message} title={title} Icon={Icon} />,
    options,
  );
};
const warning = (
  message: string,
  title?: string,
  Icon?: ReactElement | ReactNode,
  options?: ToastOptions,
) => {
  rtoast.warning(
    <Element type="success" message={message} title={title} Icon={Icon} />,
    options,
  );
};

export const toast = { error, info, success, warning };

export default styled(toaster)``;
