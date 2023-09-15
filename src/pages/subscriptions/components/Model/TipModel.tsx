import { Dollar, DollarAlt } from 'assets/svgs';
import FocusInput from 'components/focus-input';
import Modal from 'components/modal';
import Button from 'components/NButton';
import { useAppSelector } from 'hooks/useAppSelector';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
type Props = {
  onClose?: (...args: any) => void;
  isOpen: boolean;
  title?: string;
  message?: string;
  submitHandler?: (amount: number) => void;
  className?: string;
};
const Amount = [1, 5, 10, 100];
const SendTipModal = ({
  onClose,
  isOpen,
  className,
  title,
  submitHandler,
}: Props) => {
  const [amount, setAmount] = useState(5);
  const isTipPaying = useAppSelector((state) => state.memberPost.isTipPaying);
  useEffect(() => {
    isOpen && setAmount(5);
  }, [isOpen]);
  return (
    <Modal
      className={`${className} modal-tip`}
      onClose={onClose}
      title={
        <span className="title-text">
          <DollarAlt />
          {title && title}
        </span>
      }
      showFooter={false}
      isOpen={isOpen}
    >
      <ul className="amount-tip">
        {Amount?.map((price) => (
          <li onClick={() => setAmount(price)} key={`${title}-${price}`}>
            <span className="amount">${price}</span>
          </li>
        ))}
      </ul>
      <div className="price-description">
        <div className="cost-detail">
          <span className="cost-type">Amount to Tip:</span>
          <FocusInput
            hasIcon={true}
            type="number"
            value={amount?.toString()}
            validations={[{ type: 'number' }]}
            icon={<Dollar />}
            onChange={(e) => {
              setAmount(Number(e.target.value));
            }}
          />
        </div>
        <div className="total-cost">
          <span className="cost-title">Total</span>
          <span className="amount">$&nbsp;{Number(amount).toFixed(2)}</span>
        </div>
      </div>
      <div className="btns-actions">
        <Button
          onClick={() => {
            submitHandler?.(amount);
          }}
          disabled={isTipPaying}
          isLoading={isTipPaying}
          type="primary"
          block
        >
          SEND TIP
        </Button>
      </div>
    </Modal>
  );
};

export default styled(SendTipModal)`
  &.modal-tip {
    &.modal-dialog {
      max-width: 322px;
      color: #495057;
      font-weight: 400;
      margin: 1rem auto;
    }

    .modal-content {
      padding: 20px;
    }

    .modal-header {
      padding: 0;
      border: none;
      font-size: 16px;
      line-height: 20px;
      color: #252631;
      margin: 0 0 19px;

      .modal-title {
        font-size: 16px;
        line-height: 20px;
        color: #252631;
        font-weight: 500;
      }

      .title-text {
        display: block;
      }

      svg {
        margin: 0 10px 0 0;
        display: inline-block;
        vertical-align: middle;
        width: 20px;
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
      padding: 13px;
      font-size: 13px;
      line-height: 17px;
      margin: 0 -10px;
    }

    .cost-detail {
      color: #8c8c8c;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 15px;
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
        min-width: inherit;
        padding: 8px 18px;

        &.btn-cancel {
          color: #97bdd2;

          &:hover {
            color: #9fa8da;
          }
        }
      }
    }

    .amount-tip {
      margin: 0 -4px 10px;
      position: relative;
      overflow: hidden;
      padding: 0;
      list-style: none;
      display: flex;
      flex-wrap: wrap;

      li {
        padding: 0 4px;
        margin: 0 0 8px;
      }

      .amount {
        font-size: 16px;
        line-height: 20px;
        font-weight: 500;
        color: #000;
        padding: 3px 5px;
        border-radius: 15px;
        min-width: 64px;
        text-align: center;
        display: inline-block;
        vertical-align: top;
        border: 2px solid rgba(15, 139, 186, 0.21);
        cursor: pointer;
        transition: all 0.4s ease;

        &:hover,
        &.active {
          color: #fff;
          border-color: var(--pallete-primary-main);
          background: var(--pallete-primary-main);
        }
      }
    }

    .text-input {
      margin-bottom: 0 !important;
      width: 108px;

      input[type='number']::-webkit-inner-spin-button,
      input[type='number']::-webkit-outer-spin-button {
        appearance: none;
        -webkit-appearance: none;
      }

      .icon {
        margin: -2px 0 0;
        left: 4px;
      }

      .form-control {
        border-color: #e6ebf5;
        background: none;
        height: 40px;
        padding: 5px 17px 4px;
        text-align: right;
        color: #000;
      }
    }
  }
`;
