// import { StarFill } from 'assets/svgs';
import { FireIcon } from 'assets/svgs';
import Model from 'components/modal';
import Button from 'components/NButton';
import PaymentWidget from 'components/PaymentWidget';
import { RequestLoader } from 'components/SiteLoader';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useProfileSubCheckout from 'hooks/useProfileSubCheckout';
import { ReactElement, useEffect, useState } from 'react';
import { setOrder } from 'store/reducer/checkout';
import styled from 'styled-components';

type Props = {
  onClose?: (...args: any) => void;
  isOpen?: boolean;
  className?: string;
  onSubscribe?: () => void;
  item: any;
  pop: any;
  seller?: Partial<IUser>;
  title?: string;
};
const PageLoaderWrapper = styled(RequestLoader)`
  position: fixed;
  left: 50%;
  top: 50%;
`;
function SubscribeModel({
  onClose,
  className,
  item,
  onSubscribe,
  isOpen = false,
  seller,
  pop,
  title = 'Renew your monthly subscription to',
}: Props): ReactElement {
  const order = useAppSelector((state) => state.checkout.order);
  const { onSubscribeForChat, checkout } = useProfileSubCheckout();
  const [loading, setIsLoading] = useState(false);
  const [ordercreating, setIsOrdercreating] = useState(false);
  const user = useAuth()?.user;
  const dispatch = useAppDispatch();
  const createOrder = async () => {
    try {
      setIsOrdercreating(true);
      const order = await onSubscribeForChat(pop?.popLinksId, item);

      dispatch(setOrder(order));
      setIsOrdercreating(false);
    } catch (error) {
      setIsOrdercreating(false);
    }
  };
  useEffect(() => {
    const isNotSame = user?._id !== seller?._id;
    if (isNotSame) {
      if (order && order?.seletedPriceVariation?._id !== item?._id) {
        createOrder();
      } else if (!order?._id) {
        createOrder();
      }
    }
  }, [pop?.popLinksId?._id]);
  const handleClose = () => {
    onClose && onClose();
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await checkout(order);
      onSubscribe?.();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  return (
    <Model
      className={className}
      isOpen={isOpen}
      shouldCloseOnOverlayClick={false}
      title={
        <div className="title-holder user_list">
          <span className="title-area">
            <span className={`title-icon`}>{<FireIcon />}</span>
            <span className="title-text">{'Subscription'}</span>
          </span>
        </div>
      }
      showFooter={false}
      onClose={handleClose}
    >
      <div className={''}>
        {!ordercreating ? (
          <div className="list">
            <div className="list_items">
              {order ? (
                <div className="paymentwidget-wrap">
                  <PaymentWidget
                    order={order}
                    seller={seller}
                    title={
                      <>
                        {title}&nbsp;{' '}
                        <span className="subscription-name">
                          {seller?.pageTitle}
                        </span>
                        &nbsp;?
                      </>
                    }
                  />
                </div>
              ) : null}
            </div>

            <div className="action_buttons package-detail-area">
              <Button
                className="btn-note button-close"
                size="small"
                onClick={handleClose}
              >
                NO
              </Button>
              <Button
                onClick={handleSubmit}
                className="btn-note"
                size="small"
                isLoading={loading}
                disabled={loading || ordercreating}
              >
                YES
              </Button>
            </div>
          </div>
        ) : (
          <PageLoaderWrapper
            isLoading={true}
            className="mt-5"
            width="2.5em"
            height="2.5em"
            color="var(--pallete-primary-main)"
          />
        )}
      </div>
    </Model>
  );
}

export default styled(SubscribeModel)`
  max-width: 375px;

  .modal-header {
    padding: 15px 20px 10px;
    border: none;
    /* color: #c30585; */

    .title-icon {
      display: inline-block;
      vertical-align: middle;
      margin: 0 15px 0 0;
      width: 14px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    .title-text {
      display: inline-block;
      vertical-align: middle;
    }
  }

  .modal-title {
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    flex-grow: 1;
    flex-basis: 0;

    .title-holder {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .modal-body {
    padding: 0;

    .pre-loader {
      left: 0;
    }
  }

  .modal-content {
    border-radius: 6px;
    overflow: hidden;
    border: none;
  }

  .list_items {
    max-height: calc(100vh - 170px);
    overflow: auto;

    h3 {
      margin: 0 0 15px !important;
      font-size: 16px;
      line-height: 22px;
      color: #495057;
      font-weight: 400;

      .subscription-name {
        color: #000;
        font-weight: 500;
      }
    }
  }

  .list_item {
    padding: 0 30px 0 65px;
    font-size: 13px;
    line-height: 16px;
    font-weight: 400;
    color: #a9a8a8;
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    position: relative;

    &:last-child {
      .list_desc {
        border-bottom: none;
      }
    }

    .list_desc {
      padding: 15px 0;
      border-bottom: 1px solid #e6ebf5;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
    }

    .checkbox [type='checkbox']:checked + .custom-input-holder .custom-input {
      background: var(--pallete-primary-main);
      border-color: var(--pallete-primary-main);

      &:before {
        color: #fff;
      }
    }

    .checkbox .custom-input {
      border-radius: 100%;
      width: 25px;
      height: 25px;
      background: #fff;
      border-color: #dad8d8;

      &:before {
        font-size: 11px;
      }

      &:after {
        display: none;
      }
    }

    .title {
      display: block;
      font-size: 17px;
      line-height: 22px;
      color: #000;
      margin: 0 0 10px;
      font-weight: 500;
    }

    label {
      padding: 0;
      position: absolute;
      left: 20px;
      top: 20px;
    }
  }

  .list-title {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    padding: 0 20px 0 0;

    @media (max-width: 479px) {
      padding: 0 10px 0 0;
    }
  }

  .price {
    display: block;
    font-size: 17px;
    line-height: 22px;
    color: #000;
    font-weight: 500;
  }

  .package-detail {
    text-align: right;
  }

  .duration {
    display: block;
    font-size: 12px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.46);
  }

  .action_buttons {
    display: flex;
    justify-content: flex-end;
    padding: 13px 15px;
    /* border-top: 1px solid #e6ebf5; */
    align-items: center;
    font-weight: 400;

    /* &.package-detail-area {
      justify-content: space-between;
      background: var(--pallete-background-gray-darker);
      font-size: 14px;
      line-height: 20px;
      color: var(--pallete-text-main);
    } */

    .update-info {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
      padding: 0 10px 0 0;
    }

    .button {
      min-width: inherit;
      font-size: 16px;
      line-height: 20px;
      margin-bottom: 0;
    }
  }

  .btn-note {
    color: #357ea9;
    text-transform: uppercase;
    background: transparent;
    padding: 3px 10px;

    &:hover {
      color: #fff;
    }

    &.button-sm {
      padding: 3px 10px;
    }

    svg {
      width: 14px;
    }
  }

  .loader-holder {
    padding: 20px;
    text-align: center;
  }

  .payment-block {
    padding: 0 20px;

    .widget-payment {
      padding: 15px;
      background: #f8fafd;
      border-radius: 5px;

      &:before,
      &:after {
        display: none;
      }
    }

    .payment-list {
      font-size: 16px;
      line-height: 24px;

      li {
        margin: 0 0 8px;

        &.service-fee {
          margin: 0 0 12px;
          font-size: 13px;

          .price {
            font-size: 13px;
          }
        }

        &:last-child {
          margin: 0;
          border-top: 1px dashed #d0d0d0;
          padding: 12px 0 0;
        }
      }

      .title {
        font-weight: 500;
      }
    }
  }
`;
