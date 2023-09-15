import Scrollbar from 'components/Scrollbar';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import ScheduleMessagingCalender from 'pages/my-members/components/Slider/components/MemberShipModule';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { setHeaderProps } from 'store/reducer/headerState';
import { setSelectedView } from 'store/reducer/scheduledMessaging';
import styled from 'styled-components';

type Props = {
  className?: string;
};

const Schedule: React.FC<Props> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const managedUsers = useAppSelector((state) => state.managedUsers.item);

  useEffect(() => {
    const allowMessage =
      managedUsers?.permissions?.status === 'active' &&
      managedUsers?.permissions?.allowMessage;
    const allowContent =
      managedUsers?.permissions?.status === 'active' &&
      managedUsers?.permissions?.allowContent;
    const applyText = `Schedule a ${allowContent ? 'Post' : ''} ${
      allowContent && allowMessage ? '/' : ''
    } ${allowMessage ? 'Message' : ''}`;
    dispatch(
      setHeaderProps({
        title: applyText,
        backUrl: `/managed-accounts/${id}`,
        showHeader: true,
      }),
    );
    dispatch(setSelectedView('listing'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      <Scrollbar>
        <ScheduleMessagingCalender managedAccountId={id} />
      </Scrollbar>
    </div>
  );
};

export default styled(Schedule)`
  overflow: hidden;
  height: 100%;
  .calendar-schedule {
    margin: 0;
  }
`;
