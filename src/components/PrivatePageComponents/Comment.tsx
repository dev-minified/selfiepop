import { AvatarName, DollarAlt } from 'assets/svgs';
import ImageModifications from 'components/ImageModifications';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useAuth from 'hooks/useAuth';
import parse from 'html-react-parser';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { RequestLoader } from 'components/SiteLoader';
import { getSortbyParam } from 'util/index';
import CardAddComments from './CardAddComments';

dayjs.extend(utc);
dayjs.extend(relativeTime);
type ICommentProps = {
  comment: IPostComment;
  toggleLike?: (id: string, postId: string) => void;
  postId?: string;
  className?: string;
  isNestedComment?: boolean;
  parentId?: string;
  user?: Record<string, any>;
  postUser?: Record<string, any>;
  isSeller?: boolean;
  isTipBuyer?: boolean;
  setCommentToReply?: (...args: any[]) => Promise<any> | void;
  onAddReplyToComment?: (...args: any[]) => Promise<any>;
  onPostCommentRepliesPagination?: (...args: any[]) => Promise<any>;
  onToggleCommentReplyLike?: (...args: any[]) => Promise<any>;

  selectedComment?: string;
  parentCommentId?: string;
  item?: IPost;
  managedUser?: Record<string, any>;
};
const PAGE_LIMIT = 10;
type ITipCommentType = {
  comment: IPostComment;
  toggleLike?: (id: string, postId: string) => void;
  postId?: string;
  className?: string;
  isNestedComment?: boolean;
  parentId?: string;
  user?: Record<string, any>;
  postUser?: Record<string, any>;
  timestamp?: string | dayjs.Dayjs | any;
  isSeller?: boolean;
  isTipBuyer?: boolean;
  onReplyClick?: (...args: any[]) => Promise<any> | void;
};
const TipComment = (props: ITipCommentType) => {
  const { user, comment, timestamp, postUser } = props;

  return (
    <>
      <div className="comment_item-profile-image">
        <ImageModifications
          // fallbackUrl={'/assets/images/default-profile-img.svg'}
          src={postUser?.profileImage}
          imgeSizesProps={{
            onlyDesktop: true,

            imgix: { all: 'w=163&h=163' },
          }}
          fallbackComponent={
            <AvatarName text={postUser?.pageTitle || 'Incongnito User'} />
          }
          alt=""
        />
      </div>
      <div className="comment_content">
        <div className="comment_header">
          <div className="comment_header_wrap">
            <ul className="list-info">
              <li>
                <strong className="name">
                  {user?.pageTitle ?? 'Incognito User'}
                </strong>{' '}
                <span
                  className="profile_username"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    window.open(`/profile/${user?.username}`, '_blank');
                  }}
                >
                  @{user?.username}
                </span>
              </li>

              <li>{timestamp}</li>
            </ul>

            <div className="tip-amount-text">
              <DollarAlt />
              {comment?.comment}
            </div>
          </div>
        </div>

        <ul className="comment_footer_list">
          <li>
            <span
              className="link sp_test_private_reply"
              onClick={() =>
                window.open(
                  `${window.location.protocol}//${window.location.host}/my-members/subscriber?userId=${user?._id}&type=chat`,
                )
              }
            >
              Private Reply
            </span>
          </li>
        </ul>
      </div>
    </>
  );
};
const NormalComment = (props: ITipCommentType) => {
  const {
    user,
    comment,
    timestamp,
    toggleLike,
    postId = '',
    onReplyClick,
    isNestedComment,
    postUser,
  } = props;
  const { likeCount, commentLiked, _id, comment: postText } = comment;
  const current = dayjs();
  const [viewMore, setViewMore] = useState(true);
  return (
    <>
      <div className="comment_item-profile-image">
        <ImageModifications
          // fallbackUrl={'/assets/images/default-profile-img.svg'}
          imgeSizesProps={{
            onlyDesktop: true,

            imgix: { all: 'w=163&h=163' },
          }}
          fallbackComponent={
            <AvatarName text={postUser?.pageTitle || 'Incongnito User'} />
          }
          src={postUser?.profileImage}
          alt=""
        />
      </div>
      <div className="comment_content">
        <div className="comment_header">
          <div className="comment_header_wrap">
            <ul className="list-info">
              <li key={`${user?.username}-${_id}`}>
                <strong className="name">
                  {user?.pageTitle ?? 'Incognito User'}
                </strong>{' '}
                <span
                  className="profile_username"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    window.open(`/profile/${user?.username}`, '_blank');
                  }}
                >
                  @{user?.username}
                </span>
              </li>
              {!!likeCount && (
                <li
                  key={`${user?.username}-${_id}-${likeCount}-${current.millisecond}`}
                >
                  <strong className="like-counter">{likeCount}</strong>{' '}
                  {likeCount > 1 ? 'likes' : 'like'}
                </li>
              )}
              <li key={`${user?.username}-${_id}-${timestamp}`}>{timestamp}</li>
            </ul>
            <div className="comment_text" suppressContentEditableWarning={true}>
              {parse(
                (postText?.length as number) > 250
                  ? `${postText?.slice(
                      0,
                      viewMore ? 250 : (postText?.length as number),
                    )} ${viewMore ? ' ...' : ''}`
                  : postText || '',
              )}
              {(postText?.length as number) > 250 && (
                <span
                  onClick={() => setViewMore(!viewMore)}
                  className={`comment-toggle ${
                    !viewMore ? 'show-less' : 'show-more'
                  } sp_test_show_more_replies`}
                >
                  {/* <span className="arrow"></span> */}
                  {!viewMore ? 'Show Less' : 'Show More'}
                </span>
              )}
            </div>
          </div>
        </div>
        <ul className="comment_footer_list">
          <li key={`${user?.username}-${_id}-${commentLiked}`}>
            <span
              className={`link ${
                commentLiked ? 'active' : ''
              } sp_test_like_comment`}
              onClick={() => toggleLike?.(_id || '', postId)}
            >
              {commentLiked ? 'Liked' : 'Like'}{' '}
            </span>
          </li>
          <li
            key={`${user?.username}-${_id}-${isNestedComment}-${current.millisecond}`}
          >
            <span
              className="link sp_test_reply_comment"
              onClick={(e) => {
                e.stopPropagation();
                onReplyClick?.();
              }}
            >
              Reply
            </span>
          </li>
        </ul>
      </div>
    </>
  );
};

const Comment = ({
  comment,
  postId = '',
  toggleLike,
  className,
  isNestedComment,
  parentId = '',
  user,
  isSeller = false,
  isTipBuyer = false,
  setCommentToReply,
  selectedComment,
  item,
  parentCommentId,
  managedUser,

  onAddReplyToComment,
  onPostCommentRepliesPagination,
  onToggleCommentReplyLike,
}: ICommentProps) => {
  const current = dayjs();
  // const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [fethingNestedComemnts, setFethingNestedComemnts] = useState(false);
  const dispatch = useAppDispatch();
  // const tempComments = useAppSelector((state) => state.memberPost.tempComments);
  const { user: loggedUser } = useAuth();
  const {
    createdAt,
    commentType,
    userId,
    _id,
    childCount = 0,
    childComments = { items: [], totalCount: 0 },
  } = comment;
  let timestamp = createdAt ? dayjs(createdAt) : '';
  if (timestamp) {
    timestamp = (timestamp as dayjs.Dayjs).isSame(current, 'date')
      ? (timestamp as dayjs.Dayjs).fromNow()
      : (timestamp as dayjs.Dayjs).format('MM/DD/YYYY hh:mm A');
  }
  const postUser: IPostUser = userId! as IPostUser;
  const handleCommentReply = async (
    id: string,
    values: Record<string, any>,
  ) => {
    return onAddReplyToComment?.({
      commentId: parentId || id || '',
      nestcommentId: parentId || id,
      values,
      postId,
    })
      .then(() => {
        setCommentToReply?.('');
      })

      .catch(console.log);
  };
  const handlepagination = (id: string, skip: number, append = false) => {
    setFethingNestedComemnts(true);
    const paramsList: any = {
      skip: skip || 0,
      // orderId,
      limit: PAGE_LIMIT,
      sort: getSortbyParam('createdAt'),
      // filter: filterby,
      order: 'desc',
      // isActive: true,
    };
    onPostCommentRepliesPagination?.({
      id: id,
      postId,
      params: paramsList,
      append,
      callback: () => {},
    })
      .catch(() => {
        setFethingNestedComemnts(false);
      })
      .then(() => {
        setFethingNestedComemnts(false);
      });
  };
  const toggleCommentReplyLike = useCallback(
    (id: string, postId?: string) => {
      onToggleCommentReplyLike?.({
        nestedCommentId: id,
        commentId: _id || '',
        postId,
        params: {},
        callback: () => {
          // console.log(data);
        },
      }).catch(console.log);
    },
    [_id, dispatch],
  );
  const data = useMemo(() => {
    return { value: `${user?.pageTitle ?? 'Incognito User'}`, id: user?._id };
  }, [user]);

  // const tempLiveComments = tempComments?.[parentId || _id || ''] || [];
  return (
    <div className={`comment_item ${className}`}>
      <div className="comment_main">
        {isSeller && commentType === 'TIP' ? (
          <TipComment
            comment={comment}
            user={user}
            timestamp={timestamp}
            postId={postId}
            parentId={parentId}
            toggleLike={toggleLike}
            isTipBuyer={isTipBuyer}
            isSeller={isSeller}
            isNestedComment={isNestedComment}
            postUser={postUser}
          />
        ) : commentType !== 'TIP' ? (
          <NormalComment
            isNestedComment={isNestedComment}
            comment={comment}
            onReplyClick={() => {
              selectedComment === _id
                ? setCommentToReply?.('')
                : setCommentToReply?.(_id);
            }}
            parentId={parentId}
            postId={postId}
            timestamp={timestamp}
            user={user}
            toggleLike={toggleLike}
            isTipBuyer={isTipBuyer}
            isSeller={isSeller}
            postUser={postUser}
          />
        ) : null}
      </div>
      {selectedComment === _id && (
        <CardAddComments
          cardClass="commentResponse"
          id={_id}
          onSubmit={handleCommentReply}
          user={managedUser ?? loggedUser}
          defaultMention={loggedUser?._id !== data.id ? data : undefined}
        />
      )}
      {childCount > 0 && (
        <div className="response-block">
          <span
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (!showReplies && !childComments?.items?.length) {
                handlepagination(_id || '', 0, false);
              }
              setShowReplies((r) => !r);
            }}
            className={`item-toggle ${
              showReplies ? 'show_replies' : ''
            } sp-test_hide_show_replies`}
          >
            {/* <ChevronDown /> */}
            <span className="normal-state">View</span>
            <span className="active-state">Hide</span>{' '}
            <span className="num-text">
              {' '}
              {childCount > 1 ? (
                <span className="child-count">
                  <span className="count">{childCount}</span> replies
                </span>
              ) : (
                <span className="child-count">
                  <span className="count">1</span> reply
                </span>
              )}
            </span>
          </span>
          {showReplies && (
            <>
              <div className="comment_list">
                {childComments?.items?.map((postComment: IPostComment) => {
                  const isSeller = user?._id === item?.userId;
                  const isTipBuyer =
                    (postComment.userId as IPostUser)?._id === user?._id;
                  return (
                    <Comment
                      className="nested_comment"
                      key={postComment._id}
                      isNestedComment={true}
                      comment={postComment}
                      postId={postId}
                      managedUser={managedUser}
                      toggleLike={toggleCommentReplyLike}
                      parentId={_id}
                      user={(postComment?.userId as any) || ({} as any)}
                      isTipBuyer={isTipBuyer}
                      isSeller={isSeller}
                      setCommentToReply={setCommentToReply}
                      selectedComment={selectedComment}
                      parentCommentId={parentCommentId}
                      onAddReplyToComment={onAddReplyToComment}
                      onPostCommentRepliesPagination={
                        onPostCommentRepliesPagination
                      }
                      onToggleCommentReplyLike={onToggleCommentReplyLike}
                    />
                  );
                })}
              </div>
              {comment &&
                childComments &&
                (comment?.childCount || 0) &&
                (comment.childCount || 0) > (childComments.items.length || 0) &&
                !fethingNestedComemnts && (
                  <div className="more-replies sp_test_show_more_replies">
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlepagination(
                          parentCommentId || _id || '',
                          childComments.items?.length,
                          // -
                          //   (tempLiveComments?.length || 0),
                          !!childComments.items?.length,
                        );
                      }}
                    >
                      <i className="icon icon-plus"></i>
                      Show more replies
                    </Link>
                  </div>
                )}
              {fethingNestedComemnts && (
                <RequestLoader
                  isLoading={true}
                  width="28px"
                  height="28px"
                  color="var(--pallete-primary-main)"
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default styled(Comment)`
  .profile_username {
    cursor: pointer;
  }
  .comment_text {
    p {
      margin: 0;
      display: inline;
    }
  }
  .commentResponse {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
    border-bottom: none;
  }

  .comment_main {
    display: flex;
    align-items: flex-start;
    margin: 0 0 20px;
  }

  .comment_item-profile-image {
    width: 38px;
    height: 38px;
    border-radius: 100%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .comment_content {
    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    margin: 0 0 0 20px;

    @media (max-width: 479px) {
      margin: 0 0 0 15px;
    }
  }

  .comment_header {
    margin: 0 0 10px;
  }

  .tip-amount-text {
    font-size: 14px;
    line-height: 18px;
    font-weight: 500;
    color: var(--pallete-text-main);
    svg {
      display: inline-block;
      vertical-align: middle;
      margin: 0 10px 0 0;
      width: 20px;
      height: 20px;
    }
  }

  .list-info {
    margin: 0 -8px;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    color: #95959f;
    font-size: 12px;
    line-height: 14px;

    li {
      padding: 0 8px;
      position: relative;
      margin: 0 0 10px;

      &:first-child {
        &:before {
          display: none;
        }
      }

      &:before {
        left: -1px;
        top: 50%;
        transform: translate(0, -50%);
        width: 3px;
        height: 3px;
        border-radius: 100%;
        background: #95959f;
        position: absolute;
        content: '';
      }
    }

    strong {
      font-weight: 500;
      color: var(--pallete-text-main-100);
      padding: 0 3px 0 0;

      &.like-counter {
        padding: 0;
      }
    }
  }

  .comment_header_wrap {
    display: inline-block;
    vertical-align: top;
    background: var(--pallete-background-gray-primary);
    border-radius: 8px;
    padding: 10px 12px;
    color: #47484a;
    font-size: 14px;
    line-height: 16px;
    max-width: 100%;
    overflow: hidden;

    .sp_dark & {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .comment_footer_list {
    margin: 0 -10px;
    padding: 0;
    list-style: none;
    display: flex;
    font-size: 12px;
    line-height: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.6);

    li {
      padding: 0 10px;
    }

    .link {
      cursor: pointer;

      &:hover,
      &.active {
        /* color: var(--pallete-primary-main); */
        color: #fff;
      }
    }
  }

  .comment_list {
  }

  .response-block {
    padding: 0 0 0 58px;
  }

  .more-replies {
    font-size: 14px;
    line-height: 16px;
    margin: 0 0 15px;

    .icon {
      display: inline-block;
      vertical-align: top;
      margin: 0 10px 0 0;
    }
  }

  .item-toggle {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    line-height: 16px;
    cursor: pointer;
    margin: -10px 0 20px;
    padding: 0 0 0 33px;
    position: relative;
    color: rgba(255, 255, 255, 0.6);

    &:before {
      position: absolute;
      left: 0;
      top: 50%;
      background: rgba(255, 255, 255, 0.4);
      content: '';
      width: 22px;
      height: 1px;
    }

    &:hover {
      color: var(--pallete-primary-main);

      .sp_dark & {
        color: rgba(255, 255, 255, 0.4);
      }

      .count {
        color: var(--pallete-primary-main);

        .sp_dark & {
          color: rgba(255, 255, 255, 0.4);
        }
      }

      &:before {
        background: var(--pallete-primary-main);

        .sp_dark & {
          background: rgba(255, 255, 255, 0.4);
        }
      }
    }

    .count {
      color: rgba(255, 255, 255, 0.8);
    }

    .active-state {
      display: none;
      margin: 0 2px 0 0;
    }

    .normal-state {
      margin: 0 2px 0 0;
    }

    svg {
      margin: 0 6px 0 0;
    }

    &.show_replies {
      svg {
        transform: rotate(180deg);
      }

      .active-state {
        display: inline-block;
        vertical-align: middle;
      }

      .normal-state {
        display: none;
      }
    }
  }

  .comment-toggle {
    color: var(--pallete-primary-main);
    cursor: pointer;
    display: inline-block;
    transition: all 0.4s ease;
    margin: 5px 0 0;

    .sp_dark & {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: underline;
      margin: 0 0 0 5px;
    }

    &:hover {
      color: var(--colors-indigo-200);

      .sp_dark & {
        color: rgba(255, 255, 255, 0.4);
      }

      .arrow {
        border-color: var(--colors-indigo-200) transparent transparent
          transparent;
      }
    }

    &.show-less {
      .arrow {
        transform: rotate(180deg);
      }
    }
  }

  .arrow {
    transition: all 0.4s ease;
    display: inline-block;
    vertical-align: middle;
    border-style: solid;
    border-width: 5px 4px 0 4px;
    border-color: var(--pallete-primary-main) transparent transparent
      transparent;
    margin: -4px 5px 0 0;
  }
`;
