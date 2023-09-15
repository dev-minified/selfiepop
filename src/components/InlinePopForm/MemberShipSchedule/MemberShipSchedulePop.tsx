import * as constants from 'appconstants';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import RightView from 'pages/schedule-messaging/components/RightView/RightView';
import ScheduleMessagingCalender from 'pages/schedule-messaging/components/ScheduleMessagingCalender';
import { stringify } from 'querystring';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { mySchedulePostsList } from 'store/reducer/member-post';
import {
  getCurrentDayPostsMessages,
  // getMediaList,
  getMessages,
  reInitializeScheduleState,
  resetCurrentPostsMessages,
  setSelectedDate,
  setSelectedView,
} from 'store/reducer/scheduledMessaging';
import styled from 'styled-components';
import { parseQuery } from 'util/index';

const variants = {
  initial: (direction: string) => {
    return direction === 'left'
      ? {
          left: '-100vw',
          opacity: 0,
          position: 'absolute',
        }
      : {
          left: '100vw',
          opacity: 0,
          position: 'absolute',
        };
  },
  animate: {
    left: '0',
    opacity: 1,
    // position: 'relative',
  },
  exit: (direction: string) => {
    return direction === 'left'
      ? {
          left: '-100vw',
          opacity: 0,
          position: 'absolute',
        }
      : {
          left: '100vw',
          opacity: 0,
          position: 'absolute',
        };
  },
};
type ActionTypes = {
  status?: boolean;
  delete?: boolean;
  close?: boolean;
  toggel?: boolean;
  edit?: boolean;
  view?: boolean;
};
interface Props {
  value?: any;
  cbonSubmit?: Function;
  cbonCancel?: Function;
  className?: string;
  options?: ActionTypes;
  questionActions?: ActionTypes;
  onChange?: Function;
}
const MemberShipSchedulePop = ({ className }: Props) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const st = parseQuery(history.location?.search);
  const { step, subType, date, view } = st;

  const selectedDate = useAppSelector(
    (state) => state.scheduledMessaging.selectedDate,
  );

  // useEffect(() => {
  //   const queryDate = date ? dayjs(date as string, 'MM-DD-YYYY') : dayjs();
  //   const startDate = dayjs
  //     .utc(queryDate.startOf('month'))
  //     .format('YYYY-MM-DD');
  //   const endDate = dayjs.utc(queryDate.endOf('month')).format('YYYY-MM-DD');
  //   dispatch(getMessages({ startDate, endDate })).then(() => {
  //     console.log('messges');
  //     dispatch(updateFilteredMessages());
  //   });
  //   dispatch(getMediaList());
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  useEffect(() => {
    dispatch(reInitializeScheduleState());
    const queryDate = date ? dayjs(date as string, 'MM-DD-YYYY') : dayjs();
    const startDate = dayjs
      .utc(queryDate.startOf('month'))
      .format('YYYY-MM-DD');
    const endDate = dayjs.utc(queryDate.endOf('month')).format('YYYY-MM-DD');
    dispatch(getMessages({ startDate, endDate, sellerId: '' })).then(() => {});
    // dispatch(getMediaList({ sellerId: '' }));
    const params = { startDate, endDate, sellerId: '' };
    dispatch(
      mySchedulePostsList({
        params,
        customError: { ignoreStatusCodes: [404] },
      }),
    )
      .then(() => {})
      .finally(() => {
        dispatch(getCurrentDayPostsMessages());
      });
    return () => {
      // dispatch(reInitializeScheduleState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (
      constants.ScheduledMessagingViews.includes(
        view as ScheduledMessagingViews,
      )
    ) {
      dispatch(setSelectedView(view as ScheduledMessagingViews));
    }

    if (date && dayjs(date as string).isValid()) {
      dispatch(setSelectedDate(dayjs(date as string)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleClick = async (steps: Record<string, any>) => {
    delete st.step;
    history.replace(
      `?${stringify({
        ...st,
        date: steps.date,
        view: steps.view,
        ...(steps.slider ? { slider: steps.slider } : {}),
        ...(steps.step ? { step: steps.step } : {}),
      })}`,
    );
  };

  const onMonthChange = (month: string) => {
    dispatch(resetCurrentPostsMessages());
    const startDate = dayjs
      .utc(dayjs(month, 'MM').startOf('month'))
      .format('YYYY-MM-DD');
    const endDate = dayjs
      .utc(dayjs(month, 'MM').endOf('month'))
      .format('YYYY-MM-DD');

    dispatch(getMessages({ startDate, endDate }));
    const params = { startDate, endDate };
    dispatch(
      mySchedulePostsList({
        params,
        customError: { ignoreStatusCodes: [404] },
      }),
    );
  };

  return (
    <div className={className}>
      {step === '2' ? (
        <AnimatePresence initial={false}>
          <motion.div
            key="right"
            custom={'right'}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants as any}
            style={{ width: '100%', position: 'relative' }}
            transition={{ mass: 0.2, duration: 0.6 }}
            className="left-col"
          >
            <RightView />
          </motion.div>
        </AnimatePresence>
      ) : step === '1' ? (
        <AnimatePresence initial={false}>
          <motion.div
            key="left"
            custom={'left'}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants as any}
            style={{ width: '100%', position: 'relative' }}
            transition={{ mass: 0.2, duration: 0.6 }}
            className="left-col"
          >
            <ScheduleMessagingCalender
              onMonthChange={onMonthChange}
              selectedDate={selectedDate}
              onAddClick={() => {
                handleClick({
                  pathStep: subType,
                  slider: 'schedule',
                  step: 2,
                  date: dayjs().format('MM-DD-YYYY'),
                  view: 'add',
                });
                dispatch(setSelectedView('add'));
              }}
              onDateChange={(date) => {
                dispatch(setSelectedDate(dayjs(date)));
                dispatch(setSelectedView('listing'));
                handleClick({
                  pathStep: subType,
                  slider: 'schedule',
                  step: 2,
                  date: dayjs(date).format('MM-DD-YYYY'),
                  view: 'listing',
                });
              }}
            />
          </motion.div>
        </AnimatePresence>
      ) : (
        <></>
      )}
    </div>
  );
};
export default styled(MemberShipSchedulePop)`
  overflow: hidden;

  .react-emoji .react-input-emoji--wrapper {
    background: var(--pallete-background-primary-gray-secondary);
  }
  .calendar-schedule {
    margin: 0;
  }
  .rc-tabs-content-holder {
    margin: 0;
  }
  .scheduling-area {
    padding: 0;
    margin: 0 15px 10px;
    background: var(--pallete-background-default);

    .btns-links {
      padding: 14px 0 9px;
    }

    .input-actions__img {
      margin: -13px 0 0 10px;

      &.newClass {
        bottom: 7px;
        left: 10px;
        margin: 0;
      }
    }

    .inputs-field {
      .price-field {
        @media (max-width: 767px) {
          width: 135px;
        }
      }
    }
  }

  .schedule-detail {
    z-index: inherit;
    margin: 0;
    @media (max-width: 479px) {
      padding: 14px 15px 14px 40px;
    }
    .message {
      @media (max-width: 479px) {
        font-size: 13px;
        line-height: 1.25;
      }
    }
    .icon-time {
      @media (max-width: 479px) {
        font-size: 20px;
      }
    }
    .select-values {
      @media (max-width: 479px) {
        min-width: 90px;
        margin: 0 0 0 10px;
      }
    }
    .select-units {
      @media (max-width: 479px) {
        min-width: 84px;
        margin: 0 0 0 10px;
      }
    }

    .react-select-container {
      position: relative;
      z-index: 11;
    }
  }
  .chat_sub {
    .rc-scollbar {
      width: 100%;
    }

    .react-emoji {
      .react-input-emoji--wrapper {
        background: var(--pallete-background-primary-gray);
      }
    }

    .sub-tab-cotnent {
      padding: 0 10px;
    }

    hr {
      margin: 0 -10px;
    }
  }
  .personal-info {
    padding: 20px;
    @media (max-width: 479px) {
      padding: 20px 15px;
    }
    .react-datepicker__current-month {
      color: var(--pallete-primary-main);
    }
    .react-datepicker__day {
      &.react-datepicker__day--selected,
      &.react-datepicker__day--keyboard-selected,
      &:hover {
        background: var(--pallete-primary-main);
      }
      &:before {
        border-color: var(--pallete-primary-main);
      }
    }
  }
  .heading-box {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    font-size: 14px;
    line-height: 18px;
    color: var(--pallete-text-main);
    font-weight: 400;
    .img {
      width: 40px;
      height: 40px;
      background: var(--pallete-primary-darker);
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      overflow: hidden;
    }
    .description {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
      padding: 0 0 0 10px;
    }
    .description-title {
      display: block;
      font-size: 15px;
      line-height: 18px;
      font-weight: 500;
      margin: 0 0 3px;
    }
  }
  .footer-links {
    padding: 20px;
    text-align: center;
    border-top: 1px solid var(--pallete-colors-border);
  }
  ul.sortable {
    margin-top: 20px;
    .card--price {
      white-space: nowrap;
    }
    .card--text {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
    }
    .card--title {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .price-area {
    display: flex;
    flex-direction: row;
    align-items: center;
    .text-input {
      width: 141px;
      margin: 0 10px 10px 0 !important;
    }
    .price-info {
      font-size: 13px;
      line-height: 15px;
      color: var(--pallete-text-main-100);
      font-weight: 500;
      margin: 0 0 10px;
    }
  }
  .price-description {
    color: #959a9f;
    font-size: 13px;
    line-height: 15px;
    strong {
      color: var(--pallete-text-main);
    }
  }
  .card-header-box {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.2857;
    color: var(--pallete-text-lighter-50);
    margin: 0 0 25px;
    .header-image {
      width: 40px;
      height: 40px;
      background: var(--pallete-primary-main);
      color: #e5e5e5;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header-title {
      color: var(--pallete-text-main);
      font-size: 15px;
    }
    .header-text {
      flex-grow: 1;
      flex-basis: 0;
      min-width: 0;
      padding: 0 0 0 12px;
    }
    p {
      margin: 0;
    }
  }
  .dashedLine {
    margin: 0 -20px;
    border: none;
    height: 1px;
    background: #e6ecf5;
  }
`;
