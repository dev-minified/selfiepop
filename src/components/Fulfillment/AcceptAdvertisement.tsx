import { Check } from 'assets/svgs';
import Button from 'components/NButton';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useState } from 'react';
import styled from 'styled-components';
import AdvertisementDateTimeRange, {
  DateTimeRange,
} from './AdvertisementDateTimeRange';
dayjs.extend(utc);

interface Props {
  className?: string;
  orderDate?: string;
  orderId?: string;
  buyer?: string;
  onAccept?: (value: DateTimeRange) => Promise<void>;
}

const getInitialRange = (orderDate: string): DateTimeRange => {
  const startDate = dayjs();
  const endDate = dayjs.utc(orderDate).local().add(5, 'days');
  const startTime = startDate.format('hh:mm a');
  const endTime = endDate.format('hh:mm a');

  return [
    { date: startDate.toDate(), time: startTime },
    { date: endDate.toDate(), time: endTime },
  ];
};

const AcceptAdvertisement: React.FC<Props> = ({
  className,
  orderDate,
  buyer,
  orderId,
  onAccept,
}) => {
  const [dateTimeRange, setDateTimeRange] = useState<DateTimeRange>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<undefined | string>();

  const onSubmit = async () => {
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
      setError(
        'There should be atleast 1 hour difference between start and end time',
      );
      return;
    }
    setError(undefined);

    setIsLoading(true);
    dateTimeRange && (await onAccept?.(dateTimeRange));
    setIsLoading(false);
  };
  return (
    <div className={className}>
      <div className="heading-box">
        <h3>Accept the request</h3>
        <p>
          Please specify the date and time you will run the promotion for{' '}
          <strong className="name">{buyer}</strong>
        </p>
      </div>
      <AdvertisementDateTimeRange
        key={orderId}
        initialRange={orderDate ? getInitialRange(orderDate) : undefined}
        min={new Date()}
        max={dayjs.utc(orderDate).local().add(5, 'days').toDate()}
        onDateTimeRangeChange={setDateTimeRange}
        error={error}
      />
      <div className="text-center">
        <Button
          onClick={onSubmit}
          isLoading={isLoading}
          disabled={isLoading}
          shape="circle"
          size="large"
          type={'primary'}
          className="mb-15"
        >
          Accept Request
          <span className="ml-5 mr-n5 btn-icon">
            <Check />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default styled(AcceptAdvertisement)``;
