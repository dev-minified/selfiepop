import { useAppSelector } from 'hooks/useAppSelector';
import { ReactElement } from 'react';
import { selectUserObjectList } from 'store/reducer/salesState';
import styled from 'styled-components';
import RoomCard from './RoomCard';

interface Props {
  className?: string;
  onChatClick?: (user: IOrderUserType) => void;
  users: string[];
}

function RoomListing({ className, onChatClick, users }: Props): ReactElement {
  const userItems = useAppSelector((state) => selectUserObjectList(state));
  return (
    <div className={className}>
      {users.map((subId: string) => {
        const sub = userItems.items[subId];
        return <RoomCard key={sub?._id} user={sub} onChatClick={onChatClick} />;
      })}
    </div>
  );
}
export default styled(RoomListing)`
  overflow: hidden;
`;
