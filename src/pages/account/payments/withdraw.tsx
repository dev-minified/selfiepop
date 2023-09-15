import { createTransfer, getWalletHistory } from 'api/billing';
import { HIDE_WITHDRAWAL } from 'appconstants';
import { ArrowBack } from 'assets/svgs';
import FocusInput from 'components/focus-input';
import Button from 'components/NButton';
import { toast } from 'components/toaster';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import useRequestLoader from 'hooks/useRequestLoader';
import { useEffect, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import 'styles/bank-info.css';
import Utils from 'utils';
import * as yup from 'yup';
const withdrawFee = 2.0;
const getFee = (value: number) => {
  return Number(
    (
      Number(((withdrawFee + (0.25 * value) / 100 + 0.25) * 1.015).toFixed(2)) -
      withdrawFee
    ).toFixed(2),
  );
};
const BackArrow = styled.div`
  /* position: absolute; */
  /* left: -80%; */
  cursor: pointer;
  transition: all 0.3ms ease;
  &:hover {
    color: var(--pallete-primary-main);
  }
`;
export default function Withdraw(props: any) {
  const [availableAmount, setAvailableAmount] = useState(0);
  const [isAmountLoading, setIsAmoutLoading] = useState(true);
  const disableField = Number(availableAmount) > 9;
  const { withLoader } = useRequestLoader();
  const { user } = useAuth();
  const history = useHistory();
  const getWalletHeader = () => {
    if (!!HIDE_WITHDRAWAL[user?._id || '']) {
      return true;
    }
    return !!user?.isSpManaged;
  };
  useEffect(() => {
    if (user?._id) {
      if (getWalletHeader()) {
        return history.replace('/account/payments');
      }
      setIsAmoutLoading(true);
      withLoader(getWalletHistory())
        .then((res) => {
          setIsAmoutLoading(false);
          if (res?.item) {
            setAvailableAmount(Number(res?.withdrawalAvailable));
          }
        })
        .catch((e: Error) => {
          setIsAmoutLoading(false);
          console.log(e);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const validationSchema = yup.object().shape({
    money: yup
      .number()

      .min(10)
      .required('Enter amount to withdraw'),
  });
  const {
    values,
    setValues,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    isSubmitting,
    touched,
  } = useFormik({
    validationSchema,
    validate: (values) => {
      const error: any = {};
      if (Number(values.money) < 10) {
        error.money = 'Amount must be around or greater than $10';
      } else {
        const fees = getFee(Number(values.money));
        const total = Number(
          (Number(fees) + 2.0 + Number(values.money)).toFixed(2),
        );

        if (total > availableAmount) {
          error.money = 'Exceed withdrawal amount limit';
        }
      }
      return error;
    },
    initialValues: {
      money: '',
    },
    onSubmit: async (values) => {
      let fees = 0;
      let total = '2.00';
      if (Number(values.money)) {
        fees = getFee(Number(values.money));
        total = (Number(fees) + 2.0 + Number(values.money)).toFixed(2);
      }
      const requestData = {
        amount: total,
        accountId: props.user?.stripeSellerAccountId,
        currency: 'usd',
        description: '',
      };
      await createTransfer(requestData)
        .then(async (data: any) => {
          if (data) {
            Utils.showAlert(
              'Withdraw',
              'success',
              'Amount Transferred Successfully',
            );
          }
        })
        .then(() => {
          history.push('/account/payments');
        })
        .catch((e) => {
          if (e.message) {
            toast.error(e.message);
          }
        });
    },
  });
  let fees = 0;
  let total = '0';
  if (Number(values.money)) {
    fees = getFee(Number(values.money));
    total = (Number(fees) + withdrawFee + Number(values.money)).toFixed(2);
  }
  const HanldeMaxAmountClick = () => {
    if (!disableField) return;
    const fees = getFee(Number(availableAmount));
    const total = (
      Number(availableAmount) -
      Number(fees) -
      withdrawFee
    ).toFixed(2);

    setValues({ money: total });
  };
  return (
    <div className="mb-80">
      <form onSubmit={handleSubmit}>
        {!isDesktop && (
          <BackArrow
            className="mb-10 back-arrow "
            onClick={() => {
              history.replace('/account/payments');
            }}
          >
            <ArrowBack /> <strong className="ml-5">Back</strong>
          </BackArrow>
        )}
        <div className="bank-info mb-30">
          <div className="box available col-12">
            <span className="icon-dollar"></span>
            <div className="textbox">
              <strong className="amount">${availableAmount}</strong>
              <span className="status">Available for Withdrawal</span>
            </div>
          </div>
        </div>
        {!disableField && !isAmountLoading && (
          <div className="text-center alert alert-danger">
            $10 is the minimum balance you can withdraw from your account.
          </div>
        )}
        {disableField && (
          <>
            {' '}
            <div
              className="input-wrap mb-35 field-amount"
              style={{ position: 'relative' }}
            >
              <FocusInput
                hasIcon={true}
                disabled={!disableField}
                icon="dollar"
                label="Enter Amount to Withdraw"
                id="money"
                name="money"
                value={values.money}
                onChange={handleChange}
                onBlur={handleBlur}
                class={
                  touched.money
                    ? errors.money
                      ? 'is-invalid'
                      : 'is-valid'
                    : ''
                }
                error={errors.money}
                touched={touched.money}
                validations={[{ type: 'number' }]}
              />
              <span
                className="input-tag input-icon"
                onClick={HanldeMaxAmountClick}
              >
                MAX AMOUNT
              </span>
            </div>
            <div className="mb-5 info-bar">
              <div className="user-box">
                <strong className="title">Withdrawal Fee</strong>
              </div>
              <div className="pr-20">$2.00</div>
            </div>
            <div className="info-bar mb-35">
              <div className="user-box">
                <strong className="title">Transaction Cost (0.25%)</strong>
              </div>
              <div className="pr-20">{fees}</div>
            </div>
            <div className="info-bar last mb-30">
              <div className="user-box">
                <strong className="title">Total Withdrawal</strong>
              </div>
              <div className="pr-20">
                <b>${total}</b>
              </div>
            </div>
            <div className="d-flex justify-content-center mb-100">
              <Link to={'/account/payments'}>
                <span className="btn btn-cancel text-uppercase">Cancel</span>
              </Link>
              <Button
                htmlType="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                type="primary"
                className="ml-20"
              >
                Withdraw
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
