import { getPinPostOnWall } from 'api/sales';
import { useAppDispatch } from 'hooks/useAppDispatch';
import useAuth from 'hooks/useAuth';
import useWallHook from 'hooks/useWallHook';
import MyWall from 'pages/Sales/MyWallModified';
import { useEffect } from 'react';
import { isMobileOnly } from 'react-device-detect';
import {
  resetpostschatmedia,
  setMyPostfetching,
  setPostsaWithPin,
  setUpdateUserPinPost,
} from 'store/reducer/member-post';
import styled from 'styled-components';

interface Props {
  className?: string;
  buyerId?: string;
  sellerId?: string;
  backButton?: boolean;
  createPost?: boolean;
}

const WallWrapper = ({
  className,
  backButton = false,
  createPost = false,
  buyerId,
  sellerId,
}: Props) => {
  const userId = useAuth()?.user?._id;
  const SellerId = sellerId || userId;
  const dispatch = useAppDispatch();
  const {
    handlePaginationPosts,
    onToggleCommentLike,
    onCommentspagination,
    onDeletePost,
    onAddComemnt,
    onAddReplyToComment,
    onPostCommentRepliesPagination,
    onToggleCommentReplyLike,
    onTogglePostLike,
    onPinClick,
    onUnPinPost,
  } = useWallHook({
    sellerId: buyerId ? SellerId : '',
    buyerId,
    isBuyer: !!buyerId,
    isSellerView: true,
  });

  useEffect(() => {
    dispatch(resetpostschatmedia({}));
    dispatch(setUpdateUserPinPost({ items: [], totalCount: 0 }));
    // dispatch(reInitializeState());
    handlePaginationPosts({ skip: 0 })
      .catch((e) => console.log(e))
      .then((d: any) => {
        const data = d?.data as Record<string, any>;
        if (!data?.success && data?.cancelled) {
          dispatch(resetpostschatmedia({}));
          dispatch(setMyPostfetching(true));
          return;
        }
        getPinPostOnWall(
          { sellerId: '' },
          {
            ignoreStatusCodes: [404, 421],
          },
        )
          .then((resp) => {
            if (!!resp?.items?.length) {
              const pinPosts = resp?.items.map((pin: any) => {
                return {
                  ...pin,
                  pinPost: true,
                  id: `sp__${pin._id}`,
                };
              });
              dispatch(setPostsaWithPin({ pinPosts }));
            }
            dispatch(setUpdateUserPinPost(resp));
          })
          .catch((e) => {
            console.log({ e });
          });
      });

    return () => {
      // cancelToken.current.cancel('Operation canceled due to Unmount.');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyerId, SellerId, dispatch]);
  const onPinItemClick = async (item: IPost) => {
    await onPinClick?.(item);
  };
  return (
    <MyWall
      createPost={createPost}
      backButton={backButton}
      className={`memberbuyerWall ${className}`}
      showAttachmentViwe={isMobileOnly}
      getPaginatedPosts={handlePaginationPosts}
      onTogglePostLike={onTogglePostLike}
      onToggleCommentLike={onToggleCommentLike}
      onCommentspagination={onCommentspagination}
      onAddComemnt={onAddComemnt}
      onDeletePost={onDeletePost}
      onAddReplyToComment={onAddReplyToComment}
      onPostCommentRepliesPagination={onPostCommentRepliesPagination}
      onToggleCommentReplyLike={onToggleCommentReplyLike}
      onPinClick={onPinItemClick}
      onUnPinPost={onUnPinPost}
    />
  );
};

export default styled(WallWrapper)`
  .post-card {
    /* margin-left: 15px; */
    margin-right: 15px;

    padding: 15px;
  }
  .list-container {
    padding: 15px;
  }

  .post-scrollerparant {
    padding: 0 11px;
  }
`;
