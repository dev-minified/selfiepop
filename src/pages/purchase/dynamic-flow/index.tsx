import { fetchCards } from 'api/billing';
import { updateOrder } from 'api/Order';
import Checkbox from 'components/checkbox';
import FocusInput from 'components/focus-input';
import FormItem from 'components/Form/FromItem';
import Button from 'components/NButton';
import { DashedLine } from 'components/Typography';
import UploadWedigt from 'components/UploadWidget';
import { ServiceType } from 'enums';
import { useFormik } from 'formik';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import React from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import { setOrder } from 'store/reducer/checkout';
import styled from 'styled-components';

type questiontype = Omit<Questions, 'title'> & {
  fieldName?: string;
  index?: number;
  title?: string | React.ReactElement;
  validationSchema?: any;
  validate?: any;
};

function Items({
  name,
  type,
  label,

  onChange,
  setFieldValue,
  options,
  attachements,
  responseValue,
  ...rest
}: {
  name?: string | number;
  values?: questiontype;
  type?: string | any;
  label?: string | React.ReactNode;
  text?: string | React.ReactNode;
  touched?: any;
  error?: any;
  onChange?: any;
  setFieldValue?: any;
  onBlur: any;
  options?: ResponseOptions[];
} & Partial<Omit<Questions, 'type'>>) {
  switch (type) {
    case 'file':
      return (
        <div>
          <UploadWedigt
            value={attachements}
            onChange={(array: any) => {
              setFieldValue(
                `[${name}].attachements`,
                array.map((item: any) => ({ ...item, url: item.imageURL })),
              );
            }}
            url={'/image/upload'}
            limit={5}
          />
        </div>
      );
    case 'selectList':
      return (
        <div>
          {options?.map((option: ResponseOptions, index: number) => {
            return (
              <Checkbox
                key={index}
                label={option.text}
                name={`[${name}].responseOptions[${index}].value`}
                checked={option?.value}
                onChange={onChange}
                type="primary"
                className="mb-10"
                {...rest}
              />
            );
          })}
        </div>
      );
    default:
      return (
        <FocusInput
          name={`[${name}].responseValue`}
          type={type === 'long-text' ? 'textarea' : 'text'}
          label={label}
          rows={4}
          onChange={onChange}
          value={responseValue}
          materialDesign
          {...rest}
        />
      );
  }
}

function DynamicQuestions({ className }: { className?: string }) {
  const order = useAppSelector((state) => state.checkout?.order);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation();
  const { username } = useParams<{ username: string }>();
  const { user, loggedIn } = useAuth();

  const {
    values,
    handleChange,

    handleBlur,
    setFieldValue,
    isSubmitting,
    handleSubmit,
    errors,
    touched,
    // tslint:disable-next-line: react-hooks-nesting
  } = useFormik<questiontype[]>({
    initialValues: [],
    validateOnChange: true,
    onSubmit: async (values: questiontype[]) => {
      const requestDate: any = { questions: values };

      await updateOrder(order._id, requestDate)
        .then(async (res) => {
          dispatch(setOrder(res?.data));
          const StripeId = loggedIn && user?.stripe?.customerId;
          if (StripeId) {
            const response = await fetchCards();
            if (response.sources?.length > 0) {
              return history.push(
                `/${username}/purchase/add-a-card-and-checkout${location.search}`,
              );
            }
          }
          return history.push(
            `/${username}/purchase/add-a-card-and-checkout${location.search}`,
          );
        })
        .catch(console.log);
    },
  });

  return (
    <div className={className}>
      <form onSubmit={handleSubmit}>
        {order?.popId.popType === ServiceType.ADVERTISE && (
          <div className="title mb-30">
            <h3 className="mb-10">Instagram Advertising Details</h3>
            <h6>{order?.seletedPriceVariation?.description}</h6>
            <DashedLine className="my-40" />
          </div>
        )}
        {values.length > 0 && (
          <div>
            <DashedLine className="my-20 my-md-50" />
            <div className="title mb-30">
              {order?.popId.popType === ServiceType.ADVERTISE ? (
                <h3>Advertising Questionaire</h3>
              ) : order?.popId.popType === ServiceType.POPLIVE ? (
                <h3>Pop Live Details</h3>
              ) : (
                <h4>Custom Service Details</h4>
              )}
              <h6>Please answer the following questions</h6>
            </div>
            {values?.map((q: questiontype, index: number) => {
              const {
                responseType,
                responseOptions,
                attachements,
                title,
                ...rest
              } = q;
              return (
                <FormItem label={title} key={index} className="mb-30 mb-md-60">
                  <Items
                    name={index}
                    type={responseType}
                    touched={touched}
                    error={errors[index]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    options={responseOptions}
                    attachements={attachements}
                    {...rest}
                  />
                </FormItem>
              );
            })}
          </div>
        )}

        <DashedLine className="my-40" />

        <Button
          block
          size="large"
          className="mt-30"
          htmlType="submit"
          isLoading={isSubmitting}
        >
          Continue
        </Button>
      </form>
    </div>
  );
}

export default styled(DynamicQuestions)`
  position: relative;

  .meeting-timer {
    position: absolute;
    left: 0;
    right: 0;
    top: -50px;
    text-align: center;
    font-size: 16px;
    line-height: 19px;
    font-weight: 700;
    color: var(--pallete-text-main);
    svg {
      color: var(--pallete-text-light-150);
    }
  }

  .react-select__control {
    border: none !important;
    font-size: 13px;
    line-height: 16px;
    color: var(--pallete-text-main);

    .react-select__indicators {
      display: none;
    }

    .react-select__value-container {
      justify-content: center;
    }

    .react-select__single-value {
      padding-right: 18px;
      padding-left: 25px;

      &:before {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
        content: '';
        width: 14px;
        height: 14px;
        background-size: 100% 100%;
        background: url(/assets/images/svg/globe.svg) no-repeat;
      }

      &:after {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(0, -50%);
        border-style: solid;
        border-width: 5px 4px 0 4px;
        border-color: var(--pallete-text-main) transparent transparent
          transparent;
        content: '';
      }
    }
  }

  .checkbox {
    max-width: 315px;
    margin: 0 auto;
  }

  h3 {
    font-weight: 500;
  }

  h6 {
    color: var(--pallete-text-main-300);
    font-size: 15px;
    line-height: 21px;
  }

  .react-datepicker-wrapper {
    width: 100%;
  }

  .rc-date__picker {
    height: 40px;
    padding: 10px 17px;
    border: 1px solid var(--pallete-background-pink);
    font-size: 15px;
    line-height: 18px;
    color: rgba(0, 0, 0, 0.5);
    display: block;
    width: 100%;
    outline: none;
    border-radius: 5px;

    &:focus {
      border-color: var(--colors-indigo-200);
    }
  }

  .react-time-picker {
    width: 100%;

    .react-time-picker__wrapper {
      height: 40px;
      border: 1px solid var(--pallete-background-pink);
      font-size: 15px;
      line-height: 18px;
      color: rgba(0, 0, 0, 0.5);
      display: block;
      width: 100%;
      outline: none;
      border-radius: 5px;
    }

    .react-time-picker__inputGroup {
      padding: 10px 60px 10px 17px;
    }

    .react-time-picker__inputGroup__input {
      outline: none;
    }

    .react-time-picker__clear-button {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translate(0, -50%);
    }
  }

  .available-dates-marker {
    width: 24px;
    height: 24px;
    background-color: #87d7f5;
    border-radius: 50%;
    margin-bottom: -6px;
    display: inline-block;
  }
`;
