import { CloseCircle, Plus, PollIcon } from 'assets/svgs';
import Select from 'components/Select';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import InputDragable from '../components/InputDragable';
interface Props {
  className?: string;
  setShowPoll?: Function;
  onChangePoll?: (...args: any[]) => void;
}

const EVENT_STATUSES = [
  { label: '7 days', value: '7_days' },
  { label: 'One month', value: '1_month' },
  { label: 'One year', value: '1_year' },
];

const WritePost: React.FC<Props> = ({
  className,
  setShowPoll,
  onChangePoll,
}) => {
  const [outline, setOutline] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [duration, setDuration] = useState<(typeof EVENT_STATUSES)[0]>(
    EVENT_STATUSES[0],
  );
  useEffect(() => {
    onChangePoll?.({
      duration: dayjs().utc().format(),
      items: outline
        ?.filter((item: any) => !!item && !!item?.trim())
        ?.map((i: string) => ({ title: i })),
    });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);
  const updatesorting = async (data: any) => {
    const filteredData = data?.filter((item: any) => !!item && !!item?.trim());
    setOutline([...filteredData, '']);
    onChangePoll?.({
      duration: dayjs().utc().format(),
      items: [...filteredData.map((i: string) => ({ title: i }))],
    });
  };

  return (
    <div className={className}>
      <div className="poll-block">
        <div className="poll-head">
          <strong className="heading-holder">
            <PollIcon />
            Create Poll
          </strong>{' '}
          <div className="duration-holder">
            <span className="duration-title">Duration :</span>
            <Select
              isSearchable={false}
              options={EVENT_STATUSES}
              onChange={(value) => {
                setDuration(value as any);
              }}
              defaultValue={EVENT_STATUSES[0]}
              placeholder="Select"
              styles={{
                container: (base) => ({ ...base, width: '90px' }),
              }}
              value={duration}
            />
          </div>
          <span onClick={() => setShowPoll?.(false)} className="btn-close">
            <CloseCircle />
          </span>
        </div>
        <InputDragable
          value={outline}
          onChange={(v: any) => {
            updatesorting(v);
          }}
          autoAddAndRemove={false}
          selected={selected}
          setSelected={setSelected}
          setOutline={setOutline}
        />
        <div
          onClick={() => setOutline((pre) => [...pre, ''])}
          className="add-options"
        >
          <Plus /> ADD ANOTHER OPTION
        </div>
      </div>
    </div>
  );
};

export default styled(WritePost)`
  .poll-block {
    margin: -20px -20px 20px;
    padding: 20px;
    background: var(--pallete-background-gray-secondary-light);
    border-bottom: 1px solid var(--pallete-colors-border);

    @media (max-width: 479px) {
      margin: -15px -15px 15px;
      padding: 15px;
    }

    .poll-head {
      position: relative;
      padding: 0 50px 0 0;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      margin: 0 0 15px;

      .heading-holder {
        font-size: 15px;
        line-height: 20px;
        color: #a3a5ba;
        min-width: 160px;
        padding: 0 20px 0 0;

        @media (max-width: 580px) {
          min-width: inherit;
        }

        @media (max-width: 479px) {
          width: 100%;
          margin: 0 0 15px;
        }

        svg {
          margin: 0 10px 0 0;
        }
      }

      .duration-holder {
        display: flex;
        align-items: center;
        font-size: 13px;
        line-height: 16px;
        color: #a5a5a5;

        .duration-title {
          margin: 0 10px 0 0;
        }

        .title {
          display: none !important;
        }

        .select-box {
          width: 140px;
        }

        .react-select__control {
          border-radius: 40px;
          min-height: 30px;

          .react-select__indicator-separator {
            display: none;
          }

          .react-select__indicators {
            width: 28px;
            height: 28px;
            background: none;
          }
        }
        .react-select__value-container {
          font-size: 12px;
          font-weight: 500;
        }

        .react-select__control {
          border-color: #e6ecf5;

          .css-1okebmr-indicatorSeparator {
            background-color: #e6ecf5;
          }
        }
      }
    }

    .btn-close {
      position: absolute;
      right: 0;
      top: 0;
      width: 20px;
      cursor: pointer;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    .add-options {
      margin: 0 0 0 20px;
      font-size: 13px;
      line-height: 15px;
      font-weight: 500;
      color: var(--pallete-primary-light);
      cursor: pointer;

      svg {
        width: 8px;
        display: inline-block;
        vertical-align: top;
      }

      &:hover {
        color: var(--colors-indigo-200);
      }
    }

    .poll-sortable {
      overflow: hidden;
    }
  }
  .materialized-input {
    textarea {
      &.form-control {
        padding: 0;
        border: none;
      }
    }
  }
`;
