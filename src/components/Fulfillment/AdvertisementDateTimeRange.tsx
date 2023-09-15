import { Calendar } from 'assets/svgs';
import Select from 'components/Select';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import styled from 'styled-components';

const options: { value: string; label: string }[] = [];
['am', 'pm'].forEach((ap) => {
  [...Array(12)].forEach((_, hours) => {
    [...Array(12)].forEach((_, minutes) => {
      const m = ((minutes + 1) * 5) % 60;
      const h = hours + 1;
      options.push({
        value: `${h <= 9 ? 0 : ''}${h}:${m <= 9 ? 0 : ''}${m} ${ap}`,
        label: `${h <= 9 ? 0 : ''}${h}:${m <= 9 ? 0 : ''}${m} ${ap}`,
      });
    });
  });
});

interface Props {
  className?: string;
  disabled?: boolean;
  initialRange?: DateTimeRange;
  rangeGap?: number;
  min?: Date;
  max?: Date;
  onDateTimeRangeChange?: (dateTimeRange: DateTimeRange) => void;
  error?: string;
}

export type DateTimeRange = [
  { date: Date; time: string },
  { date: Date; time: string },
];

const AdvertisementDateTimeRange: React.FC<Props> = ({
  className,
  initialRange,
  rangeGap = 5,
  min,
  max,
  onDateTimeRangeChange,
  disabled = false,
  error,
}) => {
  const [dateTimeRange, setDateTimeRange] = useState<DateTimeRange>(
    initialRange || [
      { date: new Date(), time: options[0].value },
      { date: new Date(), time: options[0].value },
    ],
  );
  useEffect(() => {
    onDateTimeRangeChange?.(dateTimeRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateTimeRange]);

  const updateDateTimeRange = (
    value: Date | string,
    type: 'date' | 'time',
    index: 0 | 1,
  ) => {
    setDateTimeRange((prev) => {
      if (type === 'date') {
        const start = index === 0 ? dayjs(value) : dayjs(prev[0].date);
        const end = index === 1 ? dayjs(value) : dayjs(prev[1].date);
        if (start.isAfter(end, 'date') || start.diff(end, 'day') > rangeGap) {
          return prev;
        }
      }
      const updated: DateTimeRange = [...prev];
      updated[index] = { ...updated[index], [type]: value };
      return updated;
    });
  };

  return (
    <div className={className}>
      <div className="widget-datepicker">
        <div className="calendar-holder">
          <span className="label-item">Start Date</span>
          <ReactDatePicker
            selected={dateTimeRange[0].date}
            minDate={min}
            maxDate={max}
            onChange={(value) => {
              updateDateTimeRange(value as Date, 'date', 0);
            }}
            disabled={disabled}
            showTimeSelect={false}
            dateFormat="MMMM do - yyyy"
          />
          <span className="img-calendar">
            <Calendar />
          </span>
        </div>
        <span className="text">@</span>
        <div className="select-holder">
          <span className="label-item">Time</span>
          <Select
            options={options}
            disabled={disabled}
            size="x-small"
            value={{
              label: dateTimeRange[0].time,
              value: dateTimeRange[0].time,
            }}
            onChange={(value) => {
              updateDateTimeRange(value?.value!, 'time', 0);
            }}
            isSearchable
          />
        </div>
      </div>
      <div className="widget-datepicker">
        <div className="calendar-holder">
          <span className="label-item">End Date</span>
          <ReactDatePicker
            selected={dateTimeRange[1].date}
            minDate={min}
            maxDate={max}
            disabled={disabled}
            onChange={(value) => {
              updateDateTimeRange(value as Date, 'date', 1);
            }}
            showTimeSelect={false}
            dateFormat="MMMM do - yyyy"
          />
          <span className="img-calendar">
            <Calendar />
          </span>
        </div>
        <span className="text">@</span>
        <div className="select-holder">
          <span className="label-item">Time</span>
          <Select
            options={options}
            disabled={disabled}
            size="x-small"
            value={{
              label: dateTimeRange[1].time,
              value: dateTimeRange[1].time,
            }}
            onChange={(value) => {
              updateDateTimeRange(value?.value!, 'time', 1);
            }}
            isSearchable
          />
        </div>
      </div>
      {error && <span className="error">{error}</span>}
    </div>
  );
};
export default styled(AdvertisementDateTimeRange)`
  background: var(--pallete-background-gray);
  border: 1px solid var(--pallete-colors-border);
  border-radius: 5px;
  padding: 20px 17px;
  margin: 0 0 30px;

  .widget-datepicker {
    display: flex;
    flex-direction: row;
    align-items: center;

    @media (max-width: 479px) {
      flex-wrap: wrap;
    }

    + .widget-datepicker {
      margin-top: 30px;
    }

    .react-select__control {
      border-color: var(--pallete-background-pink);

      .react-select__indicator-separator {
        /* background: #d7b3e3; */
      }
    }
  }

  .error {
    color: #f00;
    font-size: 14px;
    line-height: 18px;
  }

  .text {
    color: rgba(0, 0, 0, 0.3);
    font-size: 18px;
    line-height: 21px;
    margin: 0 15px;

    @media (max-width: 479px) {
      margin: 0 15px 0 0;
    }
  }

  .label-item {
    position: absolute;
    left: 10px;
    padding: 5px;
    top: -13px;
    color: var(--pallete-text-main-500);
    font-size: 13px;
    line-height: 15px;
    z-index: 2;

    &:after {
      position: absolute;
      left: 0;
      right: 0;
      top: 13px;
      content: '';
      height: 1px;
      background: var(--pallete-background-default);
      z-index: -1;
    }
  }

  .calendar-holder {
    position: relative;
    width: 234px;
    height: 40px;

    @media (max-width: 479px) {
      width: 100%;
      margin: 0 0 20px;
    }

    input[type='text'] {
      height: 40px;
      border: 1px solid var(--pallete-background-pink);
      border-radius: 3px;
      padding: 10px 15px;
      font-size: 15px;
      line-height: 18px;
      outline: none;
      width: 100%;

      .sp_dark & {
        background: #000;
        color: #fff;
      }
    }

    .react-datepicker-popper {
      z-index: 2;
    }

    .react-datepicker-wrapper {
      display: block;
      width: 100%;
    }

    .img-calendar {
      width: 18px;
      height: 18px;
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translate(0, -50%);
      pointer-events: none;

      svg {
        display: block;
      }
    }
  }

  .select-holder {
    position: relative;
    width: 130px;

    @media (max-width: 479px) {
      width: calc(100% - 33px);
    }
  }
  .error {
    color: red;
    padding-top: 1rem;
    margin: 0;
  }
`;
