import dayjs from 'dayjs';
import advancedFormats from 'dayjs/plugin/advancedFormat';
import React from 'react';
import styled from 'styled-components';
import RadioGroup from '../../../components/RadioGroup';
dayjs.extend(advancedFormats);

interface Props {
  className?: string;
  selectedDate: Date;
  slots: { label: string; value: string }[];
  onChange(value: string): void;
}

const PopLiveSlots: React.FC<Props> = (props) => {
  const { selectedDate, className, slots = [], onChange } = props;
  return (
    <div className={className}>
      <div className="title mb-30">
        <h4>
          Available Time for:{' '}
          <span className="current-date">
            {dayjs(selectedDate).format('dddd, MMMM Do')}
          </span>
        </h4>
      </div>
      <RadioGroup
        name="poplive-slot"
        items={slots}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default styled(PopLiveSlots)`
  h4 {
    font-size: 17px;
    line-height: 24px;
    margin: 0 0 20px;
    color: #919191;
    font-weight: 500;

    .current-date {
      color: var(--pallete-text-main);
    }
  }

  .radios-list {
    padding: 0 30px 20px;

    @media (max-width: 579px) {
      padding: 0 0 20px;
    }
  }

  .radio {
    label {
      padding: 0;
      min-width: 170px;

      @media (max-width: 767px) {
        min-width: 160px;
      }

      &:hover {
        .label-text {
          background: #4a4a4a;
          border-color: #4a4a4a;
          color: #fff;
        }
      }
    }

    .custom-input-holder {
      //display: none;
      width: 22px;
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translate(0, -50%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.4s ease;
    }

    .custom-input {
      margin: 0;
      width: 22px;
      height: 22px;
      border: none !important;

      .sp_dark & {
        background: #fff;
      }

      &:before {
        bottom: auto;
        right: auto;
        top: 6px;
        left: 4px;
        width: 14px;
        height: 8px;
        border-top: 3px solid #4a4a4a;
        border-right: 3px solid #4a4a4a;
        border-radius: 0;
        background: none !important;
        transform: rotate(125deg);

        .sp_dark & {
          background: #fff;
        }
      }
    }

    input[type='radio']:checked {
      + .label-text,
      ~ .label-text {
        background: #4a4a4a;
        border-color: #4a4a4a;
        color: #fff;

        .sp_dark & {
          background: rgba(255, 255, 255, 0.3);
          border-color: transparent;
        }
      }

      + .custom-input-holder {
        opacity: 1;
        visibility: visible;
      }
    }

    .label-text {
      color: var(--pallete-text-main);
      font-size: 14px;
      line-height: 18px;
      font-weight: 600;
      padding: 13px 10px;
      text-align: center;
      background: var(--pallete-background-default);
      border-radius: 4px;
      border: 1px solid #d1d1d1;
      display: block;
      width: 100%;
      transition: all 0.4s ease;

      .sp_dark & {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.6);
        border-color: transparent;
      }

      &:after {
        .sp_dark & {
          display: none;
        }
      }
    }
  }
`;
