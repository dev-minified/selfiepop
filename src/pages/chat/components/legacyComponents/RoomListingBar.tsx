import Scrollbar from 'components/Scrollbar';
import { useAppSelector } from 'hooks/useAppSelector';
import useAuth from 'hooks/useAuth';
import { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';
import RoomListing from './RoomListing';
import RoomSearchFrom from './RoomSearch';
interface Props {
  className?: string;
  onChatClick?: (sub: ChatSubsType) => void;
  enableTagsearch?: boolean;
}

function RoomListingBar({
  className,
  onChatClick,
  enableTagsearch = true,
}: Props): ReactElement {
  const { user } = useAuth();
  const subscriptions = useAppSelector((state) => state.chat.subscriptions);
  const [tags, setTags] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isTagActive, setIsTagActive] = useState<boolean>(false);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<
    ChatSubsType[]
  >([]);
  const [showResultCount, setShowResultCount] = useState<boolean>(false);

  useEffect(() => {
    if (isTagActive && tags.length) {
      setFilteredSubscriptions(
        subscriptions.items.filter((item) =>
          item.tags?.some((tag) => tags.includes(tag)),
        ),
      );
      setShowResultCount(true);
      return;
    }

    if (!isTagActive && searchText) {
      setFilteredSubscriptions(
        subscriptions.items.filter((item) => {
          const name =
            user?._id === item.sellerId._id
              ? `${
                  item.buyerId?.pageTitle?.toLowerCase() ?? 'Incognito User'
                } ${item.buyerId?.pageTitle?.toLowerCase() ?? 'Incognito User'}`
              : `${
                  item.sellerId?.pageTitle?.toLowerCase() ?? 'Incognito User'
                } ${
                  item.sellerId?.pageTitle?.toLowerCase() ?? 'Incognito User'
                }`;

          const searchNames = searchText
            .toLocaleLowerCase()
            .split(',')
            .map((s) => s.trim());
          return searchNames.some((s) => name.indexOf(s) > -1);
        }),
      );
      setShowResultCount(true);
      return;
    }

    setFilteredSubscriptions(subscriptions.items);
  }, [
    subscriptions,
    tags,
    searchText,
    setFilteredSubscriptions,
    isTagActive,
    user?._id,
  ]);

  return (
    <div className={className}>
      <RoomSearchFrom
        enableTagsearch={enableTagsearch}
        searchText={searchText}
        onSearchTextUpdate={setSearchText}
        tags={tags}
        onTagsUpdate={setTags}
        isTagActive={isTagActive}
        setIsTagActive={setIsTagActive}
        showResultCount={showResultCount}
        onResultCountClose={() => {
          setShowResultCount(false);
          setSearchText('');
          setTags([]);
        }}
        count={filteredSubscriptions.length}
      />
      <Scrollbar>
        <RoomListing
          onChatClick={onChatClick}
          className="user-listings"
          subscriptions={filteredSubscriptions}
        />
      </Scrollbar>
    </div>
  );
}

export default styled(RoomListingBar)`
  background: var(--pallete-background-gray);
  padding: 0 6px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .user-listings {
    flex-grow: 1;
    flex-basis: 0;

    @media (max-width: 767px) {
      padding-bottom: 80px;
    }
  }
`;
