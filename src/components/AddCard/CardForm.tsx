/* eslint-disable no-throw-literal */
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { addStripeCustomer, updateStripeCustomer } from 'api/billing';
import { AppAlert } from 'components/Model';
import NewButton from 'components/NButton';
import { useAppSelector } from 'hooks/useAppSelector';
import useAppTheme from 'hooks/useAppTheme';
import React, { useState } from 'react';
import styled from 'styled-components';
import { stripeColors } from 'theme/CommonColors';
import { useAnalytics } from 'use-analytics';
import useAuth from '../../hooks/useAuth';
import { validateEmail } from '../../util';
import FocusInput from '../focus-input';
const CreditCard = styled.div`
  overflow: hidden;
  padding: 36px;
  margin: 0 auto 15px;
  border: 1px solid var(--pallete-colors-border);
  border-radius: 5px;

  .img {
    position: absolute;
    right: 10px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .form-control {
    height: 44px;
    line-height: 20px;
    border-color: var(--pallete-colors-border);
    font-weight: 400;
    color: var(--pallete-text-main);
    padding: 17px 15px 3px;

    .sp_dark & {
      background: #505050;
      border-color: #505050;
    }

    .StripeElement {
      .ElementsApp {
        .InputElement {
          color: 'var(--pallete-background-default-revers)';
        }
      }
    }
  }

  .form-control:focus {
    border-width: 1px;
  }

  .text-input label {
    line-height: 20px;
    color: var(--pallete-text-lighter-50);
    top: 13px;
    font-weight: 400;
  }

  .text-input.input-active label {
    font-size: 14px;
    line-height: 16px;
    top: 3px;
    opacity: 0.7;
  }

  .text-input.input-active .form-control {
    border-width: 1px;
  }

  .input-wrap.cols {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }

  .input-wrap.cols .text-input {
    width: 70%;

    @media (max-width: 767px) {
      width: 60%;
    }
  }

  .input-wrap.cols .text-input:nth-child(2) {
    width: 26%;

    @media (max-width: 767px) {
      width: 35%;
    }
  }

  .max-holder {
    max-width: 525px;
    margin: 0 auto;
    padding: 0 0 10px;
  }

  &.add-style {
    border-radius: 3px;
    border: none;
    background-color: var(--pallete-background-gray-darker);
    max-width: inherit;
    padding: 20px;

    .max-holder {
      max-width: inherit;
      padding: 0;
    }

    .form-control {
      height: 40px;
      padding-top: 13px;

      &.input-focus {
        border-color: var(--pallete-primary-main);
      }
    }
  }

  @media (max-width: 767px) {
    padding: 15px;

    .form-control {
      font-size: 14px;
    }

    .text-input label {
      font-size: 14px;
    }

    &.add-style {
      padding-left: 10px;
      padding-right: 10px;
    }
  }
`;

const CardForm = ({
  totalCards,
  reload,
  visibility,
  elementsProps,
  functions,
  showEmailField = false,
  onOpenSignInPop,
  disableEmail,
  updateGuestUser,
  isButtonDisable = false,
  isQuestionRequired,
  isOwnProfile = false,
  onStopPOPupOpen = null,
  onGuestInputChange,
  onFirstBillingCallback,
  mode: cardMode,
}: any) => {
  const { user, setUser } = useAuth();
  const analytics = useAnalytics();
  const guestUser = useAppSelector((state) => state.checkout.guestUser);
  // const dispatch = useAppDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const appmode = useAppTheme().mode;
  const mode = cardMode || appmode || 'light';
  const colors = (stripeColors as any)?.[mode as any];
  const [loading, setloading] = useState(false);
  const [cardName, setCardName] = useState<any>('');
  const [email, setEmail] = useState('');
  const validation = () => {
    if (isQuestionRequired)
      throw {
        message: 'You must answer all the required questions before booking',
        title: 'Incomplete Fields',
      };
    if (cardName.length < 2) throw new Error('Please enter your name on card');
    if (showEmailField && !disableEmail) {
      if (!validateEmail(email)) {
        throw new Error('Please enter valid email address');
      }
    }
    return true;
  };

  const restForm = () => {
    if (elements !== null) {
      setCardName('');
      const num = elements.getElement(CardNumberElement);
      num?.clear();
      const cvc = elements.getElement(CardCvcElement);
      cvc?.clear();
      const expiry = elements.getElement(CardExpiryElement);
      expiry?.clear();
    }
  };

  const sendFirstBilling = async () => {
    if (isOwnProfile && onStopPOPupOpen) {
      onStopPOPupOpen();
      return;
    }
    setloading(true);
    try {
      validation();
      const { token, error }: any = await fetchStripeToken();
      if (error !== undefined) {
        throw error.message;
      }
      const userData = user?._id
        ? { ...user }
        : guestUser?.data?._id
        ? await updateGuestUser()
            .then((gu: any) => {
              return { ...gu.data };
            })
            .catch((e: Error) => {
              if (e.message?.toLowerCase() === 'email already exists') {
                onOpenSignInPop && onOpenSignInPop();
                return null;
              }
              throw e;
            })
        : null;
      if (!userData) {
        setloading(false);
        return;
      }
      const billingMethodData = {
        stripeToken: token.id,
        email: userData && !showEmailField ? userData.email : email,
        id: userData._id,
        userId: userData._id,
      };
      const customer = await addStripeCustomer(billingMethodData);
      if (token?.card) {
        analytics.track('card_added', { cardId: token?.card?.last4 });
      }
      userData.stripe = customer.user.stripe;
      let DonnotClearField = false;
      if (functions?.onSave) {
        try {
          await functions.onSave(userData);
          onFirstBillingCallback?.();
        } catch (e) {
          DonnotClearField = true;
          setloading(false);
        }
      }
      if (reload) reload(false);
      if (!DonnotClearField) {
        restForm();
        setUser({ ...userData, isPasswordSet: true });
      }
    } catch (error: any) {
      setloading(false);
      AppAlert({
        title: error?.title || 'Please Enter Correct information',
        text: error?.message || error,
        onConfirm: () => {
          if (error?.title === 'Incomplete Fields') {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }
        },
      });
    }
    setloading(false);
  };
  const sendNextBilling = async () => {
    if (isOwnProfile && onStopPOPupOpen) {
      onStopPOPupOpen();
      return;
    }
    setloading(true);
    try {
      validation();
      const { token, error }: any = await fetchStripeToken();
      if (error !== undefined) {
        throw error.message;
      }
      const billingMethodData = {
        stripeToken: token.id,
      };
      await updateStripeCustomer(billingMethodData);
      let DonnotClearField = false;
      if (functions?.onSave) {
        try {
          await functions.onSave(user);
        } catch (e) {
          DonnotClearField = true;
          setloading(false);
        }
      }
      if (reload) reload(false);
      if (!DonnotClearField) {
        restForm();
      }
    } catch (error: any) {
      setloading(false);
      AppAlert({
        title: error.title || 'Please Enter Correct information',
        text: error.message || error,
      });
    }
    setloading(false);
  };

  const fetchStripeToken = async () => {
    if (!stripe || !elements) {
      return;
    }
    const cnumber = elements.getElement(CardNumberElement);
    if (!cnumber) {
      return;
    }
    return await stripe.createToken(cnumber, {
      name: cardName,
    });
  };
  const color = colors.textColor;
  return (
    <form
      id="first-billing-method-form"
      method="POST"
      autoComplete="off"
      style={{ display: !!visibility ? 'block' : 'none' }}
      onSubmit={(e) => {
        e.preventDefault();
        if (totalCards > 0) {
          sendNextBilling();
        } else {
          sendFirstBilling();
        }
      }}
    >
      <CreditCard className="pb-0 creditcard add-style mb-35 creditcard-alt">
        <div className="max-holder">
          <div className="input-wrap mb-15">
            <FocusInput
              hasLabel={false}
              style={{ paddingTop: 5, fontSize: '14px' }}
              placeholder="Name on Card"
              name="nameOnCard"
              validations={[{ noMultipeSpace: true }, { type: 'alpha' }]}
              value={cardName}
              onChange={(e: any) => {
                onGuestInputChange?.({ name: e.target.value || '' });
                setCardName(e.target.value);
              }}
            />
          </div>
          {showEmailField ? (
            <div className="input-wrap mb-15">
              <FocusInput
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                }}
                style={{ paddingTop: 5, fontSize: '14px' }}
                hasLabel={false}
                icon="mail"
                placeholder="What is your email address?"
                id="email"
                name="email"
                type="email"
                disabled={disableEmail}
              />
            </div>
          ) : null}
          <div className="mb-20 input-wrap">
            <div className="text-input">
              <CardNumberElement
                className="form-control"
                options={{
                  showIcon: true,
                  placeholder: 'Credit Card Number',
                  classes: { focus: 'input-foucs' },
                  style: {
                    base: {
                      iconColor: color,
                      color: color,
                      lineHeight: '16px',
                      '::placeholder': {
                        color: color,
                        fontSize: '14px',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="mb-20 input-wrap cols">
            <div className="text-input">
              <CardExpiryElement
                className="form-control"
                options={{
                  classes: { focus: 'input-foucs' },
                  placeholder: 'Exp Date (MM/YY)',
                  style: {
                    base: {
                      color: color,
                      lineHeight: '16px',
                      '::placeholder': {
                        color: color,
                        fontSize: '14px',
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="text-input">
              <CardCvcElement
                className="form-control"
                options={{
                  classes: { focus: 'input-foucs' },
                  placeholder: 'CCV',
                  style: {
                    base: {
                      color: color,
                      lineHeight: '16px',
                      '::placeholder': {
                        color: color,
                        fontSize: '14px',
                      },
                    },
                  },
                }}
              />{' '}
              <div className="img">
                <img
                  src="/assets/images/svg/ico-card02.svg"
                  alt="img description"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="billing-card-field">
                <div id="card-errors" role="alert"></div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            {!elementsProps?.Save && (
              <NewButton
                htmlType="submit"
                type="primary"
                isLoading={loading}
                className="mb-20"
              >
                SAVE
              </NewButton>
            )}
          </div>
        </div>
      </CreditCard>

      {elementsProps?.Save && (
        <elementsProps.Save isDisable={isButtonDisable} isLoading={loading} />
      )}
    </form>
  );
};

export default CardForm;
