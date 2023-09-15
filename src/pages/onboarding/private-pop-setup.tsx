import { createUserLinks, update } from 'api/User';
import { ArrowRightFilled, SubscriptionFee } from 'assets/svgs';
import classNames from 'classnames';
import Checkbox from 'components/checkbox';
import FocusInput from 'components/focus-input';
import Button from 'components/NButton';
// import Switchbox from 'components/switchbox';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ServiceType } from 'enums';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useAnalytics } from 'use-analytics';
import { getUserSetupUri, setLocalStorage } from 'util/index';
// import { v4 as uuid } from 'uuid';
import * as yup from 'yup';
import PaymaFrom from './components/PaymaForm';
import ShoutoutForm from './components/ShoutoutForm';
import { GetTile, InterestSetup } from './interests-setup.styled';
dayjs.extend(utc);
interface Props {}
const StyledOptionComponent = styled.div`
  padding: 23px 15px 14px;
  border: 2px solid var(--pallete-colors-border);
  border-radius: 8px;
  margin: 0 0 29px;
  font-size: 16px;
  line-height: 1.375;
  color: var(--pallete-text-main-300);
  font-weight: 400;
  &.active,
  &.selected {
    border-color: var(--pallete-primary-main);
  }
  .icon-holder {
    width: 28px;
    min-width: 28px;
    svg {
      width: 100%;
      height: auto;
      display: block;
    }
  }
  .text-holder {
    min-width: 0;
    flex-grow: 1;
    flex-basis: 0;
    padding: 0 0 0 20px;
    p {
      margin: 0;
    }
    .title {
      display: block;
      font-size: 18px;
      line-height: 1.333;
      color: var(--pallete-text-main);
      font-weight: 500;
      margin: 0 0 5px;
    }
  }

  .subscription-title {
    display: flex;
    align-items: center;
    margin: 0 0 25px;

    .icon-holder {
      width: 28px;
      min-width: 28px;

      svg {
        display: block;
        width: 100%;
        height: auto;
      }
    }

    h2 {
      font-size: 18px;
      line-height: 24px;
      margin: 0 0 5px;
      font-weight: 500;
      color: var(--pallete-text-main);
      margin: 0 0 0 15px;
    }
  }

  .checkbox {
    .custom-input {
      width: 27px;
      height: 27px;
      border: 2px solid var(--pallete-colors-border);
    }

    input[type='checkbox'] {
      + .custom-input-holder {
        .custom-input {
          &:before {
            font-size: 11px;
            z-index: 2;
            color: #fff;
          }
        }
      }

      &:checked {
        + .custom-input-holder {
          .custom-input {
            border-color: var(--pallete-text-secondary-50);
            &:after {
              opacity: 1;
              background: var(--pallete-text-secondary-50);
              border-color: var(--pallete-text-secondary-50);
            }
          }
        }
      }
    }

    label {
      padding: 0;

      &:hover {
        .custom-input {
          &:after {
            opacity: 0;
          }
        }
      }
    }

    .label-text {
      font-size: 14px;
      line-height: 18px;
      font-weight: 500;
      color: var(--pallete-text-main);
    }
  }

  .subscription-description-box {
    padding: 12px 0 18px;
    color: var(--pallete-text-main-300);

    p {
      margin: 0;
    }

    .helping-text {
      display: block;
      font-size: 14px;
    }
  }

  .col-25 {
    width: 29%;
    padding: 0 0 0 10px;
    margin: 0 0 0 auto;

    @media (max-width: 480px) {
      width: 100%;
      padding: 0;
    }

    .text-input {
      margin-bottom: 0 !important;
    }
  }
`;
const StyledPrivatePopSetup = styled.div`
  padding: 10px 20px 80px;
  @media (max-width: 767px) {
    padding: 10px 0 110px;
  }
  .steps-detail {
    position: relative;
    overflow: hidden;
    margin: 0 0 12px;
    .steps-box {
      font-size: 18px;
      line-height: 21px;
      margin: 0 0 27px;
      font-weight: 500;
    }
  }

  .sp__card {
    margin: 0 0 30px;

    .header {
      align-items: center;
    }
  }

  h3 {
    font-size: 22px;
    line-height: 26px;
    color: var(--pallete-text-main);
    margin: 0 0 20px;
    font-weight: 500;
    .option_text {
      display: inline-block;
      vertical-align: middle;
      padding-left: 5px;
      font-size: 15px;
      line-height: 18px;
      font-weight: 400;
    }
  }
  h6 {
    font-size: 15px;
    line-height: 20px;
    color: var(--pallete-text-main);
    margin: 0 0 10px;
    font-weight: 500;
  }
  .skip-step {
    display: flex;
    align-items: center;
    padding-bottom: 30px;
    color: var(--pallete-text-main-300);
    .toggle-switch {
      margin-right: 20px;
    }
  }
  .pop-options-box {
    position: relative;
    overflow: hidden;
    margin: 0 0 12px;
  }
  .button-holder {
    border-top: 1px solid var(--pallete-colors-border);
    padding: 30px 30px 30px 40px;
    position: fixed;
    left: 0;
    width: 599px;
    bottom: 0;
    background: var(--pallete-background-default);
    z-index: 11;
    @media (max-width: 1023px) {
      width: auto;
      right: 0;
    }

    @media (max-width: 767px) {
      padding: 15px 20px;
    }
    .img {
      margin: 0 0 0 8px;
    }
  }
  h4 {
    font-size: 15px;
    margin: 0;
  }
  .card-box {
    border: 2px solid var(--pallete-colors-border);
    border-radius: 8px;
    padding: 18px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media (max-width: 767px) {
      padding: 15px;
    }
    .image-comp {
      width: 77px;
      @media (max-width: 767px) {
        width: 60px;
      }
    }
  }
  .card-box-area {
    margin: 0 0 40px;

    .label-area {
      margin: 0 0 24px;
    }
    .label {
      display: block;
      margin: 0 0 8px;
      font-size: 15px;
      line-height: 18px;
      font-weight: 500;
    }
    .description-text {
      display: block;
      color: var(--pallete-text-main-300);
      font-size: 14px;
      line-height: 18px;
    }
    .dollar-input {
      width: 198px;
      @media (max-width: 767px) {
        width: 160px;
      }
      .icon {
        width: 40px;
        height: 40px;
        display: flex;
        background: var(--pallete-primary-main);
        align-items: center;
        justify-content: center;
        font-size: inherit;
        color: #fff;
        border-radius: 4px;
        left: 9px;
      }
      .form-control {
        font-size: 20px;
        line-height: 24px;
        font-weight: 500;
        color: var(--pallete-text-main);
        padding-left: 60px;
        &:focus {
          padding-left: 60px;
        }
      }
    }
  }

  .checkbox {
    .custom-input {
      width: 27px;
      height: 27px;
      border: 2px solid #d7b3e3;
    }

    input[type='checkbox'] {
      + .custom-input-holder {
        .custom-input {
          &:before {
            font-size: 11px;
            z-index: 2;
            color: #fff;
          }
        }
      }

      &:checked {
        + .custom-input-holder {
          .custom-input {
            border-color: var(--pallete-primary-main);
            &:after {
              opacity: 1;
              background: var(--pallete-primary-main);
              border-color: var(--pallete-primary-main);
            }
          }
        }
      }
    }

    label {
      padding: 0;

      &:hover {
        .custom-input {
          &:after {
            opacity: 0;
          }
        }
      }
    }

    .label-text {
      font-size: 14px;
      line-height: 18px;
      font-weight: 500;
      color: var(--pallete-text-main);
    }
  }
`;
export type POST = {
  text: string;
  media: IPostMedia[];
  membershipAccessType: IPostMembershipAccessTypes[];
  postDate: dayjs.ConfigType;
  _id?: string;
};

const PrivatePopSetup: React.FC<Props> = (props: Props) => {
  const { user, setUser } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const history = useHistory();
  const [paidMemberShip, setPaidMemberShip] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState(false);
  const analytics = useAnalytics();
  const formvalidation = yup.object().shape({
    price: yup
      .number()
      .required('Price should be from $5 to $2500')
      .max(2500, 'Price should be from $5 to $2500')
      .min(5, 'Price should be from $5 to $2500'),
  });
  const validationSchema = yup.object().shape({
    payma: formvalidation,
    shoutout: formvalidation,
    poplive: formvalidation,
    amount: paidMemberShip
      ? yup
          .number()
          .required('Price should be from $5 to $2500')
          .max(2500, 'Price should be from $5 to $2500')
          .min(5, 'Price should be from $5 to $2500')
      : yup.number(),
    // chatSubscription: yup.object().shape({
    //   priceVariations: paidMemberShip
    //     ? yup.array().of(formvalidation)
    //     : yup.array().of(
    //         yup.object().shape({
    //           price: yup.number(),
    //         }),
    //       ),
    // }),
  });
  const form = useFormik<{
    payma: IPop;
    shoutout: IPop;
    poplive: IPop;
    advertise: IPop;
    chatSubscription: IPop;
    amount?: number;
  }>({
    validationSchema,
    initialValues: {
      payma: { popType: 'payma', isActive: false, price: 25 },
      shoutout: { popType: 'shoutout', isActive: false, price: 25 },
      poplive: { popType: 'poplive', isActive: false, price: 25 },
      advertise: { popType: 'advertise', isActive: false, price: 25 },
      chatSubscription: {
        popType: 'chat-subscription',
        isActive: true,
        actionText: 'Exclusive Content',
        priceVariations: [
          {
            price: Number(0),
            title: 'membership 1',
            description: '',
            isActive: true,
            isArchive: false,
            questions: [],
            isDefault: true,
            allowBuyerToMessage: true,
            allowContentAccess: true,
            allowUpsaleOffer: true,
            type: 'simple',
          },
        ],
      },
      amount: 25,
    },
    onSubmit: async (values) => {
      if (paidMemberShip) {
        (values.chatSubscription as any).priceVariations[0].price = Number(
          values.amount,
        );
        (values.chatSubscription as any).priceVariations[0].title =
          'Paid Membership';
      } else {
        (values.chatSubscription as any).priceVariations[0].price = 0;
        (values.chatSubscription as any).priceVariations[0].title =
          'Free Membership';
        (values.chatSubscription as any).priceVariations[0].allowUpsaleOffer =
          true;
      }
      delete values.amount;

      setLocalStorage('onBoardingTour', 'true', false);
      await createUserLinks({
        list: Object.values(values).filter((value: any) => value.isActive),
      }).then((user) => {
        setUser(user?.data);
        history.push(getUserSetupUri(2));
      });
      setisLoading(true);
      analytics.track('new_reg_step_2', {
        payma: Boolean(payma?.isActive),
        url: window.location.href,
        shoutout: Boolean(shoutout?.isActive),
        onboardingFlowTypeId: user.onboardingTypeId,
        flowVersion: 1,
      });
    },
  });
  const {
    handleChange,
    handleBlur,
    values,
    setValues,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
    isSubmitting,
  } = form;
  const { payma, shoutout, poplive, advertise } = values;
  useEffect(() => {
    if (user?.userSetupStatus < 9) {
      if (user?.userSetupStatus !== 1) {
        setUser({
          ...user,
          userSetupStatus: 1,
        });
        update({
          userSetupStatus: 1,
        });
      }
    }
  }, []);
  useEffect(() => {
    if ((props as any)?.onleftscrollposition) {
      (props as any)?.onleftscrollposition(300);
    }
  }, []);

  useEffect(() => {
    if (user?.userSetupStatus < 9) {
      const links = user.links;
      let premiumVariation = null;
      if (links) {
        const payma = links?.find(
          (i: any) => i?.popLinksId?.popType === ServiceType.PAYMA,
        )?.popLinksId;
        const shoutout = links?.find(
          (i: any) => i?.popLinksId?.popType === ServiceType.SHOUTOUT,
        )?.popLinksId;
        const poplive = links?.find(
          (i: any) => i?.popLinksId?.popType === ServiceType.POPLIVE,
        )?.popLinksId;
        const advertise = links?.find(
          (i: any) => i?.popLinksId?.popType === ServiceType.ADVERTISE,
        )?.popLinksId;
        const chatSubscription = links?.find(
          (i: any) => i?.popLinksId?.popType === ServiceType.CHAT_SUBSCRIPTION,
        )?.popLinksId;
        if (chatSubscription) {
          const { priceVariations } = chatSubscription;
          premiumVariation = priceVariations?.find(
            (v: PriceVariant) => v.isDefault,
          );
          setPaidMemberShip((premiumVariation?.price as number) > 0);
        }
        setValues({
          ...values,
          payma: { ...values.payma, ...payma },
          shoutout: { ...values.shoutout, ...shoutout },
          poplive: { ...values.poplive, ...poplive },
          advertise: { ...values.advertise, ...advertise },
          chatSubscription: { ...values.chatSubscription, ...chatSubscription },
          amount:
            (premiumVariation?.price as any) > 0 ? premiumVariation?.price : 25,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const {
    payma: paymaErrors,
    shoutout: shoutoutErrors,
    poplive: popliveErrors,
    amount: amountErrors,
    advertise: advertiseErrors,
  } = errors;
  const {
    payma: paymaTouched,
    shoutout: shoutoutTouched,
    poplive: popLiveTouched,
    amount: amountTouched,
    advertise: advertiseTouched,
  } = touched;
  return (
    <StyledPrivatePopSetup ref={ref}>
      <InterestSetup>
        <div className="profile--info mb-30">
          <h3>
            Welcome {user?.pageTitle}! Customize Your Private POP Page Below.
          </h3>
          <GetTile
            tags={
              'Do you want to get paid by selling EXCLUSIVE CONTENT to your fans?'
            }
          />
          <StyledOptionComponent className={classNames('')}>
            <div className="subscription-title">
              <div className="icon-holder">
                <SubscriptionFee />
              </div>
              <h2>Monthly Subscription Fee</h2>
            </div>
            <div className="select-form">
              <Checkbox
                className="make_it_required"
                name="allowBuyerToMessage"
                checked={!paidMemberShip}
                onChange={() => setPaidMemberShip(false)}
                label={'Enable Free Membership '}
              />
              <div className="subscription-description-box">
                <p>
                  Your fans can access your basic wall for free{' '}
                  <span className="helping-text">
                    (you can still charge for any pictures you don't want to
                    give away for free)
                  </span>
                </p>
              </div>
            </div>
            <div className="select-form">
              <Checkbox
                className="make_it_required"
                name="allowBuyerToMessage"
                checked={paidMemberShip}
                onChange={() => setPaidMemberShip(true)}
                label={'Enable Paid Membership '}
              />
              <div className="subscription-description-box">
                <p>
                  Please set the price that you want to charge for monthly
                  access to your members only content.
                </p>
              </div>
            </div>
            <div className="col-25">
              <FocusInput
                inputClasses="mb-25"
                label={<span> Price *</span>}
                hasIcon={true}
                id="amount"
                name={'amount'}
                disabled={!paidMemberShip}
                icon="dollar"
                validations={[{ type: 'number' }]}
                onChange={(e) =>
                  setFieldValue('amount', Number(e.target.value))
                }
                onBlur={handleBlur}
                error={amountErrors}
                touched={amountTouched}
                value={`${values.amount}`}
                materialDesign
              />
            </div>
          </StyledOptionComponent>
        </div>
        <h6>Do you want to get paid by running promotions for your fans?</h6>
        <div className="interests-wrap">
          <div>
            <ShoutoutForm
              baseName="advertise"
              values={advertise}
              title="Promotional Shoutout"
              checkBoxText="Enable Promotional Shoutout on my Pop Page"
              errors={advertiseErrors}
              touched={advertiseTouched}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />

            <h6>Do you want to get paid by creating custom videos?</h6>
            <ShoutoutForm
              baseName="shoutout"
              values={shoutout}
              errors={shoutoutErrors}
              touched={shoutoutTouched}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <h6>Do you want to get paid by answering your fans' questions?</h6>
            <PaymaFrom
              values={payma}
              baseName="payma"
              errors={paymaErrors}
              touched={paymaTouched}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
            <h6>Do you want to get paid video chatting with your fans?</h6>
            <ShoutoutForm
              baseName="poplive"
              values={poplive}
              title="Pop Live"
              checkBoxText="Enable Pop Live on my Pop Page"
              errors={popliveErrors}
              touched={popLiveTouched}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          </div>
        </div>
      </InterestSetup>

      <Fragment>
        <div className="text-center button-holder">
          <Button
            disabled={isLoading || isSubmitting}
            isLoading={isLoading || isSubmitting}
            onClick={() => handleSubmit()}
            type="primary"
            size="large"
            block
          >
            Next Step
            <span className="img">
              <ArrowRightFilled />
            </span>
          </Button>
        </div>
      </Fragment>
    </StyledPrivatePopSetup>
  );
};

export default PrivatePopSetup;
