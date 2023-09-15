import * as constants from 'appconstants';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import TwoPanelLayout from 'layout/TwoPanelLayout';
import qs from 'querystring';
import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { useHistory, useLocation } from 'react-router';
import {
  mySchedulePostsList,
  updateFilteredSchedulePost,
} from 'store/reducer/member-post';
import {
  // getMediaList,
  getMessages,
  resetCurrentPostsMessages,
  setSelectedDate,
  setSelectedView,
  updateFilteredMessages,
} from 'store/reducer/scheduledMessaging';
import styled from 'styled-components';
import { parseQuery } from 'util/index';
import RightView from './components/RightView';
import ScheduleMessagingCalender from './components/ScheduleMessagingCalender';

dayjs.extend(utc);
interface Props {
  className?: string;
}

const ScheduleMessaging: React.FC<Props> = (props) => {
  const { className } = props;
  const dispatch = useAppDispatch();
  const { showLeftView, showRightView } = useControllTwopanelLayoutView();
  const history = useHistory();
  const location = useLocation();

  const { date, view } = parseQuery(location.search);
  const selectedDate = useAppSelector(
    (state) => state.scheduledMessaging.selectedDate,
  );

  const selectedView = useAppSelector(
    (state) => state.scheduledMessaging.selectedView,
  );
  useEffect(() => {
    const queryDate = date ? dayjs(date as string, 'MM-DD-YYYY') : dayjs();
    const startDate = dayjs
      .utc(queryDate.startOf('month'))
      .format('YYYY-MM-DD');

    const endDate = dayjs.utc(queryDate.endOf('month')).format('YYYY-MM-DD');
    dispatch(getMessages({ startDate, endDate })).then(() => {
      dispatch(updateFilteredMessages());
    });
    // dispatch(getMediaList());
    const params = { startDate, endDate };
    dispatch(
      mySchedulePostsList({
        params,
        customError: { ignoreStatusCodes: [404] },
      }),
    ).then(() => {
      dispatch(updateFilteredSchedulePost({ selectedDate }));
    });
  }, []);

  useEffect(() => {
    const query: any = {};
    if (selectedView) {
      query.view = selectedView;
    } else {
      showLeftView();
    }

    if (selectedDate) {
      query.date = selectedDate.format('MM-DD-YYYY');
      query.view === 'listing' &&
        dispatch(updateFilteredSchedulePost({ selectedDate }));
    }

    history.push({
      pathname: '/schedule-messaging',
      search: qs.stringify(query),
    });
  }, [selectedView, selectedDate]);

  useEffect(() => {
    if (!isMobile && !view) {
      dispatch(setSelectedView('listing'));
      showRightView();
    }
  }, [view]);
  useEffect(() => {
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
  }, []);

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
      <TwoPanelLayout
        defaultBackButton={false}
        leftView={
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
        }
        rightView={<RightView />}
      />
    </div>
  );
};

export default styled(ScheduleMessaging)``;
