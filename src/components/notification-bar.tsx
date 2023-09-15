import React from 'react';
import 'styles/notification-bar.css';
import useOpenClose from '../hooks/useOpenClose';
const NotificationBar: React.FC<any> = ({
  locals: { message, button },
  onButtonClick,
  disabled,
}) => {
  // eslint-disable-next-line
  const [open, onOpen, onClose] = useOpenClose(true);
  const onClickHandler = () => {
    if (onButtonClick && !disabled) onButtonClick();
  };

  return (
    <div className={!open ? 'hide-from' : ''} style={{ maxHeight: '300px' }}>
      <div className="notification-bar info ">
        <div className="container sm-container d-flex justify-content-center justify-content-md-between align-items-center flex-wrap flex-md-nowrap">
          <div className="notification-bar__left-box text-center text-md-left mb-10 mb-md-0 pr-0 pr-md-10">
            <span className="notification-bar__title">
              <div className="icon icon-info"></div>Information:
            </span>
            {message}
          </div>
          <span onClick={onClose} className="notification-bar__close">
            <i className="icon icon-close"></i>
          </span>
          {button && (
            <div onClick={onClickHandler} className="btn-bar">
              Send Link
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBar;
