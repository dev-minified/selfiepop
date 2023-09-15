import {
  AvatarName,
  DollarCircle,
  LikeHeart,
  MessageNew,
  SolidHeart,
  StatisticsIcon,
  TipsReceviedIcon,
} from 'assets/svgs';
import ImageModifications from 'components/ImageModifications';
import ToolTip from 'components/tooltip';
import dayjs from 'dayjs';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import React, { useEffect, useState } from 'react';
import {
  selectPostCommentById,
  selectPostLiekesById,
  selectPostTipsById,
  updatelikes,
} from 'store/reducer/member-post';
import { onToggleModal } from 'store/reducer/statisticsModelState';
import styled from 'styled-components';

import { RequestLoader } from 'components/SiteLoader';
import { v4 as uuid } from 'uuid';
import { getSortbyParam } from '../../util/index';
import CardAddComments from './CardAddComments';
// import TipsBar from './TipsBar';

const RqLoader = styled(RequestLoader)`
  margin-top: 0.5rem;
  padding-bottom: 0.5rem;
`;
interface ICardPublicFooter {
  className?: string;
  id?: string;
  user?: Record<string, any>;
  onChangeLike?: (
    id: string,
    liked: boolean,
    postLikes: IPostLikesType,
  ) => Promise<any>;
  postliked?: boolean;
  postLikes?: IPostLikesType;
  postUser?: string | Record<string, any>;
  setCommentOpen?: Function;
  tipHandler?: Function;
  comments?: IPostCommentType;
  isSeller?: Boolean;
  post?: Partial<IPost>;
  onAddComment?: (...args: any) => Promise<any> | void;
  getPostComments?: (
    id: string,
    params: Record<string, any>,
    append?: boolean,
  ) => Promise<any>;
}
const Tipswrapper = styled.div`
  border-radius: 20px;
  background: rgba(229, 16, 117, 1);
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--pallete-common-white);
  padding: 8px 18px;
  margin: 0 18px 0 0;
`;
const TotalTips = ({ totalTips }: { totalTips?: number }) => {
  return totalTips && totalTips > 0 ? (
    <Tipswrapper>You tipped: ${totalTips}</Tipswrapper>
  ) : null;
};
const PAGE_LIMIT = 5;
const CardPublicFooter: React.FunctionComponent<ICardPublicFooter> = ({
  className,
  // setCommentOpen,
  // postliked,
  // postLikes = { items: [], totalCount: 0 },
  onChangeLike,
  tipHandler,
  user = {},
  id = '',
  isSeller = false,
  postUser,
  post,
  onAddComment,
  getPostComments,
}) => {
  const [liked, setLiked] = useState<boolean>(false);
  const [disableclick, setDisableclick] = useState<boolean>(false);
  const [commentOpen, setCommentOpen] = useState<boolean>(false);
  const [fethingSort, setFethingSort] = useState(false);
  const dispatch = useAppDispatch();
  const postComment = useAppSelector((state) =>
    selectPostCommentById(state, id),
  );
  const postTips = useAppSelector((state) =>
    selectPostTipsById(state, id || ''),
  );
  const postLikes = useAppSelector((state) => selectPostLiekesById(state, id));
  useEffect(() => {
    const index = postLikes?.items?.findIndex(
      (p) => (p.userId as IPostUser)?._id === user?._id,
    );
    setLiked(index > -1);
  }, [postLikes]);

  const getFirstFour = (postLikes: any) => {
    const images: any = [];
    if (!postLikes?.totalCount) {
      return images;
    }
    if (liked) {
      images.push({
        img: user?.profileImage,
        _id: user._id,
        pageTitle: user?.pageTitle,
      });
    }
    for (let i = 0; i <= postLikes?.totalCount; i++) {
      if (postLikes?.items?.[i]) {
        const lUser = postLikes.items[i].userId;
        if (user?._id !== (lUser as IPostUser)._id) {
          images.push({
            img: (lUser as IPostUser)?.profileImage,
            _id: (lUser as IPostUser)._id,
            pageTitle: (lUser as IPostUser).pageTitle,
          });
        }
        if (images.length >= 4) {
          break;
        }
      }
    }
    return images;
  };

  const totalCount = postLikes?.totalCount || 0;

  const secondUser = postLikes?.items?.find(
    (p) => (p.userId as IPostUser)._id !== user?._id,
  )?.userId;
  const thirdUser = postLikes?.items?.find(
    (p) =>
      (p.userId as IPostUser)._id !== (secondUser as IPostUser)?._id &&
      (p.userId as IPostUser)._id !== user?._id,
  )?.userId;
  const onHandleChangeLike = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    if (disableclick) {
      return;
    }
    setDisableclick(true);
    const tempLikes = { ...postLikes };
    const newPostlikes = {
      items: [...(postLikes?.items || [])],
      totalCount: postLikes?.totalCount || 0,
    };
    setLiked(!liked);
    if (liked) {
      const index = newPostlikes.items.findIndex(
        (p) => (p.userId as IPostUser)?._id === user?._id,
      );
      if (index > -1) {
        newPostlikes.items.splice(index, 1);
        newPostlikes.totalCount = newPostlikes.totalCount - 1;
      }
    } else {
      newPostlikes.totalCount = newPostlikes.totalCount + 1;
      if (newPostlikes?.items?.length >= 5) {
        newPostlikes.totalCount = newPostlikes.totalCount || 0;
        newPostlikes.items = newPostlikes?.items?.slice(0, -1);
      }

      const isOwner =
        typeof postUser === 'object'
          ? postUser._id === user?._id
          : postUser === user?._id;
      newPostlikes.items.unshift({
        createdAt: dayjs().utc().format(),
        postId: id,
        updatedAt: dayjs().utc().format(),
        userId: {
          firstName: user?.username,
          lastName: user?.lastName,
          profileImage: user?.profileImage,
          username: user?.username,
          _id: user?._id,
          pageTitle: user?.pageTitle,
        },
        postOwner: isOwner,
        _id: uuid(),
      });
    }
    onChangeLike?.(id, !liked, newPostlikes)
      .then(() => {
        setDisableclick(false);
      })
      .catch(() => {
        dispatch(
          updatelikes({
            postLikes: tempLikes,
            postId: id,
          }),
        );
        setDisableclick(false);
        setLiked(!liked);
      });
  };
  const onHandleAddComment = async (...args: any) => {
    await onAddComment?.(...args);
    setCommentOpen(false);
    return;
  };

  const handlepaginationSort = (
    id: string,
    order = 'asc',
    skip?: number,
    append = false,
  ) => {
    setFethingSort(true);
    const paramsList: any = {
      skip: skip || 0,
      limit: PAGE_LIMIT,
      sort: getSortbyParam('createdAt'),
      // sellerId: managedAccountId,
      order: order,
    };
    getPostComments?.(id, paramsList, append)
      .catch(() => {
        setFethingSort(false);
      })
      .then(() => {
        setFethingSort(false);
      });
  };

  return (
    <div>
      <div className={`${className} card-footer-area`}>
        <div className="card-public-footer-container">
          <div className="card-public-footer-container-item">
            <div className="footer-left">
              <div className="img-heart" onClick={onHandleChangeLike}>
                <span className="img">
                  {liked ? (
                    // <ToolTip overlay={'Liked'}>
                    <SolidHeart fill="#E51075" />
                  ) : (
                    // </ToolTip>
                    // </ToolTip>
                    // <ToolTip overlay={'Like'}>
                    <LikeHeart />
                    //  </ToolTip>
                  )}
                </span>

                {!!totalCount && (
                  <span className="counter">{totalCount || 0}</span>
                )}
              </div>{' '}
              {!isSeller ? (
                <TotalTips totalTips={postTips?.totalTips || 0} />
              ) : null}
              <div className="image_row">
                {getFirstFour(postLikes).map((img: any) => {
                  return (
                    <ImageModifications
                      imgeSizesProps={{
                        onlyMobile: true,

                        imgix: { all: 'w=163&h=163' },
                      }}
                      key={img._id}
                      src={img.img || ''}
                      fallbackComponent={
                        <AvatarName text={img?.pageTitle || 'Incognito User'} />
                      }
                      // fallbackUrl={'/assets/images/default-profile-img.svg'}
                      alt=""
                    />
                  );
                })}
              </div>
              {totalCount > 0 && (
                <div className="card-public-footer-like-info">
                  <strong>
                    {liked && totalCount > 1 ? 'You ,' : liked && 'You '}{' '}
                    {secondUser
                      ? ` ${
                          (secondUser as IPostUser)?.pageTitle ??
                          'Incognito User'
                        } `
                      : ''}
                    {!liked &&
                      totalCount >= 2 &&
                      thirdUser &&
                      `${totalCount > 2 ? ',' : ' and'} ${
                        (thirdUser as IPostUser)?.pageTitle ?? 'Incognito User'
                      }`}
                  </strong>{' '}
                  {/* <div> */}
                  {totalCount >= 3 &&
                    ` and  ${totalCount - 2} other${
                      totalCount - 2 > 1 ? 's' : ''
                    } `}
                  liked this
                </div>
                // </div>
              )}
            </div>
            <ul className="list-items">
              {!isSeller && (
                <li
                  className="dollar-tip"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    tipHandler?.(id);
                  }}
                >
                  <DollarCircle />
                  <span className="text">SEND TIP</span>
                </li>
              )}
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setCommentOpen?.((opened) => !opened);
                  if (
                    !postComment?.items?.length &&
                    postComment?.totalCount > 0 &&
                    post?._id &&
                    !fethingSort
                  ) {
                    handlepaginationSort(
                      post._id,
                      'asc',
                      // comments.items.length,
                      0,
                      false,
                    );
                  }
                }}
              >
                <ToolTip
                  showArrow={false}
                  overlay={'Comments'}
                  mouseLeaveDelay={1}
                >
                  <span>
                    <MessageNew />
                  </span>
                </ToolTip>
                <span className="text">{postComment?.totalCount || 0}</span>
              </li>
              {isSeller && (
                <>
                  <li>
                    <ToolTip overlay={'Total tips'}>
                      <>
                        <TipsReceviedIcon className="icon-tips" />{' '}
                        <span className="text">${post?.totalTips || 0}</span>
                      </>
                    </ToolTip>
                  </li>
                  <li
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      dispatch(onToggleModal({ isOpen: true, post: post }));
                    }}
                  >
                    <ToolTip overlay={'Post Statistics'}>
                      <StatisticsIcon />
                    </ToolTip>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
      {/* {!isSeller ? <TipsBar postId={post?._id} tips={post?.tips} /> : null} */}
      {commentOpen ? (
        <CardAddComments id={id} onSubmit={onHandleAddComment} user={user} />
      ) : null}
      {fethingSort ? (
        <RqLoader
          isLoading={true}
          width="28px"
          height="28px"
          color="var(--pallete-primary-main)"
        />
      ) : null}
    </div>
  );
};

export default styled(CardPublicFooter)`
  border-top: 1px solid var(--pallete-colors-border);
  margin: 24px 0 0;
  padding: 20px 0 0;
  font-size: 13px;
  line-height: 15px;
  font-weight: 500;
  color: var(--pallete-text-main-200);

  @media (max-width: 579px) {
    margin: 15px 0 0;
    padding: 15px 0 0;
  }

  .card-public-footer-container-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .image_row {
    display: flex;

    .image-comp {
      width: 26px;
      height: 26px;
      border: 1px solid #ffffff;
      border-radius: 100%;

      &:nth-child(2) {
        + .image-comp,
        ~ .image-comp {
          @media (max-width: 579px) {
            display: none;
          }
        }
      }

      + .image-comp {
        margin-left: -9px;
      }

      img {
        width: 100%;
        height: 100%;
        display: block;
        border-radius: 100%;
      }
    }
  }

  .footer-left {
    display: flex;
    align-items: center;
  }

  .img-heart {
    /* min-width: 60px; */
    padding: 0 18px 0 0;

    @media (max-width: 579px) {
      /* min-width: 55px; */
      padding: 0 15px 0 0;
    }

    .img {
      cursor: pointer;

      &:hover {
        path {
          fill: var(--pallete-primary-main);
        }
      }
    }

    .counter {
      padding: 0 0 0 12px;

      @media (max-width: 579px) {
        padding: 0 0 0 6px;
      }
    }
  }

  .card-public-footer-like-info {
    /* max-width: 110px; */
    margin: 0 0 0 12px;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;

    @media (max-width: 579px) {
      margin: 0 0 0 10px;
    }

    strong {
      color: var(--pallete-text-main-100);
      font-weight: 500;
    }
  }

  .list-items {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    align-items: center;

    li {
      margin: 0 0 0 33px;
      cursor: pointer;
      display: flex;
      align-items: center;
      color: rgba(255, 255, 255, 0.6);

      @media (max-width: 1023px) {
        margin: 0 0 0 20px;
      }

      @media (max-width: 579px) {
        margin: 0 0 0 8px;
      }

      &:hover {
        color: rgba(255, 255, 255, 0.6);

        svg {
          color: var(--pallete-primary-main);
        }

        path {
          /* fill: var(--pallete-primary-main); */
        }
      }

      &.dollar-tip {
        svg {
          width: 22px;
        }
      }

      svg {
        color: #ffffff;

        &.dollar {
          width: 20px;

          /* path {
            .sp_dark & {
              fill: #fff;
            }
          } */
        }
      }
    }

    .text {
      padding: 0 0 0 12px;

      @media (max-width: 579px) {
        padding: 0 0 0 5px;
      }
    }

    svg {
      width: 18px;
      height: auto;

      @media (max-width: 579px) {
        width: 16px;
      }

      &.icon-tips {
        width: 24px;

        @media (max-width: 579px) {
          width: 19px;
        }
      }
    }

    path {
      /* fill: var(--pallete-text-main-200); */
    }
  }
`;
