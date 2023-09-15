import { useAppDispatch } from 'hooks/useAppDispatch';
import { setTwoPanelLayoutHeight } from 'layout/TwoPanelLayout';
import CreateRule from 'pages/membership-rules/create';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { setHeaderProps } from 'store/reducer/headerState';
import styled from 'styled-components';

type Props = {
  className?: string;
};

const MembershipRuleCreate: React.FC<Props> = (props) => {
  const { className } = props;

  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setHeaderProps({
        title: 'Add Rule',
        backUrl: `/managed-accounts/${id}/rules`,
        showHeader: false,
      }),
    );

    setTwoPanelLayoutHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      <CreateRule
        // showHeader={false}
        backUrl={`/managed-accounts/${id}/rules`}
      />
    </div>
  );
};

export default styled(MembershipRuleCreate)``;
