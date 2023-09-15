import { ChevronLeft, ChevronRight, Plus } from 'assets/svgs';
import Button from 'components/NButton';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useAppSelector } from 'hooks/useAppSelector';
import React, { useMemo } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
dayjs.extend(utc);

interface Props {
  className?: string;
  selectedDate: dayjs.Dayjs;
  onAddClick?(): void;
  onDateChange?(date: Date): void;
  onMonthChange?(month: string): void;
}

interface CalenderHeaderProps {
  date: Date;
  changeYear(year: number): void;
  changeMonth(month: number): void;
  customHeaderCount: number;
  decreaseMonth(): void;
  increaseMonth(): void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
  decreaseYear(): void;
  increaseYear(): void;
  prevYearButtonDisabled: boolean;
  nextYearButtonDisabled: boolean;
  onMonthChange(selectedMonth: string): void;
}

const CalenderHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  onMonthChange,
}: CalenderHeaderProps) => {
  return (
    <div className="title-head">
      <div className="arrows-area">
        <div className="arrows-wrap">
          <Button
            onClick={() => {
              decreaseMonth();
              onMonthChange(dayjs(date).subtract(1, 'month').format('MM'));
            }}
            disabled={prevMonthButtonDisabled}
            icon={<ChevronLeft />}
            type="text"
          />
          <Button
            onClick={() => {
              increaseMonth();
              onMonthChange(dayjs(date).add(1, 'month').format('MM'));
            }}
            disabled={nextMonthButtonDisabled}
            icon={<ChevronRight />}
            type="text"
          />
        </div>
        <span>{dayjs(date).format('MMMM YYYY')}</span>
      </div>
      {/* <div className="tags">
        <span>Posts</span>
        <span>Messages</span>
        <span>Streams</span>
      </div> */}
    </div>
  );
};

const CustomDate: React.FC<{ date?: Date; onDateClick(date: Date): void }> = ({
  date,
  onDateClick,
}) => {
  // const myPostList = useAppSelector((state) => state.mysales.myposts);
  const posts = useAppSelector(
    (state) => state.scheduledMessaging.scheduleData?.posts,
  );
  const messages = useAppSelector(
    (state) => state.scheduledMessaging.scheduleData?.messages,
  );

  // const messages = useAppSelector((state) => state.scheduledMessaging.messages);
  const isGreater = dayjs(date).isBefore(dayjs(), 'date');

  const count = useMemo(() => {
    if (date) {
      const dayjsDate = dayjs(date);

      const month = dayjsDate.month();
      const year = dayjsDate.year();
      const day = dayjsDate.date();
      let count = 0;

      const monthPosts = posts?.[`${year}-${month}`];
      const monthMessages = messages?.[`${year}-${month}`];
      if (monthPosts && monthPosts?.[day]) {
        count += [...(monthPosts?.[day] || [])].length;
      }
      if (monthMessages && monthMessages?.[day]) {
        count += [...(monthMessages?.[day] || [])].length;
      }

      return count;
    }

    return 0;
  }, [date, messages, posts]);

  return (
    <div
      className={`react-datepicker-day-wrap ${!isGreater ? 'day_color' : ''}`}
      onClick={() => {
        date && onDateClick(date);
      }}
    >
      <span className="date">{dayjs(date).format('D')}</span>
      {count > 0 ? <span className="duration">{count}</span> : null}
    </div>
  );
};

const ScheduleMessagingCalender: React.FC<Props> = (props) => {
  const { className, onAddClick, onDateChange, onMonthChange, selectedDate } =
    props;

  return (
    <div className={`${className} calendar-schedule`}>
      <div className="calendar-head">
        <Button
          onClick={onAddClick}
          disabled={selectedDate.isBefore(dayjs(), 'date')}
          icon={<Plus />}
          type="text"
        />
      </div>
      <ReactDatePicker
        renderCustomHeader={(props) => (
          <CalenderHeader
            {...props}
            onMonthChange={(month) => onMonthChange?.(month)}
          />
        )}
        renderDayContents={(dayOfMonth: number, date?: Date) => {
          return (
            <CustomDate
              date={date}
              onDateClick={(date) => onDateChange?.(date)}
            />
          );
        }}
        selected={selectedDate?.toDate()}
        inline
        onChange={(value: Date) => onDateChange?.(value)}
      />
    </div>
  );
};

export default styled(ScheduleMessagingCalender)`
  margin: -24px -18px;
  .day_color {
    color: var(--pallete-text-main);

    .sp_dark {
      opacity: 0.8;
    }
  }

  .calendar-head {
    min-height: 57px;
    border-bottom: 1px solid var(--pallete-colors-border);
    background: var(--pallete-background-default);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px 15px;

    .button {
      .sp_dark & {
        color: var(--pallete-text-main);
      }
    }
  }

  .react-datepicker {
    width: 100%;
    border: none;
    font-family: 'Roboto', sans-serif;
    background-color: var(--pallete-background-default);
  }

  .react-datepicker__day-names,
  .react-datepicker__week {
    display: flex;
  }

  .react-datepicker__day-names {
    padding: 0 0 4px;
  }

  .react-datepicker__week {
    border-bottom: 1px solid var(--pallete-colors-border);
  }

  .react-datepicker__day-name {
    flex: 1;
    font-size: 13px;
    line-height: 17px;
    font-weight: 500;
    color: var(--pallete-text-main);
  }

  .react-datepicker__day {
    flex: 1;
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
    color: var(--colors-darkGrey-300);
    margin: 0;
    border-right: 1px solid var(--pallete-colors-border);
    border-radius: 0 !important;

    &:hover {
      border-radius: 0 !important;
      background-color: var(--pallete-background-light);
    }
  }

  .react-datepicker__month {
    margin: 0;
    border-top: 1px solid var(--pallete-colors-border);
  }

  .react-datepicker__month-container {
    width: 100%;
  }

  .react-datepicker__header {
    border: none;
    background: none;
    padding: 0;
  }

  .title-head {
    padding: 18px 18px 0;
    font-size: 16px;
    line-height: 18px;
    color: var(--colors-darkGrey-300);
    font-weight: 500;

    .sp_dark & {
      color: var(--pallete-text-main);
    }

    .arrows-area {
      margin: 0 0 20px;
      padding: 0 60px;
      position: relative;
    }

    .arrows-wrap {
      position: absolute;
      left: -10px;
      top: 50%;
      transform: translate(0, -50%);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      line-height: 19px;
      color: var(--colors-darkGrey-300);
      font-weight: 500;
      width: 100%;

      .button {
        color: rgba(138, 150, 163, 0.39);

        .sp_dark & {
          color: var(--pallete-text-main);
        }

        + .button {
          margin-left: 0;
        }

        &:hover {
          color: #8a96a3;

          .sp_dark & {
            color: var(--pallete-text-main);
          }
        }
      }

      svg {
        width: 9px;
        height: 15px;

        path {
          fill: currentColor;
        }
      }
    }
  }

  .tags {
    margin: 0 -4px;

    span {
      background: #e8ecef;
      font-size: 14px;
      line-height: 16px;
      font-weight: 400;
      color: var(--pallete-text-main);
      padding: 7px 10px;
      border: none;
      border-radius: 30px;
      text-transform: none;
    }
  }

  .react-datepicker-day-wrap {
    height: 89px;
    display: flex;
    justify-content: space-between;
    text-align: center;
    flex-direction: column;
    padding: 8px 6px 5px;
  }

  .duration {
    background: var(--pallete-primary-main);
    color: #fff;
    border-radius: 4px;
    padding: 6px;
    display: inline-block;
    vertical-align: top;
  }

  .react-datepicker__day--keyboard-selected,
  .react-datepicker__month-text--keyboard-selected,
  .react-datepicker__quarter-text--keyboard-selected,
  .react-datepicker__year-text--keyboard-selected {
    background: var(--pallete-text-lighter-300);
  }

  .react-datepicker__day--selected {
    background-color: var(--pallete-background-light);

    &:hover {
      background-color: var(--pallete-background-light);
    }
  }

  .react-datepicker__day--outside-month {
    color: #ccc;

    .date {
      color: #ccc;
    }
  }
`;
