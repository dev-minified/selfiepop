import { getPinPostOnWall } from 'api/sales';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useAppSelector } from 'hooks/useAppSelector';
import useWallHook from 'hooks/useWallHook';
import MyWall from 'pages/Sales/MyWall';
import { useEffect } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { useParams } from 'react-router-dom';
import { setManagedUser } from 'store/reducer/managed-users';
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
  allowActions?: boolean;
}

const WallWrapper = ({ className, buyerId, allowActions = true }: Props) => {
  const { id: managedAccountId } = useParams<{ id?: string }>();
  // const userId = useAuth()?.user?._id;
  const managedUser = useAppSelector((state) => state.managedUsers?.item);

  const dispatch = useAppDispatch();
  const updateUserId: string = managedAccountId || '';

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
  } = useWallHook({ sellerId: updateUserId, buyerId });

  useEffect(() => {
    if (!managedAccountId) {
      dispatch(setManagedUser(undefined));
    }

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
          { sellerId: updateUserId as string },
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
  }, [buyerId, managedAccountId, dispatch]);
  return (
    <MyWall
      allowActions={allowActions}
      managedUser={managedUser}
      managedAccountId={managedAccountId}
      createPost={false}
      backButton={false}
      className={`rightwall ${className}`}
      showAttachmentViwe={isMobileOnly}
      getPaginatedPosts={handlePaginationPosts}
      onToggleCommentLike={onToggleCommentLike}
      onTogglePostLike={onTogglePostLike}
      onCommentspagination={onCommentspagination}
      onAddComemnt={onAddComemnt}
      onDeletePost={onDeletePost}
      onAddReplyToComment={onAddReplyToComment}
      onPostCommentRepliesPagination={onPostCommentRepliesPagination}
      onToggleCommentReplyLike={onToggleCommentReplyLike}
      onPinClick={onPinClick}
      onUnPinPost={onUnPinPost}
    />
  );
};

export default styled(WallWrapper)`
  .post-card {
    margin-left: 15px;
    margin-right: 15px;

    padding: 15px;
  }
`;
