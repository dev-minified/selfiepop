import React from 'react';
import ReactDatePicker from 'react-datepicker';
import styled from 'styled-components';

interface Props {
  onChange(date: Date): void;
  minDate: Date;
  className?: string;
  maxDate: Date;
  highlightDates: Date[];
  excludeDates: Date[];
  selected?: Date | null;
}

const PopLiveCalender: React.FC<Props> = (props) => {
  const {
    onChange,
    minDate,
    maxDate,
    highlightDates,
    excludeDates,
    className,
    selected,
  } = props;
  return (
    <div className={className}>
      <ReactDatePicker
        selected={selected}
        dateFormat="MMM dd, yyy"
        onChange={(date) => {
          onChange(date as Date);
        }}
        minDate={minDate}
        maxDate={maxDate}
        className="rc-date__picker"
        inline
        highlightDates={highlightDates}
        excludeDates={excludeDates}
      />
    </div>
  );
};

export default styled(PopLiveCalender)`
  .react-datepicker {
    width: 100%;
    background: var(--pallete-background-default);
    border-radius: 12px;
    border: none;
    padding: 28px 40px 16px;

    .sp_dark & {
      background: #242424;
    }

    @media (max-width: 579px) {
      padding: 15px 0;
    }
  }

  .react-datepicker__month-container {
    width: 100%;
  }

  .react-datepicker__header {
    background: none;
    border: none;
    margin: 0 0 6px;
  }

  .react-datepicker__current-month {
    color: var(--pallete-text-main);
    font-size: 18px;
    line-height: 24px;
    font-weight: 600;
    margin: 0 0 12px;
  }

  .react-datepicker__day-names,
  .react-datepicker__week {
    display: flex;
    justify-content: space-between;
  }

  .react-datepicker__day-name,
  .react-datepicker__day {
    font-weight: 600;
    font-size: 13px;
    line-height: 24px;
    color: #19181a;
    width: 32px;
    white-space: nowrap;

    .sp_dark & {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .react-datepicker__day {
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    border: 1px solid transparent;
    position: relative;
    transition: all 0.4s ease;
    margin: 4px 0;

    .sp_dark & {
      color: rgba(255, 255, 255, 0.4);
    }

    &:hover {
      background: #000;
      color: #fff;
      border-radius: 100%;
    }

    &.react-datepicker__day--disabled {
      opacity: 0.4;
      pointer-events: none;
      font-weight: 400;
    }

    &.react-datepicker__day--excluded {
      font-weight: 600;
      pointer-events: none;
      opacity: 1;
    }

    &.react-datepicker__day--keyboard-selected,
    &.react-datepicker__day--selected {
      background: var(--pallete-background-default-revers);
      color: var(--pallete-background-default);

      .sp_dark & {
        background: #000;
        color: #fff;
        border: 4px solid #fff;
      }

      &:before {
        opacity: 1;
        visibility: visible;
      }
    }

    &:before {
      position: absolute;
      left: -7px;
      top: -7px;
      bottom: -7px;
      right: -7px;
      content: '';
      border: 4px solid var(--pallete-background-default-revers);
      border-radius: 100%;
      opacity: 0;
      visibility: hidden;
      transition: all 0.4s ease;

      .sp_dark & {
        border-color: #000;
      }
    }
  }

  .react-datepicker__day--highlighted {
    background: #bcbcbc;
    color: #fff;

    .sp_dark & {
      color: #fff;
      opacity: 1;
      background: rgba(188, 188, 188, 0.2);
    }
  }

  .react-datepicker__day--keyboard-selected {
    background: var(--pallete-background-default);
    color: #fff;

    .sp_dark & {
      background: #000;
      color: #fff;
      border: 4px solid #fff;
    }

    &:hover {
      background: #000;
    }
  }

  .react-datepicker__navigation--previous {
    left: 40px;

    @media (max-width: 579px) {
      left: 10px;
    }
  }

  .react-datepicker__navigation--next {
    right: 40px;

    @media (max-width: 579px) {
      right: 10px;
    }
  }

  .react-datepicker__navigation {
    top: 44px;

    @media (max-width: 579px) {
      top: 30px;
    }
  }
`;
