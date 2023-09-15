// import 'cropperjs/dist/cropper.css';
import classNames from 'classnames';
import 'rc-slider/assets/index.css';
import React, { CSSProperties } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import Button from './NButton';
Modal.setAppElement('#root');

interface IStyle {
  model?: CSSProperties;
  header?: CSSProperties;
  body?: CSSProperties;
  content?: CSSProperties;
  overlayStyle?: CSSProperties;
  footer?: CSSProperties;
  dialog?: CSSProperties;
}

const Model = ({
  isOpen,
  onClose,
  title,
  children,
  onOk,
  footerChange,
  confirmLoading,
  isDisabled,
  showHeader = true,
  showFooter = true,
  sumbitTitle = 'Save',
  styles = {},
  className,
  shouldCloseOnOverlayClick = true,
}: {
  isOpen: boolean;
  onClose?: any;
  title?: string | React.ReactNode;
  onOk?: Function;
  confirmLoading?: boolean;
  isDisabled?: boolean;
  children?: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  footerChange?: boolean;
  styles?: IStyle;
  className?: string;
  sumbitTitle?: string;
  shouldCloseOnOverlayClick?: boolean;
}) => {
  const {
    model: modelStyle,
    content: contentStyle,
    overlayStyle,
    body: bodyStyle,
  } = styles;

  const onOkHanlder = async () => {
    if (onOk) {
      return await onOk();
    }
  };
  const onCloseHanlder = () => {
    onClose && onClose();
  };
  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      onRequestClose={onClose}
      className={classNames(className, 'modal-dialog')}
      style={{
        content: { ...modelStyle },
        overlay: {
          zIndex: 12,
          backgroundColor: 'rgba(0,0,0,0.6)',
          ...overlayStyle,
        },
      }}
    >
      <div className="modal-content" style={contentStyle}>
        {showHeader && (
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>

            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={onCloseHanlder}
              id="sp_test_modal_close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}
        <div className="modal-body" style={bodyStyle}>
          {children}
        </div>
        {showFooter && (
          <div className="modal-footer text-right">
            {/* we can remove the type for cancel button and chagne the type to primary for save button and remove the size from both ot them to go back to previous viwe */}
            <Button
              onClick={onCloseHanlder}
              isLoading={false}
              disabled={false}
              type="text"
              size="small"
              className="button-close"
              id="sp_test_modal_cancel"
            >
              Cancel
            </Button>
            <Button
              isLoading={confirmLoading}
              onClick={onOkHanlder}
              type="text"
              htmlType="submit"
              size="small"
              id="sp_test_modal_ok"
              disabled={confirmLoading || isDisabled}
            >
              {footerChange ? 'Leave' : sumbitTitle}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default styled(Model)`
  margin-left: auto;
  margin-right: auto;

  .modal-title {
    svg {
      path {
        fill: #000;
      }
    }
  }

  /* we can remove this styles if we have to revert back to default buttons tyles */
  .modal-footer {
    border: none;
    justify-content: flex-end !important;
    text-align: right !important;

    .button {
      margin: 0;

      + .button {
        margin-left: 14px;
      }
    }
  }

  .button {
    text-transform: uppercase;

    &.button-sm {
      min-width: inherit;
      font-size: 16px;
      line-height: 20px;
      padding: 5px 10px;
      color: #000;
      border: none;

      &:hover {
        background: var(--pallete-primary-main);
        color: #fff;
        border: none;
      }

      &.button-close {
        color: rgba(0, 0, 0, 0.4);

        &:hover {
          color: #fff;
        }
      }
    }
  }
`;
