import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { fetchCards } from 'api/billing';
import { InfoIcon } from 'assets/svgs';
import CardForm from 'components/AddCard/CardForm';
import Modal from 'components/modal';
import { STRIPE_PUBLIC_KEY } from 'config';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import React, { Fragment } from 'react';
import { setPrimaryCard, setUserCards } from 'store/reducer/global';
import styled from 'styled-components';

interface Props {
  isOpen: boolean;
  className?: string;
  onClose: () => void;
}

const apikey = STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(apikey === undefined ? '' : apikey);
const AddCardModal: React.FC<Props> = ({ isOpen, onClose, className }) => {
  const CallBackForPayment = useAppSelector(
    (state) => state.cardModal.callback,
  );
  const userCards = useAppSelector((state) => state.global.userCards);
  const dispatch = useAppDispatch();
  const { loggedIn, user } = useAuth();

  const fetchBillingCards = async () => {
    // FIXME: In case on guest user there no Stripe Customer ID

    if (loggedIn) {
      try {
        const response = await fetchCards();
        dispatch(setUserCards(response?.sources || []));
        dispatch(
          setPrimaryCard(
            response?.sources.find((item: any) => item.isPrimary) || {},
          ),
        );
      } catch (error) {
        console.error({ error });
      }
    }
  };
  return (
    <Modal
      className={className}
      title={
        <Fragment>
          <div className="modal-title-wrap">
            <span className="img-title">
              <InfoIcon />
            </span>
            <p>VALID CARD REQUIRED</p>
          </div>
          <span className="description-text">
            Please add a <strong>valid credit card</strong> in order to complete
            this purchase.
          </span>
        </Fragment>
      }
      isOpen={isOpen}
      showHeader
      showFooter={false}
      onClose={onClose}
    >
      <Elements stripe={stripePromise}>
        <CardForm
          totalCards={userCards?.length || 0}
          user={user}
          mode="light"
          functions={{
            onSave: () => {
              fetchBillingCards();
              onClose();
              CallBackForPayment?.callback?.();
            },
          }}
          showEmailField={false}
          visibility={true}
        />
      </Elements>
    </Modal>
  );
};

export default styled(AddCardModal)`
  width: 375px;

  .modal-content {
    padding: 20px;
  }

  .modal-header {
    padding: 0 0 15px;
    border: none;
  }

  .modal-body {
    padding: 0;
    border: none;
  }

  .modal-title-wrap {
    display: flex;
    align-items: center;
    font-size: 16px;
    line-height: 20px;
    text-transform: uppercase;
    color: #252631;
    font-weight: 500;
    margin: 0 0 15px;

    .img-title {
      margin: 0 15px 0 0;
      width: 18px;
      display: inline-block;
      vertical-align: top;
      height: 20px;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;

        path {
          fill: #000;
          opacity: 1;
        }
      }
    }

    p {
      margin: 0;
    }
  }

  .description-text {
    display: block;
    font-size: 16px;
    line-height: 22px;
    color: #495057;
    font-weight: 400;

    strong {
      color: #000;
    }
  }

  .creditcard-alt {
    margin: 0 !important;
    padding: 15px 15px 0;

    .mb-20 {
      margin: 0 0 15px !important;
    }

    .form-control {
      padding: 11px 12px 4px;
    }

    .button-primary {
      display: block;
      width: 100%;

      &:not(:hover) {
        background: #000;
        border-color: #000;
      }
    }
  }

  .input-wrap.cols {
    .text-input {
      width: calc(50% - 8px);

      &:nth-child(2) {
        width: calc(50% - 8px);
      }
    }
  }
`;
