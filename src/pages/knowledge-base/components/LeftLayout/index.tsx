import { getListKnowledge } from 'api/knowledge';
import { AvatarName, Search } from 'assets/svgs';
import ImageModifications from 'components/ImageModifications';
import Scrollbar from 'components/Scrollbar';
import { RequestLoader } from 'components/SiteLoader';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { stringify } from 'querystring';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getTopicIds } from 'store/reducer/topic';
import styled from 'styled-components';

interface KnowledgeItem {
  _id: string;
  title: string;
  topicId: string[];
  description: string;
  icon: string;
  sort: number;
  createdAt?: string;
  updatedAt?: string;
}

interface KnowledgeList {
  items: KnowledgeItem[];
  totalCount: number;
}

interface Props {
  className?: string;
}

const LIMIT = 10;

const LeftLayout: React.FC<Props> = ({ className }: Props) => {
  const dispatch = useAppDispatch();
  const { knowledgeId } = useParams<{ knowledgeId: string }>();
  const scrollbarRef = useRef<any>(null);
  const history = useHistory();
  const [fetching, setFetching] = useState<boolean>(false);
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeList>({
    items: [],
    totalCount: 0,
  });

  useEffect(() => {
    setFetching(true);
    getListKnowledge({ limit: LIMIT, skip: knowledgeList.items.length })
      .then((result) =>
        setKnowledgeList({
          items: result.data.items,
          totalCount: result.data.totalCount,
        }),
      )
      .catch(console.error)
      .finally(() => setFetching(false));
  }, []);
  useEffect(() => {
    if (knowledgeId) {
      const knowledgeBase: KnowledgeItem | undefined = knowledgeList.items.find(
        (item: KnowledgeItem) => item?._id === knowledgeId,
      );
      dispatch(getTopicIds(knowledgeBase?.topicId));
    }
  }, [knowledgeId]);

  const loadMore = () => {
    getListKnowledge({
      limit: LIMIT,
      skip: knowledgeList.items.length,
    })
      .then((result) =>
        setKnowledgeList((prev: KnowledgeList) => ({
          ...prev,
          items: [...prev.items, ...result.data.items],
        })),
      )
      .catch(console.error)
      .finally(() => setFetching(false));
  };

  const handleScroll = () => {
    const { totalCount, items } = knowledgeList;

    if (
      scrollbarRef.current &&
      totalCount != null &&
      items?.length < totalCount &&
      loadMore &&
      !fetching
    ) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollbarRef.current.view;
      const pad = 100; // 100px of the bottom
      // t will be greater than 1 if we are about to reach the bottom
      const t = (scrollTop + pad) / (scrollHeight - clientHeight);

      if (t > 1) {
        setFetching(true);
        loadMore();
      }
    }
  };

  return (
    <div className={`${className} articles-block`}>
      <div className="articles-head">
        <span className="head-title">Selfiepop University</span>
        <span className="search">
          <Search />
        </span>
      </div>
      <div className="list-articles">
        <Scrollbar onScroll={handleScroll} ref={scrollbarRef}>
          {knowledgeList.items.map((item: KnowledgeItem, idx: number) => (
            <div
              onClick={() => {
                if (item.topicId.length) {
                  history.push(
                    `/knowledge-base/${item?._id}?${stringify({
                      topicId: item.topicId[0],
                    })}`,
                  );
                }
              }}
              className="item-area"
              key={idx}
            >
              <div className="item-box">
                <div className="left-block">
                  <span className="icon-holder">
                    <ImageModifications
                      src={item.icon}
                      fallbackComponent={<AvatarName text={item.title} />}
                    />
                  </span>
                  <span className="title-text">{item.title}</span>
                </div>
                <span className="tag">{item.topicId.length} topics</span>
              </div>
            </div>
          ))}
        </Scrollbar>
      </div>
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

export default styled(LeftLayout)`
  margin: -24px -18px;
  min-height: calc(100% + 48px);
  display: flex;
  flex-direction: column;

  .is-dark & {
    background: #000;
    color: #fff;
  }

  .articles-head {
    border-bottom: 1px solid rgb(230, 235, 245);
    padding: 16px 16px 16px 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .sp_dark & {
      border-bottom: 1px solid #353535;
    }
  }

  .head-title {
    font-size: 16px;
    line-height: 19px;
    font-weight: 500;
  }

  .list-articles {
    margin: 0;
    font-size: 16px;
    line-height: 19px;
    font-weight: 500;
    flex-grow: 1;
    flex-basis: 0;
    padding: 13px 0;

    .rc-scollbar {
      width: 100%;
    }

    .item-area {
      padding: 0 32px;
    }

    .item-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 11px 14px;
      border-radius: 6px;
      transition: all 0.4s ease;
      cursor: pointer;
      margin: 0 0 8px;

      &:hover {
        background: rgb(230, 235, 245);

        .sp_dark & {
          background: rgba(255, 255, 255, 0.15);
        }
      }
    }

    .left-block {
      display: flex;
      align-items: center;
    }

    .icon-holder {
      width: 58px;
      height: 58px;
      background: #c4c4c4;
      margin-right: 15px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;

      .sp_dark & {
        background: rgba(255, 255, 255, 0.2);
      }

      .image-comp {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .tag {
    background: #e51075;
    border-radius: 4px;
    font-size: 14px;
    line-height: 16px;
    padding: 4px 8px;
    font-weight: 600;
    color: #fff;
  }
`;
