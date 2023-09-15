import { getOrder } from 'api/Order';
import AvatarStatus from 'components/AvatarStatus';
import Modal from 'components/modal';
import Button from 'components/NButton';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
type Props = {
  onClose?: (...args: any) => void;
  isOpen: boolean;

  sub?: ISubcription;
  submitHandler?: (...args: any) => void | Promise<any>;
  className?: string;
  isloading?: boolean;
  shouldCloseOnOverlayClick?: boolean;
};
const ActivateSubModal = ({
  onClose,
  isOpen,
  className,
  submitHandler,
  sub,
  isloading = false,
  shouldCloseOnOverlayClick = true,
}: Props) => {
  const [openupModel, setOpenupModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [platformFees, setPlatformFee] = useState<number>(5);
  const [amount, setAmount] = useState<number>(0);
  const [priceVariation, setPriceVariation] = useState(sub?.priceVariation);
  useEffect(() => {
    setOpenupModel(!!isOpen);
  }, [isOpen]);
  const getOrderFromId = async (amount: number) => {
    if (sub?.orderId) {
      try {
        setLoading(true);
        const order = await getOrder(sub?.orderId);
        // const orderPlatformFee = _.get(order, 'orderPlatformFee', 5);
        if (order._id) {
          if (order?.orderPlatformFee != null) {
            const buyerFees =
              parseFloat(
                ((amount * order?.orderPlatformFee) / 100).toFixed(2),
              ) + 0.5;
            setPlatformFee(buyerFees);
          }
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    if (sub?.oldPriceVariation?._id) {
      setPriceVariation(sub.oldPriceVariation);
    }
    getOrderFromId(priceVariation?.price || 0);
    setAmount(priceVariation?.price || 0);

    setOpenupModel(!!isOpen);
  }, [sub]);
  const handleClose = () => {
    onClose?.(!openupModel);
    setOpenupModel(!openupModel);
  };

  return (
    <Modal
      className={`${className} activate-sub`}
      onClose={onClose || handleClose}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      showFooter={false}
      isOpen={isOpen}
    >
      <div className="reactivateSub">
        <AvatarStatus
          src={sub?.sellerId?.profileImage}
          imgSettings={{ onlyDesktop: true }}
        />
        <span className="name">
          {sub?.sellerId?.pageTitle || 'Incognito User'}
        </span>
        <div className="user-detail">
          <span className="user-name">@{sub?.sellerId?.username}</span>
          <span className="duration">
            Last seen {dayjs(sub?.sellerId?.offlineAt).utc().fromNow()}
          </span>
        </div>
        <h3>Renew Subscription</h3>
        <div className="price-area">
          {priceVariation?.title && (
            <div className="box-info category-list">
              <span className="title">{priceVariation?.title}</span>{' '}
              <span className="detail">${Number(amount || 0).toFixed(2)}</span>
            </div>
          )}
          {priceVariation?.title && (
            <div className="box-info total-amount">
              <span className="title">Platfrom Fee</span>{' '}
              <span className="detail">${platformFees}</span>
            </div>
          )}
          {priceVariation?.title && (
            <div className="box-info total-amount">
              <span className="title">Total</span>{' '}
              <span className="detail">
                ${Number((amount || 0) + platformFees).toFixed(2)}
              </span>
            </div>
          )}
        </div>
        <Button
          block
          disabled={isloading || loading}
          isLoading={isloading}
          onClick={() =>
            submitHandler?.(sub, Number(amount + platformFees).toFixed(2))
          }
          size="large"
        >
          <span className="btn-title">RENEW</span>
          <span className="amount">
            $&nbsp;{Number(amount + platformFees).toFixed(2)}
          </span>
        </Button>
      </div>
    </Modal>
  );
};

export default styled(ActivateSubModal)`
  &.activate-sub {
    &.modal-dialog {
      max-width: 358px;
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

      .close {
        margin: 0;
        padding: 10px;
        position: absolute;
        right: 4px;
        top: 0;
      }
    }

    .user-image {
      width: 96px;
      height: 96px;
      margin: 0 auto 5px;
    }

    .name {
      display: block;
      text-align: center;
      font-size: 20px;
      line-height: 24px;
      color: #000;
      font-weight: 500;
      margin: 0 0 5px;
    }

    .user-detail {
      font-size: 15px;
      line-height: 18px;
      color: #888da8;
      text-align: center;
      margin: 0 0 5px;

      span {
        display: inline-block;
        vertical-align: top;
        padding: 0 10px;
      }

      .duration {
        position: relative;

        &:before {
          position: absolute;
          left: 0;
          width: 3px;
          height: 3px;
          border-radius: 100%;
          content: '';
          background: #888da8;
          top: 50%;
          transform: translate(0, -50%);
        }
      }
    }

    h3 {
      font-size: 20px;
      line-height: 28px;
      color: #000;
      margin: 0 0 12px;
      font-weight: 500;
      text-align: center;
    }

    .modal-body {
      padding: 0;
    }

    .box-info {
      color: #000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 10px;
      font-size: 17px;
      line-height: 24px;
      font-weight: 500;

      &.service-fee {
        font-size: 13px;
        color: #a3a3a3;
      }

      &:last-child {
        margin: 0;
      }

      .detail {
        font-weight: 700;
      }
    }

    .price-area {
      padding: 12px 0;
      position: relative;
      overflow: hidden;
      margin: 0 0 25px;

      &:before,
      &:after {
        left: 0;
        right: 0;
        height: 4px;
        top: -3px;
        border-top: 4px dashed rgba(103, 97, 109, 0.37);
        content: '';
        position: absolute;
      }

      &:after {
        top: auto;
        bottom: -3px;
      }
    }

    .button {
      border-radius: 40px;
      .text-button {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      &:not(:hover) {
        background: #000;
        color: #fff;
      }
    }
  }
`;
