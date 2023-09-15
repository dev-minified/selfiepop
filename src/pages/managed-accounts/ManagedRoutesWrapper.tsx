import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { cloneElement, ReactElement, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getManagedUserDetails } from 'store/reducer/managed-users';
import styled from 'styled-components';

interface Props {
  className?: string;
  children: ReactElement;
  [key: string]: any;
}

const ManagedRoutesWrapper = ({ children, ...rest }: Props) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.managedUsers.item);
  useEffect(() => {
    if (!user?._id && id) {
      dispatch(getManagedUserDetails({ userId: id }));
    }
  }, [id]);
  return <>{cloneElement(children, { ...rest, managedUser: user })}</>;
};

export default styled(ManagedRoutesWrapper)``;
