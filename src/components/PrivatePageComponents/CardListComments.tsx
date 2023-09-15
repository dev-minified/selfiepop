import { WhatsAppLoader as WLoader } from 'components/loader';
import Select from 'components/Select';
import { RequestLoader } from 'components/SiteLoader';
import { useAppSelector } from 'hooks/useAppSelector';
import {
  forwardRef,
  MutableRefObject,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import { selectPostCommentById } from 'store/reducer/member-post';
import styled from 'styled-components';
import { getSortbyParam } from 'util/index';
import Comment from './Comment';

interface ICardListComments {
  className?: string;
  item?: IPost;
  user?: Record<string, any>;
  isCommentsFetching?: boolean;
  toggleCommentLike?: (id: string, postId?: string) => Promise<any>;
  onAddReplyToComment?: (...args: any[]) => Promise<any>;
  onPostCommentRepliesPagination?: (...args: any[]) => Promise<any>;
  onToggleCommentReplyLike?: (...args: any[]) => Promise<any>;

  getPostComments?: (
    id: string,
    params: Record<string, any>,
    append?: boolean,
  ) => Promise<any>;
  handleAddComemnt?: (
    id: string,
    values: Record<string, any>,
  ) => Promise<any> | void;
  postRef?: MutableRefObject<any>;
  postComment?: string;
  managedUser?: Record<string, any>;
  setOpenedComemnt?: any;
}
const PAGE_LIMIT = 5;
const options = [
  { value: 'Newest', label: 'Newest' },
  { value: 'Oldest', label: 'Oldest' },
];
const WhatsAppLoader = styled(WLoader)`
  margin-top: 0.5rem;
  padding-bottom: 0.5rem;
`;

const CardListComments = forwardRef(
  (
    {
      className,
      item,
      user,
      getPostComments,
      toggleCommentLike,
      postComment,
      setOpenedComemnt,
      managedUser,
      onAddReplyToComment,
      onPostCommentRepliesPagination,
      onToggleCommentReplyLike,
    }: ICardListComments,
    ref: any,
  ) => {
    const [comments, setComments] = useState<IPostCommentType>({
      items: [],
      totalCount: 0,
    });
    const postCommentt = useAppSelector((state) =>
      selectPostCommentById(state, item?._id || ''),
    );

    const [fethingComemnts, setFethingComemnts] = useState(false);
    const [fethingSort, setFethingSort] = useState(false);
    const [sortby, setSortby] = useState({ value: 'Newest', label: 'Newest' });
    const [sorting, setSorting] = useState(true);
    const [commentToReply, setCommentToReply] = useState<any>();

    useEffect(() => {
      if (postCommentt) {
        setComments(postCommentt);
      }
    }, [postCommentt]);

    useEffect(() => {
      if (postComment && commentToReply) {
        setCommentToReply(null);
        setOpenedComemnt(null);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postComment, commentToReply]);

    const toggleLike = useCallback((id: string, postId?: string) => {
      toggleCommentLike?.(id, postId).catch(console.log);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handlepagination = (
      id: string,
      order = 'desc',
      skip?: number,
      append = false,
    ) => {
      setFethingComemnts(true);

      const paramsList: any = {
        skip: skip || 0,
        limit: PAGE_LIMIT,
        sort: getSortbyParam('createdAt'),
        // sellerId: managedAccountId,
        order: order,
      };
      getPostComments?.(id, paramsList, append)
        .catch(() => {
          setFethingComemnts(false);
        })
        .then(() => {
          setFethingComemnts(false);
        });
    };
    const handlepaginationSort = (
      id: string,
      order = 'desc',
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
    if (!postCommentt?.items?.length) {
      return null;
    }
    return (
      <div className={className} ref={ref}>
        <div className="comment_sort">
          Sort by:{' '}
          <Select
            options={options}
            className="sort-val"
            size="x-small"
            isSearchable={false}
            onChange={(value: any) => {
              if (item?._id) {
                handlepaginationSort(item?._id, sorting ? 'asc' : 'desc', 0);
                setSorting(!sorting);
                setSortby(value);
              }
            }}
            value={sortby}
          />
        </div>
        {fethingSort ? (
          <RequestLoader
            isLoading
            width="28px"
            height="28px"
            color="var(--pallete-primary-main)"
          />
        ) : (
          <>
            <div className="comment_list">
              {comments?.items?.map((postComment: IPostComment) => {
                const isSeller = user?._id === item?.userId;
                const isTipBuyer =
                  (postComment.userId as IPostUser)?._id === user?._id;
                return (
                  <Comment
                    item={item}
                    isSeller={isSeller}
                    isTipBuyer={isTipBuyer}
                    key={postComment._id}
                    managedUser={managedUser}
                    comment={postComment}
                    postId={item?._id}
                    toggleLike={toggleLike}
                    user={(postComment?.userId as any) || ({} as any)}
                    setCommentToReply={setCommentToReply}
                    selectedComment={commentToReply}
                    parentCommentId={postComment._id}
                    onAddReplyToComment={onAddReplyToComment}
                    onPostCommentRepliesPagination={
                      onPostCommentRepliesPagination
                    }
                    onToggleCommentReplyLike={onToggleCommentReplyLike}
                  />
                );
              })}
            </div>
            {comments && comments.totalCount > comments.items.length && (
              <div className="more-comments">
                {fethingComemnts ? (
                  <RequestLoader
                    isLoading
                    width="28px"
                    height="28px"
                    color="var(--pallete-primary-main)"
                  />
                ) : (
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      item?._id &&
                        handlepagination(
                          item?._id,
                          sorting ? 'desc' : 'asc',
                          // comments.items.length,
                          comments.items?.length,
                          !!comments.items?.length,
                        );
                    }}
                  >
                    <i className="img"></i>
                    View more comments
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
  },
);

export default styled(CardListComments)`
  padding: 15px 0 1px;
  font-weight: 400;

  .comment_sort {
    font-size: 13px;
    line-height: 15px;
    font-weight: 500;
    color: var(--pallete-text-main-200);
    margin: 0 0 20px;

    .sp_dark & {
      color: rgba(255, 255, 255, 0.6);
    }

    .sort-val {
      font-weight: 500;
      padding: 0 0 0 5px;
      color: #515465;
      display: inline-block;
      vertical-align: middle;
      min-width: 80px;
    }

    .react-select__value-container {
      padding: 0;
    }

    /* .react-select__input {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    } */

    .react-select__menu {
      .react-select__option {
        white-space: normal;

        &:hover:not(.react-select__option--is-focused),
        &:hover:not(.react-select__option--is-selected) {
          color: rgba(255, 255, 255, 0.4);
        }
      }
    }

    .react-select__control {
      cursor: pointer;
      border: none !important;
      min-height: inherit;
      font-size: 13px;
      font-weight: 500;
      background: none !important;

      .react-select__indicator-separator {
        display: none;
      }

      &:hover {
        .react-select__indicator {
          opacity: 1;
        }
      }

      .react-select__indicators {
        width: auto;
        height: auto;
        background: none !important;
      }

      .react-select__indicator {
        padding: 0;
        opacity: 0.6;
        transition: all 0.4s ease;
      }
    }
  }

  .more-comments {
    margin: 0 -20px;
    padding: 10px 20px 0;
    text-align: center;
    /* border-top: 1px solid var(--pallete-colors-border); */
    font-size: 13px;
    line-height: 15px;
    color: #c8c9cf;

    @media (max-width: 479px) {
      margin: 0 -15px;
      padding: 15px 15px 0;
    }

    a {
      color: #c8c9cf;
      border: 1px solid var(--pallete-colors-border);
      padding: 5px 16px;
      font-size: 13px;
      line-height: 20px;
      border-radius: 40px;
      transition: all 0.4s ease;
      display: inline-block;
      vertical-align: top;

      .sp_dark & {
        color: var(--pallete-text-main);
        border-color: var(--pallete-text-main);

        &:hover {
          /* background: var(--pallete-colors-border);
          color: var(--pallete-text-main); */
          color: var(--pallete-text-main);
          border-color: var(--pallete-text-main);
          opacity: 0.6;
        }
      }

      &:hover {
        /* background: var(--pallete-colors-border);
        color: var(--pallete-text-main); */
      }

      .img {
        display: inline-block;
        vertical-align: middle;
        border-style: solid;
        border-width: 5px 5px 0 5px;
        border-color: var(--pallete-text-main) transparent transparent
          transparent;
        width: 10px;
        height: 10px;
        margin: 5px 12px 0px 0px;
      }

      &:hover {
        color: var(--pallete-primary-light);
      }
    }

    .icon {
      margin: 0 10px 0 0;
    }
  }
`;
