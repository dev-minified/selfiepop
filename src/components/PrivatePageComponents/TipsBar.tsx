import { DollarAlt } from 'assets/svgs';
import Button from 'components/NButton';
import { RequestLoader } from 'components/SiteLoader';
import dayjs from 'dayjs';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import { useState } from 'react';
import { getPostTips, selectPostTipsById } from 'store/reducer/member-post';
import styled from 'styled-components';
import { getSortbyParam } from 'util/index';

interface IPostCaption {
  className?: string;
  tips?: IPostTipsType;
  postId?: string;
}
const RqLoader = styled(RequestLoader)`
  margin-top: 0.5rem;
  padding-bottom: 0.5rem;
`;
const current = dayjs();
const TipsBar: React.FunctionComponent<IPostCaption> = ({
  className,
  tips,
  postId,
}) => {
  // const [postTips, setTips] = useState<IPostTipsType | undefined>(tips);
  const postTips = useAppSelector((state) =>
    selectPostTipsById(state, postId || ''),
  );
  const [fetchingTips, setFetchingTips] = useState(false);
  const appDispatch = useAppDispatch();

  // useEffect(() => {
  //   setTips(tips);
  //   return () => {};
  // }, [postId, postTips]);
  const handlepagination = () => {
    setFetchingTips(true);
    const paramsList: any = {
      skip: tips?.items?.length || 0,
      limit: 5,
      sort: getSortbyParam('updatedAt'),
      order: 'asc',
    };
    appDispatch(getPostTips?.({ id: postId || '', params: paramsList }))
      .catch(() => {
        setFetchingTips(false);
      })
      .then(() => {
        setFetchingTips(false);
      });
  };
  return (
    <div className={`tip ${className}`}>
      {postTips?.items.map((tip) => {
        let timestamp = tip.createdAt ? dayjs(tip.createdAt) : '';
        if (timestamp) {
          timestamp = (timestamp as dayjs.Dayjs).isSame(current, 'date')
            ? (timestamp as dayjs.Dayjs).fromNow()
            : (timestamp as dayjs.Dayjs).format('MM/DD/YYYY hh:mm A');
        }
        const { _id } = tip;
        return (
          <div className={`tip-row ${className}`} key={_id}>
            <div className="tip-amount">
              <span className="icon">
                <DollarAlt />
              </span>
              TIP SENT
              <span className="amount-sent "> {tip?.comment}</span>
            </div>
            <div className="time-info">{timestamp}</div>
          </div>
        );
      })}
      {tips && tips?.totalCount > tips?.items?.length && (
        <div className="more-comments text-center pt-15">
          {fetchingTips ? (
            <RqLoader
              isLoading={true}
              width="28px"
              height="28px"
              color="var(--pallete-primary-main)"
            />
          ) : (
            <Button
              size="small"
              type="primary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlepagination();
              }}
            >
              <i className="icon icon-plus mr-5"></i>
              VIEW MORE TIPS
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default styled(TipsBar)`
  &.tip-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 15px -20px 0;
    background: var(--pallete-background-gray-primary);
    padding: 12px 20px;
    color: var(--pallete-text-main);
    font-size: 14px;
    line-height: 18px;
    font-weight: 500;

    + .tip-row {
      margin-top: 5px;
    }

    .icon {
      width: 20px;
      display: inline-block;
      vertical-align: middle;
      margin: 0 10px 0 0;

      svg {
        width: 100%;
        height: auto;
        vertical-align: top;
      }
    }

    .amount-sent {
      margin: 0 0 0 10px;
    }

    .time-info {
      font-size: 13px;
      line-height: 17px;
      color: var(--pallete-text-main-200);
    }
  }
`;
