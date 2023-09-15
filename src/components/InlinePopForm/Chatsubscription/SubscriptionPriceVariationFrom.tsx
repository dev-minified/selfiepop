import { Calendar, Dollar, RecycleBin } from 'assets/svgs';
import NewButton from 'components/NButton';
import Select from 'components/Select';
import Card from 'components/SPCards';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useFormik } from 'formik';
import { ReactElement, ReactNode, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';

import * as yup from 'yup';
import FocusInput from '../../focus-input';
import Switchbox from '../../switchbox';

dayjs.extend(utc);

const couponOptions = [
  { label: 'Unlimited Use', value: 'MULTI' },
  { label: 'Single Use', value: 'SOLO' },
];
const validationSchema = yup.object().shape({
  code: yup.string().max(255).required('Coupon is required'),
  amount: yup.number().required('Discount is required'),
});
interface Props {
  value?: any;
  cbonSubmit?: Function;
  cbonCancel?: Function;
  footer?: ReactNode;
  questions?: boolean;
  onDeleteClick?(): void;
  className?: string;
  title?: string;
  type?: string;
  options?: { status?: boolean; delete?: boolean; close?: boolean };
  socialMediaLinks?: SocialLink[];
  icon?: ReactElement;
}

const InlinePriceVariationFrom = ({
  value,
  cbonCancel,
  cbonSubmit,
  footer,
  onDeleteClick,
  className,
  title: cardTitle,
  options = { status: true, delete: true, close: false },
  icon,
}: Props) => {
  const cancelHanlder = () => {
    cbonCancel && cbonCancel();
  };

  const {
    values,

    setValues,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    errors,
    touched,
    // tslint:disable-next-line: react-hooks-nesting
  } = useFormik<any>({
    validationSchema,
    initialValues: {
      _id: '',
      code: '',
      description: '',
      isActive: true,
      startDate: new Date(),
      expireDate: dayjs().add(90, 'days').toDate(),
      amount: 5,
      type: couponOptions[0],
    },
    onSubmit: async (values) => {
      const { startDate, expireDate, type } = values;
      if (!dayjs(expireDate).isAfter(dayjs(startDate))) {
        toast.error('Expire Date must be greater than start Date');
        return;
      }
      if (cbonSubmit) {
        await cbonSubmit({
          ...values,
          type: type.value,
          startDate: dayjs(startDate).utc().format(),
          expireDate: dayjs(expireDate).utc().format(),
        });
      }
    },
  });

  useEffect(() => {
    const { expireDate: exDatee, startDate: stDatee, type } = value;
    const coupenoption = couponOptions.find((f) => f.value === type);
    if (!value._id) {
    }
    if (value)
      setValues((v: any) => ({
        ...v,
        ...value,
        expireDate: exDatee
          ? dayjs.utc(exDatee).local().toDate()
          : dayjs().add(90, 'days').toDate(),
        startDate: stDatee
          ? dayjs.utc(stDatee).local().toDate()
          : dayjs().toDate(),
        type: coupenoption || couponOptions[0],
      }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  const { isActive } = values;
  const {
    status: showStatus = true,
    close: showClose = false,
    delete: showDelete = true,
  } = options;
  return (
    <div className={className}>
      <Card
        title={cardTitle || value.title || value?.code || 'Title'}
        icon={icon || <Dollar />}
        extra={
          <div>
            {showStatus && (
              <Switchbox
                value={isActive}
                onChange={handleChange}
                name="isActive"
                status={false}
                size="small"
              />
            )}
            {showDelete && (
              <span>
                <NewButton
                  icon={<RecycleBin />}
                  outline
                  onClick={onDeleteClick}
                />
              </span>
            )}
          </div>
        }
        onCancel={cancelHanlder}
        onClose={cancelHanlder}
        onSave={handleSubmit}
        showClose={showClose}
        showFooter={true}
        type="sub-card"
      >
        <div className="form">
          <div className="form-field">
            <div className="date-area">
              <div className="startDate date-holder">
                <label htmlFor="">Start Date:</label>
                <div className="date_select select1">
                  <DatePicker
                    selected={values.startDate}
                    dateFormat="MMM dd, yyy"
                    onChange={(date) => {
                      setFieldValue('startDate', date);
                    }}
                    className="rc-date__picker"
                  />
                  <span className="img-calendar">
                    <Calendar />
                  </span>
                </div>
              </div>
              <div className="expireDate date-holder">
                <label htmlFor="">Expiration Date:</label>
                <div className="date_select select2">
                  <DatePicker
                    selected={values.expireDate}
                    dateFormat="MMM dd, yyy"
                    onChange={(date) => {
                      setFieldValue('expireDate', date);
                    }}
                    className="rc-date__picker"
                  />
                  <span className="img-calendar">
                    <Calendar />
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-20">
              <FocusInput
                hasIcon={false}
                icon="star1"
                label={'Coupon Code'}
                inputClasses="mb-25"
                id="code"
                name="code"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.code}
                touched={touched.code}
                value={values.code}
                materialDesign
              />
            </div>
            <div className="row-holder">
              <div className="col-25">
                <FocusInput
                  inputClasses="mb-25"
                  label={'Discount Value'}
                  hasIcon={true}
                  id="amount"
                  name="amount"
                  icon="dollar"
                  validations={[{ type: 'number' }]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.amount}
                  touched={touched.amount}
                  value={`${values.amount}`}
                  materialDesign
                />
              </div>
              <div className="col-75 ">
                <Select
                  options={couponOptions}
                  value={values.type || couponOptions[0]}
                  isSearchable={false}
                  onChange={(v) => {
                    setFieldValue('type', v);
                  }}
                  touched={true}
                  error={errors?.type as string}
                />
              </div>
            </div>
          </div>
          {footer}
        </div>
      </Card>
    </div>
  );
};

export default styled(InlinePriceVariationFrom)`
  .date-area {
    margin: -20px -20px 0;
    padding: 20px;
    background: var(--pallete-background-default);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;

    @media (max-width: 480px) {
      margin: -20px -15px 0;
      padding: 20px 15px;
    }

    label {
      font-size: 13px;
      line-height: 16px;
      font-weight: 500;
    }

    .date-holder {
      width: calc(50% - 20px);

      @media (max-width: 640px) {
        width: 100%;
        margin: 0 0 20px;
      }

      &:last-child {
        @media (max-width: 640px) {
          margin: 0;
        }
      }
    }

    .react-datepicker {
      border: none;
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);

      .react-datepicker__triangle {
        display: none;
      }
    }

    .react-datepicker__current-month {
    }

    .react-datepicker-popper {
      z-index: 4;
    }

    .react-datepicker__header {
      background: none;
      border: none;
    }

    .react-datepicker__current-month {
      border-bottom: 1px solid #e6ebf1;
      padding: 0 0 5px;
    }

    .react-datepicker__day {
      border-radius: 100%;
      width: 28px;
      height: 28px;
      border: 1px solid transparent;

      &:hover {
        background: none;
        border-color: var(--pallete-primary-main);
        border-radius: 100%;
      }
    }

    .react-datepicker__day--keyboard-selected {
      background: var(--pallete-primary-main);

      &:hover {
        background: var(--pallete-primary-main);
      }
    }

    .date_select {
      display: flex;
      position: relative;

      .react-datepicker-wrapper {
        width: 100%;
      }

      .default:nth-child(2) {
        width: 83px;
        margin: 0 0 0 10px;
      }

      .default:nth-child(1) {
        flex-grow: 1;
        flex-basis: 0;
      }

      .img-calendar {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translate(0, -50%);
        pointer-events: none;
      }
    }
  }

  .actions-area {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;

    .button {
      width: 155px;
      min-width: 155px;
      margin: 0px 20px 0px 0px;
      padding-left: 15px;
      padding-right: 15px;
      text-align: center;
      color: rgb(0, 0, 0);
      border-color: rgb(0, 0, 0);
      border-width: 1px;
      height: 40px;

      @media (max-width: 767px) {
        width: 100%;
        margin: 0px 0px 15px;
      }

      svg {
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translate(0px, -50%);
        margin: 0px;
      }
    }

    .default {
      flex-grow: 1;
      flex-basis: 0;
      margin: 0;

      @media (max-width: 767px) {
        flex: inherit;
      }
    }
  }
`;
