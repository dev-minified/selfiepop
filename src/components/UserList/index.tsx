import Scrollbar from 'components/Scrollbar';
import { RequestLoader } from 'components/SiteLoader';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ListItem, { ListItemType } from './ListItem';
import SearchBar from './SearchBar';
interface Props {
  className?: string;
  items: ListItemType[];
  searchKey?: string;
  allowSearch?: boolean;
  loading?: boolean;
  totalCount?: number;
  onItemClick?: (item: ListItemType) => void;
  onSortChange?(sortOption: string, sortType: 'asc' | 'desc'): void;
  searchFn?(
    search: string,
    data: ListItemType[],
    sortOption: string,
    sortType: 'asc' | 'desc',
  ): Promise<ListItemType[]>;
  loadMore?(
    items: ListItemType[],
    sortOption: string,
    sortType: 'asc' | 'desc',
  ): Promise<void>;
}

const SortOptions = [
  { label: 'Recent Message', value: 'lastMessage' },
  {
    label: 'Total Paid',
    value: 'earning',
  },
  { label: 'Date Joined', value: 'joinDate' },
  { label: 'Old Unread Message', value: 'oldestUnread' },
];

const UserList: React.FC<Props> = (props) => {
  const {
    className,
    items = [],
    searchKey = 'title',
    allowSearch = true,
    onItemClick,
    loading = false,
    onSortChange,
    searchFn,
    totalCount,
    loadMore,
  } = props;

  const scrollbarRef = useRef<any>(null);
  const sortOptionRef = useRef<any>({ value: 'lastMessage', type: 'asc' });

  const [searchValue, setSearchValue] = useState<string>('');
  const [data, setData] = useState<Props['items']>([]);
  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    setData(items || []);
  }, [items]);

  useEffect(() => {
    const updatedData = [...items];

    setData(updatedData);
  }, [items]);

  useEffect(() => {
    let updatedData = [...items];
    if (searchValue) {
      if (searchFn) {
        getSearchData(searchValue, updatedData);
        return;
      } else if (searchKey) {
        updatedData = updatedData.filter((item) => {
          return `${item[searchKey as keyof typeof item]}`
            ?.toLowerCase()
            .includes(searchValue.toLowerCase());
        });
      }
    }
    setData(updatedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const getSearchData = async (text: string, updatedData: ListItemType[]) => {
    await searchFn?.(
      text,
      updatedData,
      sortOptionRef.current?.value || 'lastMessage',
      sortOptionRef.current.type || 'asc',
    );
  };

  const handleScroll = async () => {
    if (
      scrollbarRef.current &&
      totalCount != null &&
      items?.length < totalCount &&
      loadMore
    ) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollbarRef.current.view;
      const pad = 1; // 100px of the bottom
      // t will be greater than 1 if we are about to reach the bottom
      const t = (scrollTop + pad) / (scrollHeight - clientHeight);
      if (t > 1 && !fetching) {
        setFetching(true);
        loadMore?.(
          items,
          sortOptionRef.current.value,
          sortOptionRef.current.type,
        ).finally(() => {
          setFetching(false);
        });
      }
    }
  };

  return (
    <div className={`${className} user-managed-list`}>
      {allowSearch && (
        <SearchBar
          onChange={(value) => setSearchValue(value)}
          onSortChange={(sortOption, sortType) => {
            if (onSortChange) {
              onSortChange(sortOption, sortType);
            }
            if (sortOptionRef.current) {
              sortOptionRef.current = { value: sortOption, type: sortType };
            }
          }}
          resultCount={undefined}
          sortOptions={SortOptions}
        />
      )}
      {loading ? (
        <RequestLoader
          isLoading={true}
          width="28px"
          height="28px"
          color="var(--pallete-primary-main)"
        />
      ) : (
        <Scrollbar
          onScrollStop={handleScroll}
          ref={scrollbarRef}
          className="list-scroll"
        >
          <div className="user-managed-list__wrap">
            {data.map((item) => {
              return (
                <ListItem
                  key={item.id}
                  dollorIcon={!!item?.buyer?.stripe?.customerId}
                  onItemClick={() => onItemClick?.(item)}
                  {...item}
                />
              );
            })}
          </div>
        </Scrollbar>
      )}
      {fetching && (
        <RequestLoader
          isLoading={true}
          width="28px"
          height="28px"
          color="var(--pallete-primary-main)"
        />
      )}
    </div>
  );
};

export default styled(UserList)`
  height: 100%;

  @media (max-width: 767px) {
    height: calc(100vh - 183px);
  }

  .user-managed-list__wrap {
    padding: 19px 22px;
    overflow: hidden;

    @media (max-width: 767px) {
      padding: 15px 15px 80px;
    }
  }

  .rc-scollbar {
    width: 100% !important;
  }

  .chat-user-area {
    background: var(--pallete-background-primary-light);
    margin: 0 0 17px;

    @media (max-width: 767px) {
      padding: 15px;
    }

    &:hover {
      background: var(--pallete-background-secondary);
    }

    .user-name {
      color: var(--pallete-text-main);
    }

    .list-course-detail {
      font-size: 20px;
    }
  }
`;
