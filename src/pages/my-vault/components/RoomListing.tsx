import { useAppSelector } from 'hooks/useAppSelector';
import RoomCard from 'pages/subscriptions/components/RoomCard';
import { ReactElement } from 'react';
import { selectVaultUserObjectList } from 'store/reducer/vault';
import styled from 'styled-components';

interface Props {
  className?: string;
  onChatClick?: (user: IOrderUserType) => void;
  users: IOrderUserType[];
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
  const usesItems = useAppSelector((state) => selectVaultUserObjectList(state));
  return (
    <div className={className}>
      {users.map((s) => {
        const sub = usesItems.items?.[s._id as any];
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
