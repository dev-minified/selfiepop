import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { chargeUser, fetchCards } from 'api/billing';
import CardForm from 'components/AddCard/CardForm';
import Modal from 'components/modal';
import Button from 'components/NButton';
import PaymentWidget from 'components/PaymentWidget';
import Scrollbar from 'components/Scrollbar';
import { toast } from 'components/toaster';
import UserCards from 'components/UserCards';
import { STRIPE_PUBLIC_KEY } from 'config';
import { ServiceType } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import useRequestLoader from 'hooks/useRequestLoader';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { setCallbackForPayment } from 'store/reducer/cardModal';
import { setOrder } from 'store/reducer/checkout';
import {
  setPrimaryCard,
  setUserCards as setFirstUserCards,
} from 'store/reducer/global';
import styled from 'styled-components';
import { useAnalytics } from 'use-analytics';

const apikey = STRIPE_PUBLIC_KEY;

const stripePromise = loadStripe(apikey === undefined ? '' : apikey);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  onCheckoutComplete?: (order: any) => void | Promise<any>;
}

const CheckoutModal: React.FC<Props> = ({
  isOpen,
  onClose,
  className,
  onCheckoutComplete,
}) => {
  const { user, setUser } = useAuth();
  const history = useHistory();
  const analytics = useAnalytics();

  const dispatch = useAppDispatch();

  const order = useAppSelector((state) => state.checkout.order);
  // const [isAgeSet, setIsAgeSet] = useState(true);
  const { withLoader, setLoading } = useRequestLoader();

  const [userCards, setUserCards] = useState([]);

  const [card, setCard] = useState();

  const fetchBillingCards = async () => {
    // FIXME: In case on guest user there no Stripe Customer ID
    const response = await withLoader(fetchCards());
    setUserCards(response?.sources || []);
    setCard(response?.sources.find((item: any) => item.isPrimary));
    // if (!!response?.sources?.length) {
    //   setIsAgeSet(true);
    // }
    return response;
  };
  const fetchFirstBillingCards = async () => {
    // FIXME: In case on guest user there no Stripe Customer ID
    try {
      if (!!user?._id) {
        const response = await fetchCards({
          ignoreStatusCodes: [500],
        });
        dispatch(setFirstUserCards(response?.sources || []));
        dispatch(
          setPrimaryCard(
            response?.sources.find((item: any) => item.isPrimary) || {},
          ),
        );
        return response;
      }
    } catch (error) {}
  };
  useEffect(() => {
    fetchBillingCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onNext = useCallback(
    async (user: any) => {
      try {
        setLoading(true);
        if (user?.stripe?.customerId) {
          dispatch(
            setCallbackForPayment({
              callback: () =>
                chargeUser(
                  {
                    orderId: order?._id,
                    isCreatingIntent: !!order?.price,
                  },
                  null,
                  dispatch,
                ),
            }),
          );
          const res = await chargeUser(
            {
              orderId: order?._id,
              isCreatingIntent: !!order?.price,
            },
            null,
            dispatch,
          );
          if (res?.success) {
            analytics.track('new_subscription', {
              purchasedFrom: order?.seller?._id,
              member_level_id: ServiceType.CHAT_SUBSCRIPTION,
              purchaseAmount: 0,
            });
            analytics.track('purchase_end', {
              purchasedFrom: order?.seller?._id,
              purchaseTypeSlug: order?.popId?.popType,
              purchaseAmount: order?.price,
              itemId: order?.popId?._id,
            });
          }
          dispatch(setOrder(res?.updatedOrder));
          try {
            await onCheckoutComplete?.({
              ...res?.updatedOrder,
              seller: order.seller,
            });
            onClose();
            setLoading(false);
          } catch (error) {
            onClose();
            setLoading(false);
          }
        }
      } catch (e: any) {
        setLoading(false);
        if (e && e?.message) {
          toast.error(e?.message);
        }
        console.error(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [order, dispatch, history, setUser],
  );
  const RenderPaymentWidget = useCallback(() => {
    return (
      <>
        <PaymentWidget className="mb-30" order={order} seller={order?.seller} />
        <hr className="d-none" />
      </>
    );
  }, [order, order?.seller]);
  const requestPaymentButton = ({ isLoading, ...props }: any) => {
    const platformFee = !!order?.price
      ? (order?.orderPlatformFee / 100) * order?.price + 0.5
      : 0;
    const Price = (order?.price + platformFee || 0).toFixed(2);
    return (
      <div>
        <>
          <RenderPaymentWidget />
        </>
        <div className="d-flex justify-content-center">
          <Button
            type="primary"
            size="x-large"
            block
            isLoading={isLoading}
            disabled={isLoading}
            className="mb-0"
            htmlType="submit"
            {...props}
          >
            {order?.price + platformFee > 0 ? `Order for $${Price}` : `Order`}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      showHeader
      title="Cards Detail"
      showFooter={false}
      onClose={onClose}
      className={`${className} checkout-modal`}
    >
      <Scrollbar autoHeight autoHeightMax={'calc(100vh - 118px)'}>
        <div className="mb-2">
          {!!userCards.length ? (
            <UserCards
              userCards={userCards}
              primaryCard={card}
              fetchBillingCards={fetchBillingCards}
              requestPaymentButton={requestPaymentButton}
              onSubmit={onNext}
              isPlaceholderDisabled={true}
            />
          ) : (
            <Elements stripe={stripePromise}>
              <CardForm
                totalCards={0}
                onFirstBillingCallback={fetchFirstBillingCards}
                functions={{ onSave: onNext }}
                elementsProps={{ Save: requestPaymentButton }}
                visibility={true}
                showEmailField={false}
                disableEmail={true}
                onOpenSignInPop={false}
                isQuestionRequired={false}
              />
            </Elements>
          )}
        </div>
      </Scrollbar>
    </Modal>
  );
};

export default styled(CheckoutModal)`
  &.modal-dialog {
    max-width: 540px;
  }

  .modal-body {
    padding: 0;

    .rc-scollbar {
      padding: 0 15px 15px;
    }
  }
`;
