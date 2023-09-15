import { ReactElement } from 'react';
import styled from 'styled-components';
import RoomCard from './RoomCard';

interface Props {
  className?: string;
  onChatClick?: (sub: ChatSubsType) => void;
  subscriptions: ChatSubsType[];
}

function RoomListing({
  className,
  onChatClick,
  subscriptions,
}: Props): ReactElement {
  return (
    <div className={className}>
      {subscriptions.map((sub: ChatSubsType) => (
        <RoomCard key={sub?._id} sub={sub} onChatClick={onChatClick} />
      ))}
    </div>
  );
}
export default styled(RoomListing)`
  overflow: hidden;
`;
