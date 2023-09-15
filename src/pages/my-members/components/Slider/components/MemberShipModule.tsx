import * as constants from 'appconstants';
import dayjs from 'dayjs';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import ScheduleMessagingCalender from 'pages/schedule-messaging/components/ScheduleMessagingCalender';
import qs from 'querystring';
import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { useHistory, useLocation } from 'react-router-dom';
import { mySchedulePostsList as memberMySchedulePostsList } from 'store/reducer/member-post';
import {
  getCurrentDayPostsMessages,
  // getMediaList,
  getMessages,
  mySchedulePostsList,
  reInitializeScheduleState,
  resetCurrentPostsMessages,
  setSelectedDate,
  setSelectedView,
} from 'store/reducer/scheduledMessaging';
import styled from 'styled-components';
import { parseQuery } from 'util/index';

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
  isAnimationComplete?: boolean;
  managedAccountId?: string;
}
const MemberShipSchedulePop = ({ className, managedAccountId = '' }: Props) => {
  const dispatch = useAppDispatch();
  const { showLeftView, showRightView } = useControllTwopanelLayoutView();
  const history = useHistory();
  const location = useLocation();
  const { date, view, slider } = parseQuery(location.search);

  const selectedDate = useAppSelector(
    (state) => state.scheduledMessaging.selectedDate,
  );
  const selectedView = useAppSelector(
    (state) => state.scheduledMessaging.selectedView,
  );
  useEffect(() => {
    dispatch(reInitializeScheduleState());
    const queryDate = date ? dayjs(date as string, 'MM-DD-YYYY') : dayjs();
    const startDate = dayjs
      .utc(queryDate.startOf('month'))
      .format('MM-DD-YYYY');
    const endDate = dayjs.utc(queryDate.endOf('month')).format('MM-DD-YYYY');
    dispatch(
      getMessages({ startDate, endDate, sellerId: managedAccountId }),
    ).then(() => {});
    // dispatch(getMediaList({ sellerId: managedAccountId }));
    const params = { startDate, endDate, sellerId: managedAccountId };
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
    const query: any = { slider };
    if (selectedView) {
      query.view = selectedView;
    } else {
      showLeftView();
    }

    if (selectedDate) {
      query.date = selectedDate.format('MM-DD-YYYY');
    }

    if (query.view || query.date) {
      history.push({
        pathname: managedAccountId
          ? `/managed-accounts/${managedAccountId}/schedule`
          : '/my-members/sliders',
        search: qs.stringify(query),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedView, selectedDate]);

  useEffect(() => {
    if (!isMobile && !view) {
      dispatch(setSelectedView('listing'));
      showRightView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isMobile, view]);
  useEffect(() => {
    if (!isMobile) {
      if (
        constants.ScheduledMessagingViews.includes(
          view as ScheduledMessagingViews,
        )
      ) {
        dispatch(setSelectedView(view as ScheduledMessagingViews));
        showRightView();
      }

      if (date && dayjs(date as string).isValid()) {
        dispatch(setSelectedDate(dayjs(date as string)));
      }
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMonthChange = (month: string) => {
    dispatch(resetCurrentPostsMessages());
    const startDate = dayjs
      .utc(dayjs(month, 'MM').startOf('month'))
      .format('MM-DD-YYYY');
    const endDate = dayjs
      .utc(dayjs(month, 'MM').endOf('month'))
      .format('MM-DD-YYYY');

    dispatch(getMessages({ startDate, endDate, sellerId: managedAccountId }));
    const params = { startDate, endDate, sellerId: managedAccountId };
    dispatch(
      memberMySchedulePostsList({
        params,
        customError: { ignoreStatusCodes: [404] },
      }),
    );
  };

  return (
    <div className={className}>
      <ScheduleMessagingCalender
        onMonthChange={onMonthChange}
        selectedDate={selectedDate}
        onAddClick={() => {
          showRightView();
          dispatch(setSelectedView('add'));
        }}
        onDateChange={(date) => {
          dispatch(setSelectedDate(dayjs(date)));
          dispatch(setSelectedView('listing'));
          showRightView();
        }}
      />
    </div>
  );
};
export default styled(MemberShipSchedulePop)`
  /* overflow: hidden; */
  height: 100%;
  .react-emoji .react-input-emoji--wrapper {
    background: var(--pallete-background-gray-secondary);
  }
  .calendar-schedule {
    margin: 0;
  }
  .schedule-detail {
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
