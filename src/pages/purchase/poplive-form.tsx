import { getPopLiveAvailability } from 'api/Pop';
import { timezones } from 'appconstants';
import Select from 'components/Select';
import { toast } from 'components/toaster';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React, { ReactNode, useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import PopLiveCalender from './component/PopLiveCalender';
import PopLiveSlots from './component/PopLiveSlots';

dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(timezone);
dayjs.extend(isBetween);

const timeZoneOption = timezones.map((data: string) => ({
  value: data,
  label: data,
}));
interface Props {
  pop?: any;
  onSubmit?: (values: Record<string, any>) => void | Promise<any>;
  submitButton?: ReactNode;
  className?: string;
}

const convertSlotsToSelectedTimezone = (available: any, timezone: string) => {
  const slots: any = [];
  Object.entries(available!).forEach(([slot, value]: any) => {
    value.forEach((v: any) => {
      let startTime = slot + ' ' + v?.startTime;
      let endTime = slot + ' ' + v?.endTime;

      startTime = dayjs
        .utc(startTime, 'DD/MM/YYYY hh:mm a')
        .tz(timezone)
        .format('DD/MM/YYYY hh:mm a');

      endTime = dayjs
        .utc(endTime, 'DD/MM/YYYY hh:mm a')
        .tz(timezone)
        .format('DD/MM/YYYY hh:mm a');

      slots.push({ startTime, endTime });
    });
  });
  let formattedSlots: any = {};
  slots.forEach((s: any) => {
    const date = dayjs(s.startTime, 'DD/MM/YYYY hh:mm a').format('DD/MM/YYYY');
    const start = dayjs(s.startTime, 'DD/MM/YYYY hh:mm a').format('hh:mm a');
    const end = dayjs(s.endTime, 'DD/MM/YYYY hh:mm a').format('hh:mm a');
    if (formattedSlots[date]) {
      formattedSlots[date].push({ startTime: start, endTime: end });
    } else {
      formattedSlots = {
        ...formattedSlots,
        [date]: [{ startTime: start, endTime: end }],
      };
    }
  });

  return formattedSlots;
};

const PopliveForm: React.FC<Props> = ({
  pop,
  onSubmit,
  submitButton,
  className,
}) => {
  const [popLiveDate, setPopLiveDate] = useState<Date | null>(null);
  const [popLiveTime, setPopLiveTime] = useState<string>();
  const [availableSlots, setAvailableSlots] = useState<any>();
  const [timeSlots, setTimeSlots] = useState<
    { label: string; value: string }[]
  >([]);
  const [highlighted, setHighlighted] = useState<Date[]>([]);
  const [excluded, setExcluded] = useState<Date[]>([]);
  const currentTz = dayjs.tz.guess();
  const [selectedTimezone, setSelectedTimezone] = useState({
    label: currentTz,
    value: currentTz,
  });
  const [UTCSlots, setUTCSlots] = useState();
  const [popLiveStart, setPopLiveStart] = useState(dayjs().tz(currentTz));
  const [popLiveEnd, setPopLiveEnd] = useState(
    dayjs().tz(currentTz).add(6, 'days'),
  );

  useEffect(() => {
    if (pop?._id) {
      getPopLiveAvailability(pop?._id).then((res) => {
        if (res?.availableSlotsToBook) {
          setUTCSlots(res?.availableSlotsToBook);
          const slots = convertSlotsToSelectedTimezone(
            res?.availableSlotsToBook,
            selectedTimezone.value,
          );
          setAvailableSlots(slots);
          const highlight = getHighlightDates(slots);
          if (highlight[0]) setPopLiveDate(highlight[0]);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pop]);

  useEffect(() => {
    if (popLiveDate && availableSlots) {
      const slots: { label: string; value: string }[] = [];
      const current = dayjs();
      Object.entries(availableSlots!).forEach(([key, value]: any) => {
        if (dayjs(key, 'DD/MM/YYYY').isSame(dayjs(popLiveDate), 'date')) {
          value.forEach((v: any) => {
            const slot = `${v.startTime} - ${v.endTime}`;
            const slotStartTime = dayjs(v.startTime, 'hh:mm a');
            if (
              !dayjs(key, 'DD/MM/YYYY').isSame(current, 'date') ||
              slotStartTime.isAfter(current, 'minutes')
            ) {
              slots.push({ label: slot, value: slot });
            }
          });
        }
      });
      setTimeSlots(slots);
    }
  }, [popLiveDate, availableSlots]);

  useEffect(() => {
    setPopLiveStart(dayjs().tz(selectedTimezone.value));
    setPopLiveEnd(dayjs().tz(selectedTimezone.value).add(6, 'days'));
    UTCSlots &&
      setAvailableSlots(
        convertSlotsToSelectedTimezone(UTCSlots, selectedTimezone.value),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimezone]);

  useEffect(() => {
    const dates = getHighlightDates(availableSlots);
    setHighlighted(dates);
    dates[0] && setPopLiveDate(dates[0]);
    setExcluded(getExcludedDates(availableSlots));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableSlots]);

  const getHighlightDates = (slots: any) => {
    if (slots) {
      return Object.keys(slots)
        .filter((date) => {
          return dayjs(date, 'DD/MM/YYYY')?.isBetween(
            popLiveStart,
            popLiveEnd,
            'date',
            '[]',
          );
        })
        .map((date) => dayjs(date, 'DD/MM/YYYY'))
        .sort((a, b) => (a.isAfter(b, 'date') ? 1 : -1))
        .map((date) => date.toDate());
    }

    return [];
  };

  const getExcludedDates = (slots: any) => {
    let pointer = popLiveStart;
    const dates = [];
    if (availableSlots) {
      const valid = Object.keys(slots!);
      while (pointer.isSameOrBefore(popLiveEnd, 'date')) {
        if (!valid.includes(pointer.format('DD/MM/YYYY'))) {
          dates.push(pointer.toDate());
        }

        pointer = pointer.add(1, 'day');
      }
    }

    return dates;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!popLiveDate || !popLiveTime) {
      toast.error('You must select a date and time slot');
      return;
    }
    const [startTime, amPm] = popLiveTime.split('-')[0].trim().split(' ');
    let hours = parseInt(startTime.split(':')[0].trim());
    const minutes = parseInt(startTime.split(':')[1].trim());
    if (hours === 12) {
      hours = 0;
    }
    if (amPm === 'pm') {
      hours = hours + 12;
    }

    const dateTime = dayjs
      .tz(popLiveDate, selectedTimezone?.value)
      .hour(hours)
      .minute(minutes)
      .utc()
      .format();

    onSubmit?.({ dateTime });
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      <div className="form-wrap">
        <div className="title mb-35">
          <h3>Choose an available date and time:</h3>
          <h6>
            Bookings only allowed <strong>7 days</strong> from purchase.
          </h6>
          <h6>
            Available dates are marked as:{' '}
            <span className="available-dates-marker" />
          </h6>
        </div>
        <PopLiveCalender
          key={popLiveDate?.toLocaleString()}
          selected={popLiveDate}
          onChange={setPopLiveDate}
          minDate={popLiveStart.toDate()}
          maxDate={popLiveEnd.toDate()}
          highlightDates={highlighted}
          excludeDates={excluded}
        />
        <div className="select-wrap">
          <Select
            name="timezone"
            placeholder="Choose your state.."
            options={timeZoneOption}
            value={selectedTimezone}
            size="large"
            isSearchable={false}
            onChange={(timezone: any) => {
              setSelectedTimezone(timezone);
            }}
          />
        </div>

        {popLiveDate && (
          <div>
            <PopLiveSlots
              selectedDate={popLiveDate}
              slots={timeSlots}
              onChange={(value) => setPopLiveTime(value)}
            />
          </div>
        )}
      </div>
      {submitButton}
    </form>
  );
};

export default styled(PopliveForm)`
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
    background: none !important;

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

    .sp_dark & {
      color: #fff;
    }
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
    background-color: #bcbcbc;
    border-radius: 50%;
    margin-bottom: -6px;
    display: inline-block;

    .sp_dark & {
      background: #434343;
    }
  }
`;
