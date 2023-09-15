import MemberLevel from 'components/MemberLevel';
import Scrollbar from 'components/Scrollbar';
import { ServiceType } from 'enums';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { setTwoPanelLayoutHeight } from 'layout/TwoPanelLayout';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { setHeaderProps } from 'store/reducer/headerState';
import styled from 'styled-components';

type Props = {
  className?: string;
};

const MemberLevels: React.FC<Props> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const user = useAppSelector((state) => state.managedUsers.item);

  const [previewPop, setPreviewPop] = useState<any>(null);

  useEffect(() => {
    dispatch(
      setHeaderProps({
        title: 'Membership Levels',
        backUrl: `/managed-accounts/${id}`,
        showHeader: true,
      }),
    );

    setTwoPanelLayoutHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.links) {
      setPreviewPop(
        user?.links.find(
          (l: any) => l?.popLinksId?.popType === ServiceType.CHAT_SUBSCRIPTION,
        ),
      );
    }
  }, [user]);

  return (
    <div className={`${className}`}>
      <Scrollbar>
        <MemberLevel
          showHeader
          value={previewPop || {}}
          showFooter
          managedAccountId={id}
          user={user}
        />
      </Scrollbar>
    </div>
  );
};

export default styled(MemberLevels)`
  height: 100%;
`;
