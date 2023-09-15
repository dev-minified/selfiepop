import { useAppDispatch } from 'hooks/useAppDispatch';
import { setTwoPanelLayoutHeight } from 'layout/TwoPanelLayout';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { setHeaderProps } from 'store/reducer/headerState';
import styled from 'styled-components';
import MembershipRulesPage from '../../membership-rules';

type Props = {
  className?: string;
};

const MembershipRules: React.FC<Props> = (props) => {
  const { className } = props;

  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setHeaderProps({
        title: 'Rules',
        backUrl: `/managed-accounts/${id}`,
        showHeader: true,
      }),
    );

    setTwoPanelLayoutHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      <MembershipRulesPage />
    </div>
  );
};

export default styled(MembershipRules)``;
