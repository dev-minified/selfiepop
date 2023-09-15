import { ArrowRightAlt } from 'assets/svgs';
import FocusInput from 'components/focus-input';
import Button from 'components/NButton';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import React from 'react';
import styled from 'styled-components';
import * as yup from 'yup';
import AdvertisementDateTimeRange, {
  DateTimeRange,
} from './AdvertisementDateTimeRange';

interface Props {
  className?: string;
  buyer?: string;
  onSubmit?: (date: {
    price: number;
    description: string;
    dateTimeRange: DateTimeRange;
  }) => Promise<void>;
  onCancel?: () => void;
}

const validationSchema = yup.object().shape({
  price: yup
    .number()
    .max(2500, 'Price should be from $5 to $2500')
    .min(5, 'Price should be from $5 to $2500')
    .required('Price should be from $5 to $2500'),
  description: yup.string().max(500).required('Description is required!'),
  dateTimeRange: yup.array().required('Must select date and time range'),
});

const AlternateOfferAdvertisement: React.FC<Props> = ({
  buyer,
  className,
  onSubmit,
  onCancel,
}) => {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    handleChange,
    setFieldValue,
  } = useFormik<{
    price: number;
    description: string;
    dateTimeRange: DateTimeRange;
  }>({
    validationSchema,
    validate: (values) => {
      const { dateTimeRange } = values;
      const time1 = dayjs(
        `${dayjs(dateTimeRange?.[0]?.date).format('DD/MM/YYYY')} ${
          dateTimeRange?.[0]?.time
        }`,
        'DD/MM/YYYY hh:mm a',
      );
      const time2 = dayjs(
        `${dayjs(dateTimeRange?.[1]?.date).format('DD/MM/YYYY')} ${
          dateTimeRange?.[1]?.time
        }`,
        'DD/MM/YYYY hh:mm a',
      );

      if (time2.diff(time1, 'hours') < 1) {
        return {
          dateTimeRange:
            'There should be atleast 1 hour difference between start and end time',
        };
      }
    },
    initialValues: {
      price: 0,
      description: '',
      dateTimeRange: [
        { date: new Date(), time: '01:00 am' },
        { date: new Date(), time: '01:00 am' },
      ],
    },
    onSubmit: async (values) => {
      await onSubmit?.(values);
    },
  });

  const getInitialRange = (): DateTimeRange => {
    const startDate = dayjs();
    const endDate = startDate.add(5, 'days');
    const startTime = startDate.format('hh:mm a');
    const endTime = endDate.format('hh:mm a');

    return [
      { date: startDate.toDate(), time: startTime },
      { date: endDate.toDate(), time: endTime },
    ];
  };

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
      className={className}
    >
      <div className="heading-box">
        <h3>Submit an alternate offer</h3>
        <p>
          Please specify the date and time you will run the promotion for&nbsp;
          <strong className="name">{buyer}</strong>
        </p>
      </div>
      <FocusInput
        inputClasses="mb-25"
        label={'Price'}
        hasIcon={true}
        id="price"
        name="price"
        icon="dollar"
        type="number"
        validations={[{ type: 'number' }]}
        materialDesign
        onChange={handleChange}
        value={`${values.price}`}
        error={errors.price}
        touched={touched.price}
      />
      <FocusInput
        label={'Offer Details'}
        inputClasses="mb-5"
        id="description"
        name="description"
        type="textarea"
        rows={6}
        limit={500}
        materialDesign
        onChange={handleChange}
        value={values.description}
        error={errors.description}
        touched={touched.description}
      />
      <AdvertisementDateTimeRange
        min={new Date()}
        initialRange={getInitialRange()}
        onDateTimeRangeChange={(dateTimeRange) => {
          setFieldValue('dateTimeRange', dateTimeRange);
        }}
        error={errors.dateTimeRange as string}
      />
      <div className="text-center">
        <Button onClick={onCancel} shape="circle" size="middle" type={'info'}>
          Cancel
        </Button>
        <Button
          isLoading={isSubmitting}
          disabled={isSubmitting}
          htmlType="submit"
          shape="circle"
          size="middle"
          type={'primary'}
        >
          Submit Offer
          <span className="btn-icon ml-15">
            <ArrowRightAlt />
          </span>
        </Button>
      </div>
    </form>
  );
};

export default styled(AlternateOfferAdvertisement)`
  .button-primary {
    min-width: 220px;
  }

  .button-info {
    min-width: 150px;
  }
`;
