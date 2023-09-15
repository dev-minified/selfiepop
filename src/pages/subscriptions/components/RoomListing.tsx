import { useAppSelector } from 'hooks/useAppSelector';
import { ReactElement } from 'react';
import { selectUserObjectList } from 'store/reducer/salesState';
import styled from 'styled-components';
import RoomCard from './RoomCard';

interface Props {
  className?: string;
  onChatClick?: (user: IOrderUserType) => void;
  users: string[];
  options?: {
    showusername?: boolean;
    showlastmessage?: boolean;
  };
}

function RoomListing({
  className,
  onChatClick,
  users,
  options,
}: Props): ReactElement {
  const usesItems = useAppSelector((state) => selectUserObjectList(state));
  return (
    <div className={className}>
      {users.map((s: string) => {
        const sub = usesItems.items?.[s];
        return (
          <RoomCard
            key={sub?._id}
            user={sub}
            onChatClick={onChatClick}
            options={options}
          />
        );
      })}
    </div>
  );
}
export default styled(RoomListing)`
  overflow: hidden;
`;
