import useAuth from 'hooks/useAuth';
import { cloneElement, ReactElement, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

interface Props {
  className?: string;
  children: ReactElement;
  [key: string]: any;
}

const MemberRoutesWrapper = ({ children, ...rest }: Props) => {
  const { user } = useAuth();
  const history = useHistory();
  useEffect(() => {
    const status =
      user?.managerList?.filter(
        (e: any) => e?.status === 'pending' || e?.status === 'active',
      ) || [];
    if (status.length >= 5) {
      history.push(`/my-members/team-members`);
    }
  }, [user?._id]);
  return (
    <>
      {cloneElement(children, {
        ...rest,
      })}
    </>
  );
};

export default styled(MemberRoutesWrapper)``;
