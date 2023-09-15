import { LockIcon } from 'assets/svgs';
import Modal from 'components/modal';
import Button from 'components/NButton';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
type Props = {
  onClose?: (...args: any) => void;
  isOpen: boolean;
  title?: string;
  items?: any;
  message?: string;
  submitHandler?: Function;
  className?: string;
  isloading?: boolean;
};
const UnlockModal = ({
  onClose,
  isOpen,
  className,
  title,
  message,
  submitHandler,
  items,
  isloading = false,
}: Props) => {
  const [openupModel, setOpenupModel] = useState(false);

  useEffect(() => {
    setOpenupModel(!!isOpen);
  }, [isOpen]);
  const handleClose = () => {
    onClose?.(!openupModel);
    setOpenupModel(!openupModel);
  };

  return (
    <Modal
      className={`${className} modal-post`}
      onClose={onClose}
      title={
        <span>
          <LockIcon />
          {title && title}
        </span>
      }
      showFooter={false}
      isOpen={isOpen}
    >
      <span className="modal-description">{message && message}</span>
      <div className="price-description">
        <div className="cost-detail">
          <span className="cost-type">Unlock Price:</span>
          <span className="amount">
            $&nbsp;{Number(items?.membership?.viewPrice || 0).toFixed(2)}
          </span>
        </div>
        <div className="total-cost">
          <span className="cost-title">Total</span>
          <span className="amount">
            $&nbsp;
            {Number(Number(items?.membership?.viewPrice || 0).toFixed(2))}
          </span>
        </div>
      </div>
      <div className="btns-actions">
        <Button
          type="text"
          size="small"
          onClick={() => handleClose()}
          className="button-close"
        >
          CANCEL
        </Button>
        <Button
          size="small"
          disabled={isloading}
          isLoading={isloading}
          onClick={() =>
            submitHandler?.(
              items?._id,
              Number(Number(items?.membership?.viewPrice || 0).toFixed(2)),
            )
          }
          type="text"
        >
          YES, UNLOCK
        </Button>
      </div>
    </Modal>
  );
};

export default styled(UnlockModal)`
  &.modal-post {
    &.modal-dialog {
      max-width: 376px;
      color: #495057;
      font-weight: 400;
      margin: 1rem auto;
    }

    .modal-content {
      padding: 22px 25px;
    }

    .modal-header {
      padding: 0;
      border: none;
      font-size: 16px;
      line-height: 20px;
      color: #252631;
      margin: 0 0 12px;

      .modal-title {
        font-size: 16px;
        line-height: 20px;
        color: #252631;
        font-weight: 500;
      }

      svg {
        margin: 0 20px 0 0;
      }

      .close {
        margin: 0;
        padding: 10px;
        position: absolute;
        right: 4px;
        top: 0;
      }
    }
    .modal-description {
      font-size: 16px;
      line-height: 22px;
      color: #495057;
      font-weight: 400;
      margin: 0 0 20px;
      display: block;
    }

    .modal-body {
      padding: 0;
    }

    .price-description {
      background: #f8fafd;
      border-radius: 4px;
      padding: 18px;
      font-size: 13px;
      line-height: 17px;
    }

    .cost-detail {
      color: #8c8c8c;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 19px;
      padding: 0 10px;
    }

    .total-cost {
      display: flex;
      position: relative;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
      padding: 15px 10px 0;

      .cost-title {
        color: #000;
      }

      &:before {
        border-top: 4px dashed #d0d0d0;
        left: 0;
        right: 0;
        top: -3px;
        content: '';
        position: absolute;
      }
    }

    .amount {
      font-size: 16px;
      line-height: 20px;
      color: #000;
      font-weight: 500;

      &.amount-fee {
        font-size: 13px;
      }
    }

    .btns-actions {
      justify-content: flex-end;
      padding: 20px 0 10px;

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
    }
  }
`;
